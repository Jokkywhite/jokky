import { useTranslation } from 'react-i18next';

export const languages = [
  { code: 'en', label: 'English' },
  { code: 'no', label: 'Norsk' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'zh', label: '中文' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const normalizedLanguage = i18n.language?.split('-')[0] ?? 'en';
  const selectedValue = languages.some((lang) => lang.code === normalizedLanguage)
    ? normalizedLanguage
    : 'en';

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 shadow-sm backdrop-blur-xl">
      <span className="uppercase tracking-[0.2em] text-white/50">Lang</span>
      <select
        value={selectedValue}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
        className="rounded-xl border border-white/10 bg-transparent px-2 py-1 text-white outline-none transition focus:border-accent"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-[#11151f] text-white">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
