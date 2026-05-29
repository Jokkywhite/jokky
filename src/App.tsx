import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout';
import LanguageToast from './components/LanguageToast';
import { NotificationProvider } from './components/NotificationProvider';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import PricingPage from './pages/PricingPage';
import AuthPage from './pages/AuthPage';
import SettingsPage from './pages/SettingsPage';
import ProjectsPage from './pages/ProjectsPage';
import ExportPage from './pages/ExportPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-midnight text-white selection:bg-accent/40 selection:text-white">
      <NotificationProvider>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/auth/:mode" element={<AuthPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/export" element={<ExportPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </Layout>
        <LanguageToast />
      </NotificationProvider>
      <motion.div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />
    </div>
  );
}

export default App;
