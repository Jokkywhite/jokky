import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

const links = [
  { href: '/', label: 'home' },
  { href: '/dashboard', label: 'dashboard' },
  { href: '/editor', label: 'editor' },
  { href: '/pricing', label: 'pricing' },
  { href: '/projects', label: 'projects' },
];

export default function NavBar() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 rounded-[32px] border border-white/10 bg-[#090c14]/80 px-5 py-4 shadow-glow backdrop-blur-xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
        <Link to="/" aria-label="Jokky White Editing">
          <Logo />
        </Link>
      </motion.div>

      <nav className="hidden items-center gap-2 md:flex">
        {links.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-2 text-sm font-medium transition ${
                isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
              }`
            }
          >
            {t(`nav.${link.label}`)}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <LanguageSelector />
        <Link
          to="/auth/signin"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          {t('nav.login')}
        </Link>
      </div>
    </header>
  );
}
