import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPromptById } from '@/lib/prompts';
import { PromptDetailClient } from './client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PromptDetailPage({ params }: PageProps) {
  const { id } = await params;
  const prompt = getPromptById(id);

  if (!prompt) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromptDetailClient prompt={prompt} />
    </Suspense>
  );
}