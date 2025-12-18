import { NextResponse } from 'next/server';
import { getAllWorkflows } from '@/lib/workflows';

export async function GET() {
  const workflows = getAllWorkflows();
  return NextResponse.json(workflows);
}
