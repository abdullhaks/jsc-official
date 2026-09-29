import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Calendar, Eye, Search, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';

const fallbackImage = 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800';

const ArticlesListing = () => {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/articles?limit=100')
      .then((res) => setArticles(res.data.items || res.data || []))
      .catch((error) => console.error('Failed to fetch articles', error))
      .finally(() => setLoading(false));
  }, []);

  const visibleArticles = articles.filter((article) => `${article.title || ''} ${article.excerpt || ''} ${article.category || ''}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 pb-20 pt-28">
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm"><BookOpen className="h-4 w-4" /> Reflections & learning</span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Articles & blogs</h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">Explore thoughtful writing on spirituality, education and community life from Jeelani Studies Centre.</p>
        </motion.div>

        <label className="mx-auto mt-9 flex max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search className="h-5 w-5 text-emerald-700" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles" className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" />
        </label>

        {loading ? <p className="py-24 text-center font-medium text-slate-500">Loading articles…</p> : visibleArticles.length === 0 ? <p className="py-24 text-center text-slate-500">No articles match your search yet.</p> : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleArticles.map((article, index) => (
              <motion.article key={article._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.05, 0.35) }} className="group flex cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" onClick={() => navigate(`/article/${article._id}`)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(`/article/${article._id}`); }} role="link" tabIndex={0}>
                <div className="flex w-full flex-col">
                  <div className="relative h-52 overflow-hidden">
                    <img src={article.coverImageUrl || article.coverImage || fallbackImage} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-800 backdrop-blur">{article.category || 'Article'}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" /> {article.author?.name || 'JSC'}</span><span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Latest'}</span>{article.views != null && <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {article.views}</span>}</div>
                    <h2 className="mt-4 line-clamp-2 text-xl font-bold text-slate-900">{article.title}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{article.excerpt || 'Read this reflection from Jeelani Studies Centre.'}</p>
                    <Link to={`/article/${article._id}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-900">Read article <ArrowRight className="h-4 w-4" /></Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ArticlesListing;
