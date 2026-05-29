import { motion } from 'framer-motion';

interface ToolButtonProps {
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export default function ToolButton({ label, active = false, icon, onClick }: ToolButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${
        active
          ? 'border-accent bg-white/10 text-white shadow-glow'
          : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10'
      }`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
    </motion.button>
  );
}
