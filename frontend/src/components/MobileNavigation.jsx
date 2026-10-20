import { motion } from 'framer-motion';
import { BookOpen, CalendarDays, FileText, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import quranIcon from '../assets/quran.png';
import tasbihIcon from '../assets/tasbih.png';

const TasbihIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M15.9 4.1a7.1 7.1 0 1 0 2.1 5.1" />
    <circle cx="17.1" cy="4.1" r="1.6" /><circle cx="20" cy="7.7" r="1.45" /><circle cx="19.3" cy="12" r="1.45" /><circle cx="16.8" cy="15.6" r="1.45" />
    <path d="m15.7 16.8-1 3.2-1.5-1.2-1.6 1.1.6-3.2" />
  </svg>
);

const MobileNavigation = ({ activeEventCount = 0 }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const items = [
    { label: 'Home', icon: Home, action: () => navigate('/'), active: pathname === '/', iconColor: 'text-sky-600', hoverColor: 'hover:bg-sky-50', activeColor: 'bg-sky-600 shadow-sky-600/25', focusColor: 'focus-visible:ring-sky-500' },
    { label: 'Quran', icon: BookOpen, iconSrc: quranIcon, action: () => navigate('/quran'), active: pathname.startsWith('/quran') || pathname.startsWith('/surah'), iconColor: 'text-emerald-700', hoverColor: 'hover:bg-emerald-50', activeColor: 'bg-emerald-600 shadow-emerald-600/25', focusColor: 'focus-visible:ring-emerald-500' },
    { label: 'Dhikr', icon: TasbihIcon, iconSrc: tasbihIcon, action: () => navigate('/dhikr'), active: pathname === '/dhikr' || pathname.startsWith('/dhikr/'), iconColor: 'text-amber-700', hoverColor: 'hover:bg-amber-50', activeColor: 'bg-amber-600 shadow-amber-600/25', focusColor: 'focus-visible:ring-amber-500' },
    { label: 'Articles', icon: FileText, action: () => navigate('/articles'), active: pathname.startsWith('/article'), iconColor: 'text-violet-600', hoverColor: 'hover:bg-violet-50', activeColor: 'bg-violet-600 shadow-violet-600/25', focusColor: 'focus-visible:ring-violet-500' },
    { label: 'Events', icon: CalendarDays, action: () => {
      navigate('/events');
    }, active: pathname === '/events' || pathname.startsWith('/events/') || pathname.startsWith('/event/'), badge: activeEventCount, iconColor: 'text-rose-600', hoverColor: 'hover:bg-rose-50', activeColor: 'bg-rose-600 shadow-rose-600/25', focusColor: 'focus-visible:ring-rose-500' },
  ];

  return (
    <nav aria-label="Mobile quick navigation" className="fixed bottom-3 left-1/2 z-[55] block w-[min(94%,31rem)] -translate-x-1/2 lg:hidden">
      <div className="grid grid-cols-5 rounded-[1.65rem] border border-white/55 bg-white/72 p-1.5 shadow-[0_16px_48px_rgba(15,23,42,0.22)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/58">
        {items.map(({ label, icon: Icon, iconSrc, action, active, badge, iconColor, hoverColor, activeColor, focusColor }) => (
          <button key={label} onClick={action} className={`relative flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold text-slate-500 outline-none transition ${hoverColor} ${focusColor} focus-visible:ring-2`}>
            {active && <motion.span layoutId="mobile-island-active" className={`absolute inset-0 rounded-2xl ${activeColor} shadow-lg`} transition={{ type: 'spring', stiffness: 480, damping: 33 }} />}
            {iconSrc ? <img src={iconSrc} alt="" className={`relative z-10 h-5 w-5 object-contain ${active ? 'brightness-0 invert' : 'drop-shadow-sm'}`} /> : <Icon className={`relative z-10 h-5 w-5 ${active ? 'text-white' : iconColor}`} />}
            {badge > 0 && <span className="absolute right-1 top-1 z-20 grid min-w-4 h-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">{badge > 99 ? '99+' : badge}</span>}
            <span className={`relative z-10 truncate ${active ? 'text-white' : ''}`}>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
