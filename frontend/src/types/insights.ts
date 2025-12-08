/**
 * Tipos TypeScript para sistema de Insights (estatísticas em cache)
 * Sprint: Smart CNPJ Search - ISSUE-00-B
 */

/**
 * Categoria do insight
 */
export type InsightCategoria = 'setor' | 'estado' | 'capital';

/**
 * Metadata flexível do insight (conteúdo do card)
 */
export interface InsightMetadata {
  // Comum a todos
  icone: string;
  
  // Setores
  demanda_score?: number;
  setor_lucro_bilhoes?: number;
  setor_lucro_trilhoes?: number;
  setor_rank?: number;
  setor_valor_bilhoes?: number;
  jobs_gerados_2025?: number;
  badge?: string;
  o_que_compram?: string[];
  ticket_medio_min?: number;
  ticket_medio_max?: number;
  potencial_mensal?: string;
  top_cnaes?: string[];
  distribuicao_setores?: string;
  
  // Estados
  uf?: string;
  rank?: number;
  top_setores?: string[];
  pib_estadual_trilhoes?: number;
  observacao?: string;
  destaque?: string;
  
  // Capital Social
  capital_social_min?: number;
  capital_social_max?: number | null;
  perfil?: string;
  ciclo_venda?: string;
  decisores?: string;
  
  // Campos customizados adicionais
  [key: string]: any;
}

/**
 * Filtros CNPJ para aplicar quando clicar no card
 */
export interface InsightFilters {
  // Filtros básicos
  segmento?: string;
  situacao_cadastral?: string;
  uf?: string;
  porte_empresa?: string[];
  
  // Filtros de data
  data_inicio_atividade_gte?: string;
  data_inicio_atividade_lte?: string;
  
  // Filtros de capital
  capital_social_gte?: number;
  capital_social_lte?: number;
  
  // Campos customizados adicionais
  [key: string]: any;
}

/**
 * Insight individual (card de estatística)
 */
export interface InsightData {
  id: number;
  insight_key: string;
  categoria: InsightCategoria;
  titulo: string;
  total_empresas: number;
  percentual?: number | null;
  metadata: InsightMetadata;
  filters: InsightFilters;
  updated_at: string;
  updated_by: string;
}

/**
 * Response agrupado por categoria
 */
export interface InsightsGroupedResponse {
  setores: InsightData[];
  estados: InsightData[];
  capital: InsightData[];
  total: number;
}

/**
 * Props do componente InsightCard
 */
export interface InsightCardProps {
  insight: InsightData;
  onClick?: (insight: InsightData) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'expanded';
}

/**
 * Props da seção de insights
 */
export interface InsightsSectionProps {
  categoria: InsightCategoria;
  insights: InsightData[];
  title: string;
  description?: string;
  className?: string;
}

/**
 * Helper para formatar valores monetários
 */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `R$ ${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(1)}K`;
  }
  return `R$ ${value.toLocaleString('pt-BR')}`;
}

/**
 * Helper para formatar número de empresas
 */
export function formatCompanies(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString('pt-BR');
}

/**
 * Helper para obter cor baseada em demanda_score
 */
export function getDemandColor(score?: number): string {
  if (!score) return 'gray';
  if (score >= 0.9) return 'red'; // Alta demanda
  if (score >= 0.7) return 'orange'; // Média-alta
  if (score >= 0.5) return 'yellow'; // Média
  return 'gray'; // Baixa
}

/**
 * Helper para obter label de badge
 */
export function getBadgeLabel(insight: InsightData): string | null {
  if (insight.metadata.badge) return insight.metadata.badge;
  if (insight.metadata.demanda_score && insight.metadata.demanda_score >= 0.95) {
    return 'ALTA DEMANDA';
  }
  if (insight.categoria === 'estado' && insight.metadata.rank === 1) {
    return 'TOP 1';
  }
  if (insight.categoria === 'capital' && insight.metadata.capital_social_min && insight.metadata.capital_social_min >= 10_000_000) {
    return 'GRANDES CONTAS';
  }
  return null;
}
