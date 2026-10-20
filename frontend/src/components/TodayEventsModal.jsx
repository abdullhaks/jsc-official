import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const TodayEventsModal = ({ events = [] }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!events.length) return;
    const key = `jsc-today-events-${new Date().toLocaleDateString('en-CA')}`;
    if (!sessionStorage.getItem(key)) {
      setOpen(true);
      sessionStorage.setItem(key, 'shown');
    }
  }, [events]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="today-events-title">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-2xl">
        <div className="relative bg-gradient-to-br from-emerald-950 to-teal-800 px-6 py-6 text-white">
          <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 rounded-lg p-1.5 text-emerald-100 transition hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-200"><CalendarDays className="h-4 w-4" /> Happening today</span>
          <h2 id="today-events-title" className="mt-3 text-2xl font-bold">Today’s events</h2>
          <p className="mt-1 text-sm text-emerald-100">Join us at Jeelani Studies Centre.</p>
        </div>
        <div className="max-h-[55vh] space-y-3 overflow-y-auto p-4">
          {events.map((event) => (
            <Link key={event._id} to={`/events/${event._id}`} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 transition hover:border-emerald-200 hover:bg-emerald-50">
              {event.imageUrl ? <img src={event.imageUrl} alt="" className="h-14 w-14 rounded-xl object-cover" /> : <span className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><CalendarDays className="h-6 w-6" /></span>}
              <span className="min-w-0 flex-1"><span className="block truncate font-bold text-slate-900">{event.title}</span><span className="mt-1 flex items-center gap-1.5 text-xs text-slate-600"><MapPin className="h-3.5 w-3.5 text-emerald-700" />{event.venue || 'Venue'}{event.time ? ` · ${event.time}` : ''}</span></span>
            </Link>
          ))}
        </div>
        <div className="flex justify-end border-t border-slate-100 p-4"><button onClick={() => setOpen(false)} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800">Close</button></div>
      </div>
    </div>
  );
};

export default TodayEventsModal;
