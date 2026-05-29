import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mx-auto mt-12 max-w-[1600px] rounded-[28px] border border-white/10 bg-surface/70 px-6 py-8 backdrop-blur-xl sm:px-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">{t('brand')}</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">{t('footer.description')}</p>
        </div>
        <p className="text-sm text-white/50">{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}
