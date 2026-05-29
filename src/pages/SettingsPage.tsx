import { useTranslation } from 'react-i18next';
import { languages } from '../components/LanguageSelector';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const normalizedLanguage = i18n.language?.split('-')[0] ?? 'en';
  const selectedValue = languages.some((lang) => lang.code === normalizedLanguage)
    ? normalizedLanguage
    : 'en';

  return (
    <div className="glass-panel rounded-[36px] border border-white/10 p-8 shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">{t('settings.title')}</p>
          <h2 className="mt-3 text-4xl font-semibold text-white">Workspace settings</h2>
        </div>
        <button className="rounded-3xl bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Save settings</button>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-white/10 bg-[#0d1120]/90 p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-white/50">{t('settings.language')}</p>
          <select
            value={selectedValue}
            onChange={(event) => i18n.changeLanguage(event.target.value)}
            className="mt-4 w-full rounded-3xl border border-white/10 bg-[#11151f]/90 px-4 py-3 text-white outline-none"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-[#11151f] text-white">
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-[#0d1120]/90 p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-white/50">{t('settings.notifications')}</p>
          <div className="mt-4 space-y-4">
            {['Project activity', 'Export complete', 'AI suggestions'].map((item) => (
              <label key={item} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80">
                {item}
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-white/20 bg-white/5 text-accent" />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
