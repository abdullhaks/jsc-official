import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, Clock, ExternalLink, MapPin, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import dhikr from '../assets/dhikr.jpg';

const share = async (event) => {
  const url = `${window.location.origin}/events/${event._id}`;
  const data = { title: event.title, text: event.description, url };
  if (navigator.share) {
    try { await navigator.share(data); } catch (error) { if (error?.name !== 'AbortError') console.error('Event sharing failed', error); }
    return;
  }
  try { await navigator.clipboard.writeText(url); window.alert('Event link copied to clipboard.'); } catch { window.prompt('Copy this event link:', url); }
};

const EventsListing = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/events?limit=100').then(({ data }) => setEvents(data.items || data)).catch((error) => console.error('Unable to load events', error)).finally(() => setLoading(false));
  }, []);

  return <main className="min-h-screen bg-slate-50 px-4 pb-24 pt-24 sm:px-6">
    <div className="mx-auto max-w-7xl">
      <button onClick={() => navigate(-1)} className="mb-7 inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-bold text-indigo-800 shadow-sm hover:bg-indigo-50"><ArrowLeft className="h-4 w-4" />Go back</button>
      <header className="mb-10 max-w-3xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">JSC programmes</p><h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">All Events</h1><p className="mt-3 text-slate-600">Explore upcoming and past community programmes. Open an event for its complete details or share it with your community.</p></header>
      <section aria-labelledby="regular-programmes" className="mb-12"><h2 id="regular-programmes" className="mb-5 text-2xl font-black text-slate-900">Regular Majlis Programmes</h2><div className="grid gap-5 md:grid-cols-2"><article className="overflow-hidden rounded-3xl border border-indigo-200 bg-white shadow-sm"><div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" /><div className="p-6"><p className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-800">Weekly · Every Friday</p><h3 className="mt-4 text-xl font-black text-slate-900">Swalath Majlis</h3><p className="mt-3 flex items-center gap-2 text-sm text-slate-600"><Clock className="h-4 w-4 text-indigo-600" />After Maghrib Prayers</p><p className="mt-2 flex items-start gap-2 text-sm text-slate-600"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />Jeelani Masjid, Valanchery, Malappuram, Kerala</p><a href="https://maps.app.goo.gl/VY6p12Zt2vt8C8W69" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-700 hover:text-indigo-900"><ExternalLink className="h-4 w-4" />Open in Maps</a></div></article><article className="overflow-hidden rounded-3xl border border-purple-200 bg-white shadow-sm"><div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500" /><div className="p-6"><p className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-800">Monthly · 2nd Sunday</p><h3 className="mt-4 text-xl font-black text-slate-900">Swalath Majlis</h3><p className="mt-3 flex items-center gap-2 text-sm text-slate-600"><Clock className="h-4 w-4 text-purple-600" />After Maghrib Prayers</p><p className="mt-2 flex items-start gap-2 text-sm text-slate-600"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />Sheikh Jeelani Islamic Academy, Mankery, Irimbiliyam, Malappuram, Kerala</p><a href="https://maps.app.goo.gl/tRXGDLnN5P8Ac8z46" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-purple-700 hover:text-purple-900"><ExternalLink className="h-4 w-4" />Open in Maps</a></div></article></div></section>
      {loading ? <p className="py-16 text-center font-semibold text-slate-500">Loading events…</p> : events.length === 0 ? <p className="rounded-2xl bg-white p-10 text-center text-slate-600 shadow-sm">No events have been published yet.</p> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => <article key={event._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <Link to={`/events/${event._id}`} className="block"><img src={event.imageUrl || dhikr} alt="" className="h-52 w-full object-cover" /><div className="p-5"><h2 className="text-xl font-bold text-slate-900">{event.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{event.description}</p><div className="mt-4 space-y-2 text-sm text-slate-600"><p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-indigo-600" />{event.date ? new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'Date to be confirmed'}</p>{event.time && <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-indigo-600" />{event.time}</p>}<p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-indigo-600" />{event.venue}</p></div></div></Link>
          <div className="border-t border-slate-100 px-5 py-3"><button onClick={() => share(event)} className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700 hover:text-indigo-900"><Share2 className="h-4 w-4" />Share event</button></div>
        </article>)}
      </div>}
    </div>
  </main>;
};

export default EventsListing;
