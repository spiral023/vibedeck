import { NextResponse } from 'next/server';
import { getWorkflowById } from '@/lib/workflows';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const workflow = getWorkflowById(id);
  
  if (!workflow) {
    return new NextResponse('Not Found', { status: 404 });
  }
  
  return NextResponse.json(workflow);
}
