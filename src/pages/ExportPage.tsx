import { useTranslation } from 'react-i18next';

const qualities = ['720p', '1080p', '4K'];

export default function ExportPage() {
  const { t } = useTranslation();

  return (
    <div className="glass-panel rounded-[36px] border border-white/10 p-8 shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">{t('export.title')}</p>
          <h2 className="mt-3 text-4xl font-semibold text-white">Render your cinematic story</h2>
        </div>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.6fr_0.4fr]">
        <div className="rounded-[32px] border border-white/10 bg-[#0d1120]/90 p-6">
          <p className="text-sm text-white/70">{t('export.description')}</p>
          <div className="mt-6 space-y-4">
            {qualities.map((quality) => (
              <div key={quality} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white/80">
                <span>{quality}</span>
                <span className="rounded-full bg-accent/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-accent">Optimal</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-[#0d1120]/90 p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-white/50">{t('export.format')}</p>
          <p className="mt-3 text-white/70">MP4 is the leading standard for fast delivery and wide compatibility on web, mobile, and desktop playback.</p>
          <button className="mt-8 inline-flex w-full items-center justify-center rounded-3xl bg-accent px-6 py-4 text-sm font-semibold text-white transition hover:bg-violet-400">
            {t('export.exportNow')}
          </button>
          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <p className="font-semibold text-white">{t('export.status')}</p>
            <p className="mt-2">{t('export.statusDescription')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
