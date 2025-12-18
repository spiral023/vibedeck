import { NextResponse } from 'next/server';
import { getHelpTemplateById } from '@/lib/help';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const template = getHelpTemplateById(id);
  
  if (!template) {
    return new NextResponse('Not Found', { status: 404 });
  }
  
  return NextResponse.json(template);
}
