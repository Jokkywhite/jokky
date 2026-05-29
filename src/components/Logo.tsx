import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <motion.div
      className="flex items-center gap-3 text-white"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-glow">
        <span className="font-semibold tracking-[0.2em] text-sm text-white/90">J</span>
      </div>
      <div className="space-y-0.5">
        <p className="text-lg font-semibold tracking-[0.04em]">Jokky White Editing</p>
        <p className="text-xs uppercase tracking-[0.26em] text-white/40">Create Without Limits</p>
      </div>
    </motion.div>
  );
}
