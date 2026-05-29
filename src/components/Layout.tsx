import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import NavBar from './NavBar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
      <NavBar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-8 pt-6"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
