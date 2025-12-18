import { NextResponse } from 'next/server';
import { getPromptById } from '@/lib/prompts';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const prompt = getPromptById(id);
  
  if (!prompt) {
    return new NextResponse('Not Found', { status: 404 });
  }
  
  return NextResponse.json(prompt);
}
