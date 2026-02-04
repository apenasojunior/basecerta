"use client";

import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MiniEvolutionChartProps {
  data: Array<{ month: string; total: number }>;
  color?: string;
}

/**
 * Mini gráfico de evolução (12 meses) para embbed em cards.
 * Minimalista: sem eixos, sem labels, apenas a linha de tendência.
 */
export default function MiniEvolutionChart({ 
  data, 
  color = '#EE4D2D' 
}: MiniEvolutionChartProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-16">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={false}
            isAnimationActive={true}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
