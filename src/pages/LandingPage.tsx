import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import { useTranslation } from 'react-i18next';

const features = [
  { title: 'landing.featureAiEditingTitle', description: 'landing.featureAiEditingDescription', accent: 'text-violet-100 bg-violet-500/10' },
  { title: 'landing.featureTimelineTitle', description: 'landing.featureTimelineDescription', accent: 'text-sky-100 bg-sky-500/10' },
  { title: 'landing.featureExportTitle', description: 'landing.featureExportDescription', accent: 'text-fuchsia-100 bg-fuchsia-500/10' },
];

const aiTools = [
  'landing.toolSubtitles',
  'landing.toolVoiceover',
  'landing.toolAutoEditing',
  'landing.toolSceneDetection',
  'landing.toolBackgroundRemoval',
  'landing.toolAvatarGeneration',
];

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-surface2/80 p-8 shadow-glow backdrop-blur-xl sm:p-12">
        <div className="absolute inset-x-0 top-0 h-44 bg-hero-glow opacity-70 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
                {t('landing.heroBadge')}
              </p>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                {t('landing.headline')}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{t('landing.subtitle')}</p>
            </motion.div>

            <motion.div className="flex flex-col gap-4 sm:flex-row" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
              <Link to="/editor" className="inline-flex items-center justify-center rounded-3xl bg-accent px-6 py-4 text-sm font-semibold text-white shadow-glow transition hover:bg-violet-400">
                {t('landing.start')}
              </Link>
              <a href="#demo" className="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white/80 transition hover:bg-white/10">
                {t('landing.demo')}
              </a>
            </motion.div>
          </div>

          <motion.div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#090c14]/80 p-4 shadow-xl" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <div className="pointer-events-none absolute -top-10 right-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="aspect-[16/10] overflow-hidden rounded-[28px] border border-white/10 bg-black/70 shadow-2xl">
              <div className="flex h-full flex-col justify-between p-6">
                <div className="space-y-4">
                  <div className="h-2.5 w-24 rounded-full bg-white/10" />
                  <div className="grid gap-3">
                    <div className="h-36 rounded-3xl bg-gradient-to-br from-slate-800 via-black to-slate-900" />
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-violet-500 to-sky-500" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 rounded-full bg-white/10" />
                        <div className="h-2 w-1/3 rounded-full bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  <p className="font-semibold text-white">{t('landing.showcaseProduct')}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/40">{t('landing.showcaseCaption')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="demo" className="grid gap-6 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={t(feature.title)}
            description={t(feature.description)}
            accent={feature.accent}
          />
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.65fr_0.35fr]">
        <div className="glass-panel rounded-[36px] border border-white/10 p-8 shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">{t('landing.aiTools')}</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">{t('landing.aiToolsTitle')}</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/70">{t('landing.aiToolsSubtitle')}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {aiTools.map((tool) => (
              <div key={tool} className="rounded-3xl border border-white/10 bg-[#0f1320]/90 p-5 text-sm text-white/70 shadow-sm transition hover:border-accent hover:text-white">
                {t(tool)}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[36px] border border-white/10 p-8 shadow-xl">
          <h3 className="text-xl font-semibold text-white">{t('landing.showcaseTitle')}</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">{t('landing.showcaseCopy')}</p>
          <div className="mt-8 grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-[#10151f]/90 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">{t('landing.trustedTitle')}</p>
              <p className="mt-3 text-white/80">{t('landing.trustedCopy')}</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-[#10151f]/90 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">{t('landing.cloudTitle')}</p>
              <p className="mt-3 text-white/80">{t('landing.cloudCopy')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-[36px] border border-white/10 p-8 shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">{t('pricing.pricingIntro')}</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">{t('landing.workflowTitle')}</h2>
          <p className="mt-4 text-base leading-8 text-white/70">{t('landing.workflowCopy')}</p>
          <div className="mt-8 grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-[#10151f]/90 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">{t('landing.editorSuiteTitle')}</p>
              <p className="mt-3 text-white/80">{t('landing.editorSuiteCopy')}</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-[#10151f]/90 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">{t('landing.exportWorkflowTitle')}</p>
              <p className="mt-3 text-white/80">{t('landing.exportWorkflowCopy')}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
          <p className="uppercase tracking-[0.24em] text-sm text-white/50">{t('landing.testimonial')}</p>
          <div className="mt-8 flex flex-col gap-6">
            <div className="rounded-[28px] border border-white/10 bg-[#0d1120]/90 p-6">
              <p className="text-lg font-semibold text-white">{t('landing.testimonialQuote1')}</p>
              <p className="mt-3 text-sm text-white/60">{t('landing.testimonialCredit1')}</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-[#0d1120]/90 p-6">
              <p className="text-lg font-semibold text-white">{t('landing.testimonialQuote2')}</p>
              <p className="mt-3 text-sm text-white/60">{t('landing.testimonialCredit2')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
