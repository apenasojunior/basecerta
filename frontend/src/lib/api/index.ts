/**
 * Centralized API exports
 * 
 * Todos os endpoints organizados por recurso.
 * Importar usando: import { api } from '@/lib/api'
 * 
 * Exemplo de uso:
 * const credits = await api.credits.getBalance(1)
 * const plans = await api.plans.getPlans()
 */

export { apiClient } from './client'

// Endpoints organizados por recurso
export { usersApi } from './endpoints/users'
export { creditsApi } from './endpoints/credits'
export { plansApi } from './endpoints/plans'
export { productsApi } from './endpoints/products'
export { statsApi } from './endpoints/stats'
export { generalApi } from './endpoints/general'
export { smartCNPJService } from './endpoints/smart-cnpj'
export * from './endpoints/insights'

/**
 * Objeto API consolidado (forma recomendada de uso)
 */
export const api = {
  users: require('./endpoints/users').usersApi,
  credits: require('./endpoints/credits').creditsApi,
  plans: require('./endpoints/plans').plansApi,
  products: require('./endpoints/products').productsApi,
  stats: require('./endpoints/stats').statsApi,
  general: require('./endpoints/general').generalApi,
  smartCNPJ: require('./endpoints/smart-cnpj').smartCNPJService,
  insights: require('./endpoints/insights'),
}
