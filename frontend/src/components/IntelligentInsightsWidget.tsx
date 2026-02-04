"use client";

import React, { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react';

interface IntelligentInsight {
  id: string;
  priority: 'high' | 'medium' | 'low';
  emoji: string;
  title: string;
  description: string;
  recommendation: string;
  growth_rate: number;
  absolute_change: number;
  z_score: number;
  insight_key: string;
  metadata: any;
  filters: any;
}

const priorityConfig = {
  high: {
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-900 dark:text-orange-100',
    accentColor: 'text-orange-600 dark:text-orange-400',
    icon: TrendingUp
  },
  medium: {
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-900 dark:text-yellow-100',
    accentColor: 'text-yellow-600 dark:text-yellow-400',
    icon: AlertCircle
  },
  low: {
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-900 dark:text-blue-100',
    accentColor: 'text-blue-600 dark:text-blue-400',
    icon: Lightbulb
  }
};

export default function IntelligentInsightsWidget() {
  const [insights, setInsights] = useState<IntelligentInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchIntelligentInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/insights/intelligent?limit=3`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar insights inteligentes');
      }
      
      const data = await response.json();
      setInsights(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligentInsights();
  }, []);

  const handleRefresh = () => {
    fetchIntelligentInsights();
  };

  const handleViewDetails = (insight: IntelligentInsight) => {
    // Navegar para página de busca com filtros aplicados
    const filters = new URLSearchParams(insight.filters).toString();
    window.location.href = `/smart-cnpj/busca-avancada?${filters}`;
  };

  const handleCreateAlert = (insight: IntelligentInsight) => {
    // TODO: Implementar criação de alerta (Feature P5 - futura)
    console.log('Criar alerta para:', insight.insight_key);
  };

  if (loading && insights.length === 0) {
    return (
      <div className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-orange-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw className="w-5 h-5 animate-spin text-orange-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Carregando Insights Inteligentes...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              Erro ao carregar insights inteligentes
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return null; // Não exibir widget se não houver insights
  }

  const timeSinceUpdate = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000 / 60);

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              🔔 Insights Inteligentes
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Atualizados há {timeSinceUpdate === 0 ? 'agora' : `${timeSinceUpdate} min`}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Insights Cards */}
      <div className="space-y-3">
        {insights.map((insight) => {
          const config = priorityConfig[insight.priority];
          const Icon = config.icon;
          
          return (
            <div
              key={insight.id}
              className={`p-5 rounded-xl border-2 ${config.bgColor} ${config.borderColor} transition-all hover:shadow-lg`}
            >
              <div className="flex items-start gap-4">
                {/* Emoji + Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${config.bgColor} border ${config.borderColor}`}>
                    {insight.emoji}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Priority Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${config.accentColor}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wide ${config.accentColor}`}>
                      {insight.priority === 'high' ? 'Alta Prioridade' : 
                       insight.priority === 'medium' ? 'Atenção' : 
                       'Oportunidade'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-bold mb-2 ${config.textColor}`}>
                    {insight.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm mb-3 ${config.textColor} opacity-90`}>
                    {insight.description}
                  </p>

                  {/* Recommendation */}
                  <div className={`p-3 rounded-lg ${config.bgColor} border ${config.borderColor} mb-4`}>
                    <p className={`text-xs font-medium ${config.textColor} flex items-start gap-2`}>
                      <Lightbulb className={`w-4 h-4 flex-shrink-0 mt-0.5 ${config.accentColor}`} />
                      <span>{insight.recommendation}</span>
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-xs">
                    <div className={config.textColor}>
                      <span className="opacity-70">Variação: </span>
                      <span className="font-semibold">
                        {insight.growth_rate > 0 ? '+' : ''}
                        {(insight.growth_rate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className={config.textColor}>
                      <span className="opacity-70">Mudança: </span>
                      <span className="font-semibold">
                        {insight.absolute_change > 0 ? '+' : ''}
                        {insight.absolute_change.toLocaleString('pt-BR')} empresas
                      </span>
                    </div>
                    <div className={config.textColor}>
                      <span className="opacity-70">Z-Score: </span>
                      <span className="font-semibold">
                        {insight.z_score.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewDetails(insight)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 ${config.accentColor} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm`}
                    >
                      Ver Detalhes
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleViewDetails(insight)}
                      className={`px-4 py-2 text-sm font-medium ${config.accentColor} hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors`}
                    >
                      Buscar Empresas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          💡 Insights gerados automaticamente por IA usando análise estatística (Z-score, tendências)
        </p>
      </div>
    </div>
  );
}
