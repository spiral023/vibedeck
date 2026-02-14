'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useThemeStore } from '@/stores/theme-store';

interface MermaidProps {
  chart: string;
}

export const Mermaid = ({ chart }: MermaidProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useThemeStore();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      // Explicit font stack often helps with sizing calculations
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      flowchart: {
        htmlLabels: true,
        useMaxWidth: false,
      },
    });

    if (ref.current) {
      const renderChart = async () => {
        try {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          // Clean up previous content to avoid conflicts
          if (ref.current) {
            ref.current.innerHTML = '';
          }
          const { svg } = await mermaid.render(id, chart);
          if (ref.current) {
            ref.current.innerHTML = svg;
            
            // Post-process SVG to ensure it scales correctly
            const svgElement = ref.current.querySelector('svg');
            if (svgElement) {
              svgElement.style.maxWidth = '100%';
              svgElement.style.height = 'auto';
              svgElement.style.display = 'block';
            }
          }
        } catch (error) {
          console.error('Mermaid render error:', error);
          if (ref.current) {
            ref.current.innerHTML = `<pre class="text-destructive p-4 bg-destructive/10 rounded-md text-xs whitespace-pre-wrap">Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}</pre>`;
          }
        }
      };
      renderChart();
    }
  }, [chart, resolvedTheme]);

  return (
    <div className="mermaid-container my-8 flex w-full justify-center overflow-x-auto rounded-xl border border-border/50 bg-card/50 p-4 sm:p-8" ref={ref} />
  );
};
