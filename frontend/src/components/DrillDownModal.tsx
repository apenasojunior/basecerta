"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, TrendingUp, Building2, MapPin, DollarSign, Activity, ExternalLink } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: {
    id: string;
    titulo: string;
    total_empresas: number;
    categoria: string;
    metadata: any;
    filters: any;
  };
  detailsData?: {
    evolution: Array<{ month: string; total: number }>;
    topCNAEs: Array<{ cnae: string; descricao: string; total: number }>;
    states: Array<{ state: string; total: number; percentage: number }>;
    capitalDistribution: Array<{ range: string; count: number }>;
    survivalRates: { year1: number; year3: number; year5: number };
    newCompanies: number;
    closedCompanies: number;
  };
}

const COLORS = ['#EE4D2D', '#FF6B35', '#FF8C61', '#FFB088', '#FFD4B0'];

export default function DrillDownModal({ isOpen, onClose, insight, detailsData }: DrillDownModalProps) {
  if (!detailsData) {
    return null;
  }

  const formatNumber = (num: number) => num.toLocaleString('pt-BR');
  const formatCurrency = (num: number) => `R$ ${num.toLocaleString('pt-BR')}`;

  // Calcular crescimento
  const evolution = detailsData.evolution || [];
  const growthRate = evolution.length >= 2
    ? ((evolution[evolution.length - 1].total - evolution[0].total) / evolution[0].total) * 100
    : 0;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto z-50 animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-2xl">
            <div className="flex items-start justify-between">
              <div>
                <Dialog.Title className="text-2xl font-bold text-white mb-2">
                  {insight.titulo} - Análise Detalhada
                </Dialog.Title>
                <p className="text-orange-100">
                  {formatNumber(insight.total_empresas)} empresas ativas
                </p>
              </div>
              <Dialog.Close className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </Dialog.Close>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* 1. Evolução (12 meses) */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Evolução (12 meses)
                </h3>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [formatNumber(value), 'Empresas']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#EE4D2D" 
                    strokeWidth={3}
                    dot={{ fill: '#EE4D2D', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  📈 Crescimento: <span className="font-bold">+{formatNumber(evolution[evolution.length - 1]?.total - evolution[0]?.total || 0)}</span> empresas 
                  ({growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}% em 12 meses)
                </p>
              </div>
            </section>

            {/* 2. Top 10 CNAEs */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Top 10 CNAEs (Subcategorias)
                </h3>
              </div>

              <div className="space-y-3">
                {detailsData.topCNAEs.slice(0, 10).map((cnae, index) => (
                  <div 
                    key={cnae.cnae}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-lg font-bold text-orange-600 min-w-[30px]">
                        {index + 1}.
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {cnae.descricao}
                        </p>
                        <p className="text-xs text-gray-500">
                          CNAE: {cnae.cnae}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatNumber(cnae.total)}
                      </span>
                      <button className="px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Distribuição Geográfica */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Distribuição Geográfica
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfico de Pizza */}
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={detailsData.states.slice(0, 5)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ state, percentage }) => `${state}: ${percentage.toFixed(1)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="total"
                      >
                        {detailsData.states.slice(0, 5).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatNumber(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Lista de Estados */}
                <div className="space-y-2">
                  {detailsData.states.slice(0, 5).map((state, index) => (
                    <div key={state.state} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {state.state}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatNumber(state.total)} ({state.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all"
                            style={{ 
                              width: `${state.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Análise de Capital Social */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Análise de Capital Social
                </h3>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={detailsData.capitalDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="range" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [formatNumber(value), 'Empresas']}
                  />
                  <Bar dataKey="count" fill="#EE4D2D" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-700 dark:text-green-300 mb-1">Médio</p>
                  <p className="text-xl font-bold text-green-900 dark:text-green-100">
                    R$ 185.000
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Mediano</p>
                  <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                    R$ 50.000
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Indicadores de Saúde do Setor */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Indicadores de Saúde do Setor
                </h3>
              </div>

              <div className="space-y-4">
                {/* Taxa de Sobrevivência */}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-3">
                    Taxa de Sobrevivência:
                  </p>
                  {[
                    { label: '1 ano', value: detailsData.survivalRates.year1 },
                    { label: '3 anos', value: detailsData.survivalRates.year3 },
                    { label: '5 anos', value: detailsData.survivalRates.year5 }
                  ].map(({ label, value }) => (
                    <div key={label} className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300">• {label}:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Novas vs Encerradas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-xs text-green-700 dark:text-green-300 mb-1">Novas Empresas (12 meses)</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {formatNumber(detailsData.newCompanies)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">+{((detailsData.newCompanies / insight.total_empresas) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-700 dark:text-red-300 mb-1">Empresas Encerradas (12 meses)</p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                      {formatNumber(detailsData.closedCompanies)}
                    </p>
                    <p className="text-xs text-red-600 mt-1">{((detailsData.closedCompanies / insight.total_empresas) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 p-6 rounded-b-2xl border-t border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <button className="flex-1 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors">
              Buscar Todas as Empresas
            </button>
            <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Adicionar Alerta
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
