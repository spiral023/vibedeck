import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ChevronDown, Coins } from 'lucide-react';
import { useTokenCount, MODEL_PRICING, calculateCost, formatCost, formatNumber } from '@/lib/token-utils';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TokenEstimatorProps {
  text: string;
}

export function TokenEstimator({ text }: TokenEstimatorProps) {
  const { data: tokenCount, isLoading } = useTokenCount(text);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [outputTokens, setOutputTokens] = useState(500);
  const [showCostEstimator, setShowCostEstimator] = useState(false);

  const cost = tokenCount 
    ? calculateCost(tokenCount, outputTokens, selectedModel)
    : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.27 }}
      className="rounded-2xl border border-border/50 bg-card/50 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Token-Schätzung
        </h2>
        <button
          onClick={() => setShowCostEstimator(!showCostEstimator)}
          className="text-xs text-primary hover:underline"
        >
          {showCostEstimator ? 'Kosten ausblenden' : 'Kosten anzeigen'}
        </button>
      </div>

      {/* Token count */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 rounded-xl bg-secondary/50 p-4">
          <div className="text-xs text-muted-foreground mb-1">Input-Tokens</div>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : tokenCount !== undefined ? (
              formatNumber(tokenCount)
            ) : (
              '—'
            )}
          </div>
        </div>
      </div>

      {/* Cost estimator */}
      {showCostEstimator && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 pt-4 border-t border-border/50"
        >
          {/* Model selector */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Modell</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm focus-ring">
                  {MODEL_PRICING[selectedModel]?.name || selectedModel}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                {Object.entries(MODEL_PRICING).map(([id, { name }]) => (
                  <DropdownMenuItem
                    key={id}
                    onClick={() => setSelectedModel(id)}
                    className={cn('cursor-pointer', selectedModel === id && 'bg-accent')}
                  >
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Output tokens slider */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">
              Erwartete Output-Tokens: {formatNumber(outputTokens)}
            </label>
            <input
              type="range"
              min="100"
              max="4000"
              step="100"
              value={outputTokens}
              onChange={(e) => setOutputTokens(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>100</span>
              <span>4.000</span>
            </div>
          </div>

          {/* Cost display */}
          <div className="rounded-xl bg-primary/10 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Coins className="h-3.5 w-3.5" />
              Geschätzte Kosten (Schätzung)
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCost(cost)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {formatNumber(tokenCount || 0)} Input + {formatNumber(outputTokens)} Output Tokens
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
