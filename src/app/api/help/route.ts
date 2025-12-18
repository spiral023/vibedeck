import { NextResponse } from 'next/server';
import { getAllHelpTemplates } from '@/lib/help';

export async function GET() {
  const templates = getAllHelpTemplates();
  return NextResponse.json(templates);
}
