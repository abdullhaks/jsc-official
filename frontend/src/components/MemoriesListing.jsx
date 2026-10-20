import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, MapPin, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';

const MemoriesListing = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => { api.get('/memories?limit=100').then(({ data }) => setMemories(data.items || data)).catch((error) => console.error('Unable to load memories', error)).finally(() => setLoading(false)); }, []);
  const share = async (memory) => {
    const url = `${window.location.origin}/memories/${memory._id}`;
    if (navigator.share) { try { await navigator.share({ title: memory.title, text: memory.description, url }); } catch (error) { if (error?.name !== 'AbortError') console.error('Memory sharing failed', error); } return; }
    try { await navigator.clipboard.writeText(url); window.alert('Memory link copied to clipboard.'); } catch { window.prompt('Copy this memory link:', url); }
  };
  return <main className="min-h-screen bg-amber-50/40 px-4 pb-24 pt-24 sm:px-6"><div className="mx-auto max-w-7xl">
    <button onClick={() => navigate(-1)} className="mb-7 inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-bold text-amber-800 shadow-sm hover:bg-amber-50"><ArrowLeft className="h-4 w-4" />Go back</button>
    <header className="mb-10 max-w-3xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">JSC community</p><h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">All Memories</h1><p className="mt-3 text-slate-600">A collection of the gatherings, celebrations, and moments we have shared.</p></header>
    {loading ? <p className="py-16 text-center font-semibold text-slate-500">Loading memories…</p> : memories.length === 0 ? <p className="rounded-2xl bg-white p-10 text-center text-slate-600 shadow-sm">No memories have been published yet.</p> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{memories.map((memory) => <article key={memory._id} className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><Link to={`/memories/${memory._id}`} className="block"><img src={memory.imageUrl} alt="" className="h-56 w-full object-cover" /><div className="p-5"><h2 className="text-xl font-bold text-slate-900">{memory.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{memory.description}</p><div className="mt-4 space-y-2 text-sm text-slate-600"><p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-amber-600" />{new Date(memory.date || memory.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-amber-600" />{memory.location || 'JSC'}</p></div></div></Link><div className="border-t border-amber-100 px-5 py-3"><button onClick={() => share(memory)} className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-900"><Share2 className="h-4 w-4" />Share memory</button></div></article>)}</div>}
  </div></main>;
};
export default MemoriesListing;
