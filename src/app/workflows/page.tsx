import { Suspense } from 'react';
import { getAllWorkflows } from '@/lib/workflows';
import { WorkflowsClient } from './client';

export default function WorkflowsPage() {
  const workflows = getAllWorkflows();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkflowsClient workflows={workflows} />
    </Suspense>
  );
}