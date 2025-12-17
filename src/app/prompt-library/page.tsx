import { Suspense } from 'react';
import { getAllPrompts, getAllTags, getAllCategories } from '@/lib/prompts';
import { PromptLibraryClient } from './client';

export default function PromptLibraryPage() {
  const prompts = getAllPrompts();
  const tags = getAllTags();
  const categories = getAllCategories();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromptLibraryClient 
        initialPrompts={prompts} 
        allTags={tags} 
        allCategories={categories} 
      />
    </Suspense>
  );
}
