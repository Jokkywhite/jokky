import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export default function GlassCard({ title, description, icon, children }: GlassCardProps) {
  return (
    <motion.div
      className="glass-panel rounded-[28px] border border-white/10 p-6 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flex items-start gap-4">
        {icon && <div className="shrink-0 text-3xl">{icon}</div>}
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          {description && <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>}
        </div>
      </div>
      {children && <div className="mt-5">{children}</div>}
    </motion.div>
  );
}
