import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import * as webpush from 'web-push';
import { Event, EventDocument } from '../events/event.schema';
import { PushSubscriptionDto } from './dto/push-subscription.dto';
import { PushSubscription, PushSubscriptionDocument } from './push-subscription.schema';

type NotificationPayload = { title: string; body: string; url: string; tag: string };

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(PushSubscription.name) private readonly subscriptionModel: Model<PushSubscriptionDocument>,
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    private readonly configService: ConfigService,
  ) {}

  getPublicKey() {
    return { publicKey: this.configService.get<string>('VAPID_PUBLIC_KEY') || null };
  }

  async subscribe(subscription: PushSubscriptionDto) {
    await this.subscriptionModel.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      subscription,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).exec();
    return { subscribed: true };
  }

  async unsubscribe(endpoint: string) {
    await this.subscriptionModel.deleteOne({ endpoint }).exec();
    return { subscribed: false };
  }

  notifyNewEvent(event: { _id: unknown; title: string; date?: Date }) {
    const date = event.date ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(event.date)) : 'soon';
    return this.send({
      title: 'New JSC event',
      body: `${event.title} is happening ${date}.`,
      url: `/events/${event._id}`,
      tag: `event-${event._id}`,
    });
  }

  notifyNewArticle(article: { _id: unknown; title: string }) {
    return this.send({
      title: 'New JSC article', body: article.title, url: `/article/${article._id}`, tag: `article-${article._id}`,
    });
  }

  notifyNewMemory(memory: { _id: unknown; title: string }) {
    return this.send({
      title: 'New JSC memory', body: memory.title, url: `/memories/${memory._id}`, tag: `memory-${memory._id}`,
    });
  }

  notifyNewContent(content: { _id: unknown; title: string }) {
    return this.send({
      title: 'New from JSC', body: content.title, url: '/', tag: `content-${content._id}`,
    });
  }

  @Cron('0 0 7 * * *', { timeZone: 'Asia/Kolkata' })
  async notifyTodaysEvents() {
    const { start, end } = this.getKolkataDayBounds();
    const events = await this.eventModel.find({ date: { $gte: start, $lt: end } }).select('_id title time').exec();
    await Promise.all(events.map((event) => this.send({
      title: 'JSC event today',
      body: event.time ? `${event.title} starts at ${event.time}.` : `${event.title} is happening today.`,
      url: `/events/${event._id}`,
      tag: `event-today-${event._id}`,
    })));
  }

  private async send(payload: NotificationPayload) {
    const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const subject = this.configService.get<string>('VAPID_SUBJECT');
    if (!publicKey || !privateKey || !subject) {
      this.logger.debug('Web Push is not configured; notification was skipped.');
      return;
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);
    const baseUrl = (this.configService.get<string>('PUBLIC_WEB_URL') || '').replace(/\/$/, '');
    const message = JSON.stringify({ ...payload, url: `${baseUrl}${payload.url}` || payload.url });
    const subscriptions = await this.subscriptionModel.find().exec();
    await Promise.all(subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription.toObject(), message, { TTL: 60 * 60 * 24 });
      } catch (error: any) {
        if (error?.statusCode === 404 || error?.statusCode === 410) {
          await this.subscriptionModel.deleteOne({ _id: subscription._id }).exec();
          return;
        }
        this.logger.warn(`Unable to deliver a push notification: ${error?.message || 'unknown error'}`);
      }
    }));
  }

  private getKolkataDayBounds() {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts();
    const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
    const start = new Date(`${values.year}-${values.month}-${values.day}T00:00:00+05:30`);
    return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
  }
}
