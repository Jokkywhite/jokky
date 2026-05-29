import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="glass-panel mx-auto max-w-3xl rounded-[36px] border border-white/10 p-12 text-center shadow-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-white/50">{t('notFound.title')}</p>
      <h1 className="mt-6 text-6xl font-semibold text-white">{t('notFound.headline')}</h1>
      <p className="mt-4 text-lg leading-8 text-white/70">{t('notFound.description')}</p>
      <Link to="/" className="mt-8 inline-flex rounded-3xl bg-accent px-6 py-4 text-sm font-semibold text-white transition hover:bg-violet-400">
        {t('notFound.back')}
      </Link>
    </div>
  );
}
