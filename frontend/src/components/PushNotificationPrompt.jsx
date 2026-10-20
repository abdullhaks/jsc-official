import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { api } from '../api/axios';

const toUint8Array = (value) => {
  const padded = `${value}${'='.repeat((4 - value.length % 4) % 4)}`.replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(padded);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
};

const canUsePush = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

const createSubscription = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Notifications were not enabled in this browser.');
  const { data } = await api.get('/notifications/vapid-public-key');
  if (!data.publicKey) throw new Error('Notifications are not configured yet.');
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription()
    || await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toUint8Array(data.publicKey) });
  await api.post('/notifications/subscriptions', subscription.toJSON());
  return subscription;
};

const PushNotificationPrompt = () => {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (canUsePush() && Notification.permission === 'default' && !sessionStorage.getItem('jsc-push-dismissed')) setVisible(true);
  }, []);
  const dismiss = () => { sessionStorage.setItem('jsc-push-dismissed', 'true'); setVisible(false); };
  const enable = async () => {
    setStatus('Enabling…');
    try {
      await createSubscription();
      setStatus('Notifications are enabled.');
      window.setTimeout(() => setVisible(false), 1400);
    } catch (error) { console.error('Unable to enable notifications', error); setStatus('We could not enable notifications on this device.'); }
  };
  if (!visible) return null;
  return <aside className="fixed bottom-24 left-4 right-4 z-[60] mx-auto max-w-md rounded-2xl border border-emerald-100 bg-white p-4 shadow-2xl lg:bottom-5" role="status"><button onClick={dismiss} aria-label="Dismiss notification prompt" className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"><X className="h-4 w-4" /></button><div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Bell className="h-5 w-5" /></span><div className="min-w-0"><p className="font-bold text-slate-900">Stay updated with JSC</p><p className="mt-1 text-sm text-slate-600">Get new-event, today’s-event, article, and community update notifications.</p><div className="mt-3 flex items-center gap-3"><button onClick={enable} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-800">Enable notifications</button>{status && <span className="text-xs text-slate-500">{status}</span>}</div></div></div></aside>;
};

export const PushNotificationSettings = () => {
  const [subscription, setSubscription] = useState(null);
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!canUsePush()) return;
    setSupported(true);
    navigator.serviceWorker.ready.then((registration) => registration.pushManager.getSubscription()).then(setSubscription).catch(() => undefined);
  }, []);

  const enable = async () => {
    setStatus('Enabling…');
    try { setSubscription(await createSubscription()); setStatus('Notifications are enabled on this device.'); } catch (error) { setStatus(error.message || 'Unable to enable notifications.'); }
  };

  const disable = async () => {
    if (!subscription) return;
    setStatus('Disabling…');
    try {
      await api.delete('/notifications/subscriptions', { data: { endpoint: subscription.endpoint } });
      await subscription.unsubscribe();
      setSubscription(null);
      setStatus('Notifications are disabled on this device.');
    } catch { setStatus('Unable to update notification settings. Please try again.'); }
  };

  if (!supported) return null;
  return <div className="mt-5"><button onClick={subscription ? disable : enable} className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-500/10 px-3 py-2 text-sm font-bold text-emerald-100 transition hover:bg-emerald-500/20"><Bell className="h-4 w-4" />{subscription ? 'Turn off notifications' : 'Enable notifications'}</button>{status && <p className="mt-2 text-xs text-gray-300">{status}</p>}</div>;
};
export default PushNotificationPrompt;
