import { motion } from 'framer-motion';
import { TimelineClip as Clip } from '../store/editorStore';

interface TimelineClipProps {
  clip: Clip;
  isSelected: boolean;
  onSelect: () => void;
}

export default function TimelineClip({ clip, isSelected, onSelect }: TimelineClipProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
      className={`relative flex min-w-[13rem] flex-col overflow-hidden rounded-[22px] border p-3 text-left shadow-xl transition ${
        isSelected ? 'border-accent bg-white/10' : 'border-white/10 bg-[#0f1320]/90 hover:border-white/20'
      }`}
    >
      <div className="relative h-28 overflow-hidden rounded-2xl bg-slate-900">
        <img src={clip.thumbnail} alt={clip.label} className="h-full w-full object-cover brightness-90 transition duration-300" />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 text-xs text-white/90">
          {clip.label}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{clip.label}</p>
          <p className="text-xs uppercase tracking-[0.24em] text-white/40">{clip.duration}s</p>
        </div>
        <span className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${clip.color}`} />
      </div>
    </motion.button>
  );
}
