import { Suspense } from 'react';
import { getAllHelpTemplates } from '@/lib/help';
import { HelpLibraryClient } from './client';

export default function HelpLibraryPage() {
  const templates = getAllHelpTemplates();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HelpLibraryClient templates={templates} />
    </Suspense>
  );
}