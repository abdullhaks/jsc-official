import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import appIcon from '../assets/JSC_APP_ICON2.png';

const PWAInstallPrompt = () => {
  const [installEvent, setInstallEvent] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSSteps, setShowIOSSteps] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    if (standalone || sessionStorage.getItem('jsc-pwa-dismissed')) return undefined;

    if (ios) {
      const timer = window.setTimeout(() => setVisible(true), 1800);
      return () => window.clearTimeout(timer);
    }

    const onInstallPrompt = (event) => {
      event.preventDefault();
      setInstallEvent(event);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onInstallPrompt);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem('jsc-pwa-dismissed', 'true');
  };

  const install = async () => {
    if (isIOS) {
      setShowIOSSteps(true);
      return;
    }
    if (!installEvent) return;
    installEvent.prompt();
    const result = await installEvent.userChoice;
    if (result.outcome === 'accepted') setVisible(false);
    setInstallEvent(null);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: 'spring', stiffness: 330, damping: 27 }}
            className="fixed bottom-24 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 lg:bottom-5"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-slate-950/95 p-3.5 text-white shadow-2xl backdrop-blur-2xl">
              <img src={appIcon} alt="JSC app" className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-white/20" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">Install JSC App</p>
                <p className="mt-0.5 text-xs text-slate-300">Quick access to Quran, dhikr and updates.</p>
              </div>
              <button onClick={install} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95">
                <Download className="h-4 w-4" /> Install
              </button>
              <button onClick={dismiss} aria-label="Dismiss install prompt" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIOSSteps && (
          <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl">
              <img src={appIcon} alt="JSC app" className="mx-auto mb-4 h-16 w-16 rounded-2xl ring-1 ring-white/15" />
              <h2 className="text-center text-lg font-bold">Add JSC to your Home Screen</h2>
              <p className="mt-2 text-center text-sm text-slate-300">In Safari, follow these three quick steps.</p>
              <ol className="mt-5 space-y-3 text-sm text-slate-200">
                <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-400/15 font-bold text-emerald-300">1</span><span>Tap the <Share className="inline h-4 w-4 text-sky-300" /> <strong>Share</strong> button in the browser toolbar.</span></li>
                <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-400/15 font-bold text-emerald-300">2</span><span>Choose <PlusSquare className="inline h-4 w-4 text-emerald-300" /> <strong>Add to Home Screen</strong>.</span></li>
                <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-400/15 font-bold text-emerald-300">3</span><span>Tap <strong>Add</strong> to finish.</span></li>
              </ol>
              <button onClick={() => setShowIOSSteps(false)} className="mt-6 w-full rounded-xl bg-white/10 py-3 text-sm font-bold transition hover:bg-white/15">Got it</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PWAInstallPrompt;
