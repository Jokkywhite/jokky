import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const projects = [
  { name: 'JWE Launch Promo', updated: 'Today', status: 'Draft' },
  { name: 'Creative Reel', updated: 'Yesterday', status: 'Review' },
  { name: 'Brand Story', updated: '3 days ago', status: 'Exported' },
];

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-[36px] border border-white/10 p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">{t('projects.saved')}</p>
        <h2 className="mt-4 text-4xl font-semibold text-white">Saved projects</h2>
        <p className="mt-4 text-white/70">{t('projects.description')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.name} className="glass-panel rounded-[32px] border border-white/10 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.28em] text-white/50">{project.status}</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{project.name}</h3>
            <p className="mt-4 text-sm text-white/70">Last updated {project.updated}</p>
            <Link to="/editor" className="mt-6 inline-flex rounded-3xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400">
              {t('projects.continue')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
