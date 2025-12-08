/**
 * Adaptadores para converter dados da API para o formato esperado pelos componentes
 * 
 * Durante a transição de mock para API real, alguns componentes ainda esperam
 * o formato antigo (SmartCNPJCompany). Este adapter garante compatibilidade.
 */

import type { SmartCNPJCompanyAPI } from '@/types/smart-cnpj'
import type { SmartCNPJCompany } from '@/mocks/smart-cnpj'

/**
 * Converte SmartCNPJCompanyAPI (backend) para SmartCNPJCompany (componentes)
 * 
 * Esta função é temporária e será removida quando todos os componentes
 * forem atualizados para usar SmartCNPJCompanyAPI diretamente.
 */
export function adaptAPICompanyToMock(apiCompany: SmartCNPJCompanyAPI): SmartCNPJCompany {
  // Determinar se é MEI baseado no código do porte
  // Código "05" = Microempreendedor Individual (MEI)
  const isMEI = apiCompany.codigoPorte === '05'
  
  // Mapear porte do backend para enum do mock
  const porteMap: Record<string, SmartCNPJCompany['porte']> = {
    '00': 'ME',     // Não informado -> ME
    '01': 'ME',     // Microempresa
    '03': 'EPP',    // Empresa de Pequeno Porte
    '05': 'MEI',    // MEI
    '07': 'MEDIO',  // Médio porte (não existe no backend atual, mas preparado)
    '09': 'GRANDE', // Grande porte (não existe no backend atual, mas preparado)
  }
  
  const porte = porteMap[apiCompany.codigoPorte] || 'ME'
  
  // Mapear situação cadastral para enum do mock
  const situacaoMap: Record<string, SmartCNPJCompany['situacaoCadastral']> = {
    '02': 'ATIVA',
    '03': 'SUSPENSA',
    '04': 'INAPTA',
    '08': 'BAIXADA',
    '01': 'NULA',
  }
  
  const situacao = situacaoMap[apiCompany.codigoSituacaoCadastral] || 'ATIVA'
  
  // Converter capital social de string para number
  const capitalSocial = parseFloat(apiCompany.capitalSocial) || 0
  
  return {
    // ID gerado a partir do CNPJ (mock precisa de ID)
    id: apiCompany.cnpj,
    
    // Identificação
    cnpj: apiCompany.cnpj,
    razaoSocial: apiCompany.razaoSocial,
    nomeFantasia: apiCompany.nomeFantasia || apiCompany.razaoSocial,
    
    // Situação e Tipo
    situacaoCadastral: situacao,
    tipo: 'MATRIZ', // Backend não fornece isso, assumir MATRIZ por padrão
    
    // Porte e Capital
    porte,
    capitalSocial,
    isMEI,
    
    // Flags simplificadas (backend não fornece, usar valores padrão)
    isSimplesNacional: false, // Backend não fornece
    formaTributacao: isMEI ? 'SIMPLES_NACIONAL' : 'LUCRO_PRESUMIDO',
    
    // Datas
    dataAbertura: apiCompany.dataAbertura,
    
    // CNAE - Renomear de cnaePrincipal para cnaesPrimario
    cnaesPrimario: apiCompany.cnaePrincipal,
    cnaesSecundarios: apiCompany.cnaesSecundarios,
    
    // Endereço - estrutura já compatível
    endereco: {
      cep: apiCompany.endereco.cep,
      logradouro: apiCompany.endereco.logradouro,
      numero: apiCompany.endereco.numero,
      complemento: apiCompany.endereco.complemento || undefined,
      bairro: apiCompany.endereco.bairro,
      municipio: apiCompany.endereco.municipio,
      uf: apiCompany.endereco.uf,
    },
    
    // Contatos - estrutura já compatível
    contatos: {
      email: apiCompany.contatos.email || undefined,
      telefone: apiCompany.contatos.telefone || undefined,
    },
    
    // Sócios - mapear estrutura (tratar nulls)
    socios: apiCompany.socios.map(socio => ({
      nome: socio.nome,
      cpfCnpj: socio.cpfCnpj || '',
      qualificacao: socio.qualificacao,
      dataEntrada: socio.dataEntrada || '',
    })),
  }
}

/**
 * Converte array de SmartCNPJCompanyAPI para SmartCNPJCompany
 */
export function adaptAPICompaniesToMock(apiCompanies: SmartCNPJCompanyAPI[]): SmartCNPJCompany[] {
  return apiCompanies.map(adaptAPICompanyToMock)
}
