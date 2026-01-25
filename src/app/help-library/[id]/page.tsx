import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getHelpTemplateById, getAllHelpTemplates } from '@/lib/help';
import { HelpTemplateDetailClient } from './client';

export async function generateStaticParams() {
  const templates = getAllHelpTemplates();
  return templates.map((template) => ({
    id: template.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HelpTemplateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const template = getHelpTemplateById(id);

  if (!template) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HelpTemplateDetailClient template={template} />
    </Suspense>
  );
}