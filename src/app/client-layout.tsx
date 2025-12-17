'use client';

import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { CommandPalette, useCommandPalette } from "@/components/CommandPalette";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useCommandPalette();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-background bg-gradient-radial">
      <CommandPalette open={open} onOpenChange={setOpen} />
      <Sidebar />
      <main className="flex-1 overflow-x-hidden min-w-0">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="min-h-screen"
        >
          {/* Mobile: extra top padding for menu button, responsive padding */}
          <div className="mx-auto max-w-7xl px-4 pt-16 pb-6 sm:px-6 sm:pt-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </motion.div>
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
}
