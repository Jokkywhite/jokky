import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GlassCard from '../components/GlassCard';

const statCards = [
  { title: 'Recent Projects', value: '7 Projects', description: 'Jump back into your latest edits.' },
  { title: 'Cloud Ideas', value: 'AI Tools', description: 'Scene detection, automatic subtitles, and style presets.' },
  { title: 'Storage', value: '24 GB / 50 GB', description: 'Premium space for cinematic exports and source media.' },
];

const tools = ['AI Subtitles', 'Voiceover', 'Auto edit', 'Background removal', 'Scene detection', 'Avatar creation'];

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <section className="glass-panel rounded-[36px] border border-white/10 p-8 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/50">{t('dashboard.recent')}</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">{t('dashboard.workspaceTitle')}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">{t('dashboard.workspaceCopy')}</p>
          </div>
          <Link
            to="/editor"
            className="inline-flex items-center justify-center rounded-3xl bg-accent px-6 py-4 text-sm font-semibold text-white transition hover:bg-violet-400"
          >
            {t('dashboard.create')}
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {statCards.map((card) => (
          <GlassCard key={card.title} title={card.title} description={`${card.value} — ${card.description}`} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="glass-panel rounded-[36px] border border-white/10 p-8 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">{t('dashboard.tools')}</p>
              <h3 className="mt-4 text-3xl font-semibold text-white">{t('dashboard.aiWorkflow')}</h3>
            </div>
            <span className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/60">Pro</span>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {tools.map((tool) => (
              <div key={tool} className="rounded-[28px] border border-white/10 bg-[#0f1320]/90 p-5 text-white/70 transition hover:border-accent hover:text-white">
                <p className="font-semibold text-white">{tool}</p>
                <p className="mt-2 text-sm">Modern AI support for premium storytelling.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[36px] border border-white/10 p-8 shadow-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">{t('dashboard.history')}</p>
          <h3 className="mt-4 text-3xl font-semibold text-white">Export history</h3>
          <div className="mt-8 space-y-4">
            {['JWE_Project_01.mp4', 'Promo_Cut_04.mp4', 'Cinematic_Showcase.mp4'].map((file) => (
              <div key={file} className="rounded-3xl border border-white/10 bg-[#0d1120]/90 p-4 text-sm text-white/70">
                <div className="flex items-center justify-between gap-4">
                  <p>{file}</p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">Complete</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
