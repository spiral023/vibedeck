import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="flex min-h-screen w-full bg-background bg-gradient-radial">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8 lg:pl-4">
            <Outlet />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
