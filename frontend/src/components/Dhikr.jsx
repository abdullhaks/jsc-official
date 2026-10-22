import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookMarked, ChevronRight, Clock3, Heart, Sparkles } from 'lucide-react';
import swalathData from '../assets/swalath.json';

const timeLabels = swalathData.meta.timeKeys;

const Dhikr = () => {
  const [activeId, setActiveId] = useState(swalathData.swalaths[0].id);
  const readings = useMemo(() => swalathData.swalaths.map((swalath) => ({
    ...swalath,
    sections: swalathData.pages.flatMap((page) => page.sections.filter((section) => section.swalathId === swalath.id).map((section) => ({ ...section, page: page.numberAr }))),
  })), []);
  const jumpTo = (id) => {
    setActiveId(id);
    window.setTimeout(() => document.getElementById(`dhikr-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return (
    <main className="min-h-screen bg-[#f8faf9] pb-20 pt-24 text-slate-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 px-5 pb-16 pt-16 text-white sm:px-8">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100 backdrop-blur"><Heart className="h-4 w-4" /> Daily remembrance</span>
          <h1 dir="rtl" lang="ar" className="mt-5 font-serif text-4xl font-bold tracking-tight sm:text-5xl">صلّوا على الحبيب ﷺ</h1>
          <p dir="rtl" lang="ar" className="mx-auto mt-4 max-w-2xl font-serif text-xl leading-9 text-emerald-100">اوراد مأثورة عن المشايخ في الصلاه على النبي المختار ﷺ<br />الترتيب والاجازة<br />الشيخ محمد عبد الرحيم شاه القادري الجشتي</p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-emerald-100/90 sm:text-base">A calm, focused reading space for the selected salawath and dhikr. Choose a remembrance below, then read without distraction.</p>
        </div>
      </section>

      <section className="mx-auto -mt-7 max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl border border-emerald-100 bg-white p-3 shadow-xl shadow-emerald-950/10">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {readings.map((item) => (
              <button key={item.id} onClick={() => jumpTo(item.id)} className={`relative shrink-0 rounded-2xl px-4 py-3 text-left transition ${activeId === item.id ? 'bg-emerald-700 text-white shadow-md' : 'bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100'}`}>
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-75">{item.order}</span>
                <span className="block text-xs font-bold">{item.titleEn}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside className="hidden h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:block">
            <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Contents</p>
            <div className="space-y-1">
              {readings.map((item) => <button key={item.id} onClick={() => jumpTo(item.id)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${activeId === item.id ? 'bg-emerald-50 font-bold text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">{item.order}</span><span className="min-w-0 flex-1 truncate">{item.titleEn}</span><ChevronRight className="h-4 w-4" /></button>)}
            </div>
          </aside>

          <div className="space-y-8">
            {readings.map((reading) => (
              <article id={`dhikr-${reading.id}`} key={reading.id} className="scroll-mt-28 overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-sm">
                <header className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-6 sm:px-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-emerald-700"><BookMarked className="h-4 w-4" /> Reading {reading.order}</span><h2 className="mt-3 text-2xl font-bold text-slate-900">{reading.titleEn}</h2><p dir="rtl" lang="ar" className="mt-2 font-serif text-2xl text-emerald-900">{reading.titleAr}</p></div>
                    {reading.recitation?.length > 0 && <div className="max-w-xs space-y-2">{reading.recitation.map((rule, index) => <div key={index} className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800"><Clock3 className="h-4 w-4 shrink-0" /><span>{rule.count} times · {rule.times.map((time) => timeLabels[time] || time).join(', ')}</span></div>)}</div>}
                  </div>
                </header>
                <div className="space-y-8 px-5 py-8 sm:px-10 sm:py-10">
                  {reading.sections.map((section, sectionIndex) => (
                    <section key={`${section.id}-${sectionIndex}`}>
                      {section.title && <h3 dir="rtl" lang="ar" className="mb-5 text-center font-serif text-2xl font-bold text-emerald-950">{section.title}</h3>}
                      {section.instructions?.length > 0 && <div dir="rtl" className="mb-6 flex flex-wrap justify-center gap-2">{section.instructions.map((instruction, index) => <span key={index} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-900">{instruction.text}</span>)}</div>}
                      <div dir="rtl" lang="ar" className="space-y-5 font-serif text-[1.45rem] leading-[2.35] text-slate-800 sm:text-[1.7rem]">
                        {section.blocks.map((block, index) => {
                          if (block.type === 'divider') return <div key={index} className="border-t border-dotted border-emerald-300" />;
                          if (block.type === 'names') return <p key={index} className="text-center leading-[2.15]">{block.prefix && <span>{block.prefix} </span>}{block.items.map((name, nameIndex) => <span key={nameIndex} className="inline">{name} <span className="text-emerald-700">{block.salutation}</span>{nameIndex < block.items.length - 1 ? '، ' : ''}</span>)}</p>;
                          return <p key={index} className={`${block.align === 'center' ? 'text-center' : 'text-right'} ${block.indentFirstLine ? 'sm:pr-8' : ''}`}>{block.text}{block.repeat && <span className="mr-3 inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 align-middle font-sans text-xs font-bold text-emerald-800">{block.repeat.display}</span>}</p>;
                        })}
                      </div>
                      {section.endDivider === 'star' && <div className="mt-8 flex items-center gap-3 text-emerald-600"><span className="h-px flex-1 bg-emerald-200" /><Sparkles className="h-4 w-4" /><span className="h-px flex-1 bg-emerald-200" /></div>}
                    </section>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dhikr;
