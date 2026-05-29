import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  accent: string;
}

export default function FeatureCard({ title, description, accent }: FeatureCardProps) {
  return (
    <motion.div
      className="glass-panel rounded-[26px] border border-white/10 p-6 shadow-xl"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className={`mb-4 inline-flex rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${accent}`}>
        {title}
      </div>
      <p className="text-sm leading-6 text-white/70">{description}</p>
    </motion.div>
  );
}
