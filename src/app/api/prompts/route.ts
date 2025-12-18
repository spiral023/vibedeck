import { NextResponse } from 'next/server';
import { getAllPrompts } from '@/lib/prompts';

export async function GET() {
  const prompts = getAllPrompts();
  return NextResponse.json(prompts);
}
