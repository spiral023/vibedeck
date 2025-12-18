import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getWorkflowById } from '@/lib/workflows';
import { getPromptById } from '@/lib/prompts';
import { WorkflowDetailClient } from './client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkflowDetailPage({ params }: PageProps) {
  const { id } = await params;
  const workflow = getWorkflowById(id);

  if (!workflow) {
    notFound();
  }

  // Pre-fetch prompts for all steps
  const stepsWithPrompts = workflow.steps.map(step => ({
    ...step,
    prompt: step.promptRef ? getPromptById(step.promptRef) : undefined
  }));

  // Create a serializable version of the workflow with embedded prompts
  const serializedWorkflow = {
    ...workflow,
    steps: stepsWithPrompts
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkflowDetailClient workflow={serializedWorkflow} />
    </Suspense>
  );
}
