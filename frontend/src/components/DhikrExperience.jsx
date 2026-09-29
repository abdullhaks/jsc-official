import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookMarked, ChevronRight, Clock3, Sparkles } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import swalathData from '../assets/swalath.json';

const timeLabels = swalathData.meta.timeKeys;

const makeReadings = () => swalathData.swalaths.map((swalath) => ({
  ...swalath,
  sections: swalathData.pages.flatMap((page) => page.sections.filter((section) => section.swalathId === swalath.id).map((section) => ({ ...section, page: page.numberAr }))),
}));

const RecitationInfo = ({ rules }) => rules?.length ? (
  <div className="flex flex-wrap gap-2">
    {rules.map((rule, index) => <span key={index} dir="rtl" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 ring-1 ring-amber-200"><Clock3 className="h-3.5 w-3.5" />{rule.count} مرّة · {rule.times.map((time) => timeLabels[time] || (time === 'anytime' ? 'في أي وقت' : '')).filter(Boolean).join('، ')}</span>)}
  </div>
) : null;

const Contents = ({ readings }) => {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-[#f5f8f6] pb-10 pt-20 text-slate-800 sm:pt-24">
      <section className="relative overflow-hidden border-y-4 border-[#c8a65a] bg-[#062f28] px-5 py-10 text-white shadow-[inset_0_0_0_1px_rgba(255,225,150,0.22)] sm:px-8 sm:py-14">
        <div className="pointer-events-none absolute inset-3 border border-[#d9bc75]/45" />
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e5c878 1px, transparent 1.5px)', backgroundSize: '26px 26px' }} />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3 text-[#e8cc7d]"><span className="h-px w-10 bg-[#d6b861]" />✦<span className="h-px w-10 bg-[#d6b861]" /></div>
          <h1 dir="rtl" lang="ar" className="mt-4 font-serif text-4xl font-bold tracking-tight text-[#fff8df] sm:text-5xl">الصلاة الجيلانية</h1>
          <div className="mt-5 flex items-center justify-center gap-3 text-[#e8cc7d]"><span className="h-px w-16 bg-[#d6b861]" />❖<span className="h-px w-16 bg-[#d6b861]" /></div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-7 sm:px-6">
        <button onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')} dir="rtl" className="mb-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3.5 py-2.5 text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">رجوع <ArrowLeft className="h-4 w-4" /></button>
        <div dir="rtl" className="mb-5 flex items-center justify-between"><div><p className="font-serif text-2xl font-bold text-emerald-900">فهرس الصلوات</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{readings.length}</span></div>
        <div className="space-y-3">
          {readings.map((reading, index) => (
            <motion.div key={reading.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.035, 0.3) }}>
            <Link to={`/dhikr/${encodeURIComponent(reading.id)}`} className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-sm font-extrabold text-emerald-800">{reading.order}</span>
              <div dir="rtl" lang="ar" className="min-w-0 flex-1"><span className="block truncate font-serif text-xl font-bold text-emerald-900">{reading.titleAr}</span><div className="mt-2"><RecitationInfo rules={reading.recitation} /></div></div>
              <ChevronRight className="h-5 w-5 shrink-0 text-emerald-700 transition-transform group-hover:translate-x-1" />
            </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

const Reader = ({ reading }) => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [reading.id]);
  return (
    <main className="min-h-screen bg-[#f5f8f6] pb-12 pt-20 text-slate-800 sm:pt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <button onClick={() => navigate('/dhikr')} dir="rtl" className="mb-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3.5 py-2.5 text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">فهرس الصلوات <ArrowLeft className="h-4 w-4" /></button>
        <article className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-lg shadow-emerald-950/5">
          <header className="relative overflow-hidden border-b-4 border-[#c8a65a] bg-[#062f28] px-5 py-7 text-white sm:px-10 sm:py-9">
            <div className="pointer-events-none absolute inset-3 border border-[#d9bc75]/40" />
            <div className="relative"><span dir="rtl" className="inline-flex items-center gap-2 text-sm font-bold text-[#f6df9b]"><BookMarked className="h-4 w-4" /> الورد {reading.order}</span>
            <h1 dir="rtl" className="mt-3 font-serif text-3xl font-bold text-[#fff8df] sm:text-4xl">{reading.titleAr}</h1>
            <div className="mt-5"><RecitationInfo rules={reading.recitation} /></div>
            </div>
          </header>
          <div className="space-y-9 px-5 py-8 sm:px-10 sm:py-11">
            {reading.sections.map((section, sectionIndex) => (
              <section key={`${section.id}-${sectionIndex}`}>
                {section.title && <h2 dir="rtl" lang="ar" className="mb-5 text-center font-serif text-2xl font-bold text-emerald-950">{section.title}</h2>}
                {section.instructions?.length > 0 && <div dir="rtl" className="mb-6 flex flex-wrap justify-center gap-2">{section.instructions.map((instruction, index) => <span key={index} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-900">{instruction.text}</span>)}</div>}
                <div dir="rtl" lang="ar" className="space-y-5 font-serif text-[1.4rem] leading-[2.3] text-slate-800 sm:text-[1.7rem]">
                  {section.blocks.map((block, index) => {
                    if (block.type === 'divider') return <div key={index} className="border-t border-dotted border-emerald-300" />;
                    if (block.type === 'names') return <p key={index} className="text-center leading-[2.15]">{block.prefix && <span>{block.prefix} </span>}{block.items.map((name, nameIndex) => <span key={nameIndex}>{name} <span className="text-emerald-700">{block.salutation}</span>{nameIndex < block.items.length - 1 ? '، ' : ''}</span>)}</p>;
                    return <p key={index} className={block.align === 'center' ? 'text-center' : 'text-right'}>{block.text}{block.repeat && <span className="mr-3 inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 align-middle font-sans text-xs font-bold text-emerald-800">{block.repeat.display}</span>}</p>;
                  })}
                </div>
                {section.endDivider === 'star' && <div className="mt-8 flex items-center gap-3 text-emerald-600"><span className="h-px flex-1 bg-emerald-200" /><Sparkles className="h-4 w-4" /><span className="h-px flex-1 bg-emerald-200" /></div>}
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
};

const DhikrExperience = () => {
  const { id } = useParams();
  const readings = useMemo(makeReadings, []);
  const selectedId = id ? decodeURIComponent(id).trim().toLowerCase() : '';
  const reading = readings.find((item) => item.id.toLowerCase() === selectedId);
  if (id && !reading) return <main dir="rtl" className="min-h-screen bg-[#f5f8f6] px-4 pt-28 text-center"><p className="font-serif text-xl font-bold text-slate-800">لم يتم العثور على هذا الورد.</p><Link to="/dhikr" className="mt-5 inline-flex rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white">فهرس الصلوات</Link></main>;
  return reading ? <Reader reading={reading} /> : <Contents readings={readings} />;
};

export default DhikrExperience;
