import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, FolderKanban, Library, Rocket, Sparkles, Zap } from 'lucide-react';
import { getAllPrompts } from '@/lib/prompts';
import { workflows } from '@/data/workflows';
import HomePageClient from './client-page';

export default function HomePage() {
  const prompts = getAllPrompts();
  
  return <HomePageClient promptCount={prompts.length} workflowCount={workflows.length} />;
}