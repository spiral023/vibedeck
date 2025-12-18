import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, FolderKanban, Library, Rocket, Sparkles, Zap } from 'lucide-react';
import { getAllPrompts } from '@/lib/prompts';
import { getAllWorkflows } from '@/lib/workflows';
import HomePageClient from './client-page';

export default function HomePage() {
  const prompts = getAllPrompts();
  const workflows = getAllWorkflows();
  
  return <HomePageClient promptCount={prompts.length} workflowCount={workflows.length} />;
}