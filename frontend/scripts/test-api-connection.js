#!/usr/bin/env node

/**
 * Script de Teste - Conexão com Backend
 * Issue 2.2.1 - Setup e Configuração API
 * 
 * Uso: node scripts/test-api-connection.js
 */

const axios = require('axios')

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function header(message) {
  console.log('\n' + '='.repeat(60))
  log(message, 'bright')
  console.log('='.repeat(60))
}

async function testHealthEndpoint() {
  header('🏥 Testando Conexão com Backend')
  
  try {
    // Testa endpoint docs (verifica se backend está online)
    const response = await axios.get(`http://localhost:8000/docs`, { timeout: 5000 })
    
    log('✅ Backend está online e respondendo', 'green')
    log(`   Status HTTP: ${response.status}`, 'cyan')
    log(`   API Base URL: ${API_URL}`, 'cyan')
    
    return true
  } catch (error) {
    log('❌ Backend não está respondendo', 'red')
    log(`   Erro: ${error.message}`, 'red')
    log(`   Verifique se o docker-compose está rodando:`, 'yellow')
    log(`   $ docker-compose up -d`, 'yellow')
    return false
  }
}

async function testSmartCNPJEndpoint() {
  header('🔍 Testando Smart CNPJ Endpoint')
  
  const testCNPJ = '33345748000185'
  
  try {
    log(`   Buscando CNPJ: ${testCNPJ}`, 'yellow')
    const response = await axios.get(`${API_URL}/smart-cnpj/${testCNPJ}`, { timeout: 10000 })
    
    log('✅ Endpoint Smart CNPJ respondeu com sucesso', 'green')
    log(`   CNPJ: ${response.data.cnpj}`, 'cyan')
    log(`   Razão Social: ${response.data.razaoSocial}`, 'cyan')
    log(`   Situação: ${response.data.situacaoCadastral}`, 'cyan')
    
    return true
  } catch (error) {
    if (error.response) {
      log(`❌ Endpoint respondeu com erro ${error.response.status}`, 'red')
      log(`   Mensagem: ${error.response.data?.error || 'Sem mensagem'}`, 'red')
    } else {
      log('❌ Falha ao conectar com endpoint', 'red')
      log(`   Erro: ${error.message}`, 'red')
    }
    return false
  }
}

async function testBulkSearchEndpoint() {
  header('📊 Testando Bulk Search Endpoint')
  
  const payload = {
    tipo_busca: 'razao_social',
    valor_busca: 'TECNOLOGIA',
    page: 1,
    limit: 5
  }
  
  try {
    log(`   Buscando: ${payload.valor_busca}`, 'yellow')
    const response = await axios.post(`${API_URL}/smart-cnpj/bulk`, payload, { timeout: 15000 })
    
    log('✅ Endpoint Bulk Search respondeu com sucesso', 'green')
    log(`   Total de resultados: ${response.data.pagination?.total || 0}`, 'cyan')
    log(`   Resultados retornados: ${response.data.data?.length || 0}`, 'cyan')
    log(`   Tipo de busca: ${response.data.searchType}`, 'cyan')
    
    return true
  } catch (error) {
    if (error.response) {
      log(`❌ Endpoint respondeu com erro ${error.response.status}`, 'red')
      log(`   Mensagem: ${error.response.data?.error || 'Sem mensagem'}`, 'red')
    } else {
      log('❌ Falha ao conectar com endpoint', 'red')
      log(`   Erro: ${error.message}`, 'red')
    }
    return false
  }
}

async function testHistoricoEndpoint() {
  header('📜 Testando Histórico Endpoint')
  
  try {
    const response = await axios.get(`${API_URL}/smart-cnpj/historico?page=1&limit=5`, { timeout: 5000 })
    
    log('✅ Endpoint Histórico respondeu com sucesso', 'green')
    log(`   Total de registros: ${response.data.pagination?.total || 0}`, 'cyan')
    log(`   Registros retornados: ${response.data.data?.length || 0}`, 'cyan')
    
    return true
  } catch (error) {
    if (error.response) {
      log(`❌ Endpoint respondeu com erro ${error.response.status}`, 'red')
      log(`   Mensagem: ${error.response.data?.error || 'Sem mensagem'}`, 'red')
    } else {
      log('❌ Falha ao conectar com endpoint', 'red')
      log(`   Erro: ${error.message}`, 'red')
    }
    return false
  }
}

async function testEstatisticasEndpoint() {
  header('📈 Testando Estatísticas Endpoint')
  
  try {
    const response = await axios.get(`${API_URL}/smart-cnpj/estatisticas`, { timeout: 5000 })
    
    log('✅ Endpoint Estatísticas respondeu com sucesso', 'green')
    log(`   Total de buscas: ${response.data.total_buscas || 0}`, 'cyan')
    log(`   Empresas consultadas: ${response.data.empresas_unicas || 0}`, 'cyan')
    
    return true
  } catch (error) {
    if (error.response) {
      log(`❌ Endpoint respondeu com erro ${error.response.status}`, 'red')
      log(`   Mensagem: ${error.response.data?.error || 'Sem mensagem'}`, 'red')
    } else {
      log('❌ Falha ao conectar com endpoint', 'red')
      log(`   Erro: ${error.message}`, 'red')
    }
    return false
  }
}

async function main() {
  console.clear()
  
  header('🚀 Teste de Conexão com Backend - Smart CNPJ 360°')
  log(`   URL da API: ${API_URL}`, 'blue')
  log(`   Data: ${new Date().toLocaleString('pt-BR')}`, 'blue')
  
  const results = {
    health: false,
    smartCNPJ: false,
    bulkSearch: false,
    historico: false,
    estatisticas: false,
  }
  
  // Executa todos os testes
  results.health = await testHealthEndpoint()
  
  if (results.health) {
    results.smartCNPJ = await testSmartCNPJEndpoint()
    results.bulkSearch = await testBulkSearchEndpoint()
    results.historico = await testHistoricoEndpoint()
    results.estatisticas = await testEstatisticasEndpoint()
  }
  
  // Resumo final
  header('📊 Resumo dos Testes')
  
  const tests = [
    { name: 'Backend Online', result: results.health },
    { name: 'Smart CNPJ (GET)', result: results.smartCNPJ },
    { name: 'Bulk Search (POST)', result: results.bulkSearch },
    { name: 'Histórico', result: results.historico },
    { name: 'Estatísticas', result: results.estatisticas },
  ]
  
  tests.forEach(test => {
    const icon = test.result ? '✅' : '❌'
    const color = test.result ? 'green' : 'red'
    log(`   ${icon} ${test.name}`, color)
  })
  
  const totalTests = tests.length
  const passedTests = tests.filter(t => t.result).length
  const percentage = Math.round((passedTests / totalTests) * 100)
  
  console.log('\n' + '='.repeat(60))
  log(`   Testes: ${passedTests}/${totalTests} passando (${percentage}%)`, 
    percentage === 100 ? 'green' : percentage >= 60 ? 'yellow' : 'red')
  console.log('='.repeat(60) + '\n')
  
  // Exit code
  process.exit(percentage === 100 ? 0 : 1)
}

// Executa
main().catch(error => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red')
  process.exit(1)
})
