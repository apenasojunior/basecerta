# 🔧 SUB-SPRINT: Correção dos 6 Tipos de Busca

## 📋 Metadados
- **ID:** SUB-SPRINT-FIX-SEARCH-TYPES
- **Sprint Pai:** Smart CNPJ Search
- **Prioridade:** 🔴 CRÍTICA (bloqueante)
- **Status:** 🏗️ Em Progresso
- **Data Início:** 08/12/2025
- **Estimativa:** 2-3 dias
- **Story Points:** 13 pts

---

## 🎯 Objetivo

Corrigir e otimizar os **6 tipos de busca** que não estão funcionando ou apresentam timeouts:

1. ❌ **Razão Social** - Travando (timeout > 2min)
2. ❌ **Segmento (CNAE)** - Não testado
3. ❌ **Email** - Timeout conhecido
4. ❌ **Telefone** - Timeout conhecido
5. ❌ **Nome Sócio** - Não implementado
6. ❌ **CEP** - Não implementado

**Única funcional:**
- ✅ **CNPJ** - Funcionando perfeitamente (55ms)

---

## 🚨 Problema Identificado

### **Query Travada (08/12/2025):**
```sql
-- 3 queries travadas por > 2 minutos
SELECT cnpj.estabelecimentos.cnpj_basico...
FROM cnpj.estabelecimentos
-- Causa: Full table scan em 68M registros
```

**Ação tomada:** 
- ✅ Queries terminadas via `pg_terminate_backend()`
- ⚠️ **Problema raiz:** Falta de índices apropriados

---

## 📊 Status Atual dos Tipos de Busca

| Tipo | Status | Performance | Índice | Issue |
|------|--------|-------------|--------|-------|
| CNPJ | ✅ OK | 55ms | ✅ B-tree | - |
| Razão Social | ❌ Timeout | >120s | ⚠️ GIN parcial | ISSUE-FIX-01 |
| Segmento (CNAE) | ❓ Unknown | ? | ⚠️ Sem teste | ISSUE-FIX-02 |
| Email | ❌ Timeout | >120s | ⚠️ GIN incompleto | ISSUE-FIX-03 |
| Telefone | ❌ Timeout | >120s | ❌ Sem índice | ISSUE-FIX-04 |
| Nome Sócio | ❌ Not impl. | - | ❌ Sem índice | ISSUE-FIX-05 |
| CEP | ❌ Not impl. | - | ✅ B-tree existe | ISSUE-FIX-06 |

---

## 🔍 Análise Técnica

### **Problema 1: Razão Social (Travando)**

**Query Atual:**
```python
# crud/smart_cnpj.py
if tipo_busca == TipoBusca.RAZAO_SOCIAL:
    query = query.filter(
        Empresa.razao_social.ilike(f'%{valor_busca}%')
    )
```

**Problema:**
- ✅ Índice GIN trigram existe: `idx_empresas_razao_social_gin_trgm`
- ❌ Mas query ainda trava (causa desconhecida)
- ❓ Possível causa: Índice não está sendo usado pelo planner

**Solução:**
1. Verificar se índice está válido e atualizado
2. Forçar uso do índice via hint (se necessário)
3. Adicionar LIMIT hardcoded (máx 1000 resultados)
4. Testar com EXPLAIN ANALYZE

---

### **Problema 2: Email (Timeout)**

**Query Atual:**
```python
if tipo_busca == TipoBusca.EMAIL:
    query = query.filter(
        Estabelecimento.correio_eletronico.ilike(f'%{valor_busca}%')
    )
```

**Problema:**
- ✅ Índice GIN existe: `idx_estab_email_gin`
- ❌ Query timeout (>2min)
- ❓ Full table scan em 68M estabelecimentos

**Solução:**
1. Verificar integridade do índice
2. REINDEX se necessário
3. Adicionar LIMIT hardcoded
4. Considerar busca exata primeiro (sem ILIKE)

---

### **Problema 3: Telefone (Timeout)**

**Query Atual:**
```python
if tipo_busca == TipoBusca.TELEFONE:
    telefone_limpo = re.sub(r'[^\d]', '', valor_busca)
    query = query.filter(
        or_(
            func.concat(Estabelecimento.ddd_1, Estabelecimento.telefone_1)
                .ilike(f'%{telefone_limpo}%'),
            func.concat(Estabelecimento.ddd_2, Estabelecimento.telefone_2)
                .ilike(f'%{telefone_limpo}%')
        )
    )
```

**Problema:**
- ❌ Índice concatenado não existe
- ❌ Query faz concat em runtime (lento)
- ❌ Full table scan garantido

**Solução:**
1. Criar índice B-tree em `(ddd_1 || telefone_1)`
2. Criar índice B-tree em `(ddd_2 || telefone_2)`
3. Busca exata (sem ILIKE) para performance
4. Adicionar LIMIT

---

### **Problema 4: Nome Sócio (Não Implementado)**

**Query Atual:**
```python
if tipo_busca == TipoBusca.NOME_SOCIO:
    # ❌ NÃO IMPLEMENTADO
    pass
```

**Solução:**
1. Implementar query na tabela `cnpj.socios`
2. JOIN com estabelecimentos
3. Criar índice GIN trigram em `socios.nome_socio`
4. Testar performance

---

### **Problema 5: CEP (Não Implementado)**

**Query Atual:**
```python
if tipo_busca == TipoBusca.CEP:
    # ❌ NÃO IMPLEMENTADO
    pass
```

**Problema:**
- ✅ Índice B-tree existe: `idx_estab_cep`
- ❌ Query não implementada

**Solução:**
1. Implementar query simples (busca exata)
2. Índice já existe, deve ser rápido
3. Testar

---

### **Problema 6: Segmento/CNAE (Não Testado)**

**Query Atual:**
```python
if tipo_busca == TipoBusca.SEGMENTO:
    query = query.filter(
        or_(
            Estabelecimento.cnae_fiscal_principal.ilike(f'%{valor_busca}%'),
            Estabelecimento.cnae_fiscal_secundaria.ilike(f'%{valor_busca}%')
        )
    )
```

**Problema:**
- ✅ Índices existem
- ❓ Nunca foi testado
- ❓ Performance desconhecida

**Solução:**
1. Testar com EXPLAIN ANALYZE
2. Verificar se índices estão sendo usados
3. Adicionar LIMIT

---

## 📦 Issues da Sub-Sprint

### **ISSUE-FIX-01: Razão Social (Prioridade P0)** 🔴

**Estimativa:** 3 story points (4-6h)

**Tarefas:**
1. [ ] Executar EXPLAIN ANALYZE na query atual
2. [ ] Verificar uso do índice GIN trigram
3. [ ] REINDEX se necessário: `REINDEX INDEX idx_empresas_razao_social_gin_trgm`
4. [ ] Adicionar LIMIT hardcoded (1000 max)
5. [ ] Adicionar hint de índice (se necessário)
6. [ ] Testar com casos reais: "GOOGLE", "TECH", "BANK"
7. [ ] Meta: < 200ms

**Critérios de Aceitação:**
- [ ] Busca retorna resultados em < 200ms
- [ ] Não trava mesmo com termos comuns
- [ ] Paginação funcional

---

### **ISSUE-FIX-02: Segmento/CNAE (Prioridade P1)** 🟡

**Estimativa:** 2 story points (3-4h)

**Tarefas:**
1. [ ] Testar query atual com EXPLAIN ANALYZE
2. [ ] Verificar índices em cnae_fiscal_principal e secundaria
3. [ ] Adicionar LIMIT hardcoded
4. [ ] Testar com CNAEs reais
5. [ ] Meta: < 150ms

---

### **ISSUE-FIX-03: Email (Prioridade P1)** 🟡

**Estimativa:** 2 story points (3-4h)

**Tarefas:**
1. [ ] EXPLAIN ANALYZE na query de email
2. [ ] Verificar índice GIN: `idx_estab_email_gin`
3. [ ] REINDEX se necessário
4. [ ] Tentar busca exata antes de ILIKE
5. [ ] Adicionar LIMIT hardcoded
6. [ ] Meta: < 200ms

---

### **ISSUE-FIX-04: Telefone (Prioridade P2)** 🟢

**Estimativa:** 3 story points (4-6h)

**Tarefas:**
1. [ ] Criar índice: `idx_estab_telefone_concat_1 ON (ddd_1 || telefone_1)`
2. [ ] Criar índice: `idx_estab_telefone_concat_2 ON (ddd_2 || telefone_2)`
3. [ ] Mudar query para busca exata (sem ILIKE)
4. [ ] Adicionar LIMIT hardcoded
5. [ ] Testar com telefones reais
6. [ ] Meta: < 100ms

---

### **ISSUE-FIX-05: Nome Sócio (Prioridade P2)** 🟢

**Estimativa:** 2 story points (3-4h)

**Tarefas:**
1. [ ] Criar índice GIN trigram: `idx_socios_nome_gin ON cnpj.socios USING gin (nome_socio gin_trgm_ops)`
2. [ ] Implementar query com JOIN
3. [ ] Testar performance
4. [ ] Adicionar LIMIT hardcoded
5. [ ] Meta: < 250ms

---

### **ISSUE-FIX-06: CEP (Prioridade P3)** 🟢

**Estimativa:** 1 story point (1-2h)

**Tarefas:**
1. [ ] Implementar query simples (busca exata)
2. [ ] Testar com índice existente
3. [ ] Adicionar LIMIT (se necessário)
4. [ ] Meta: < 50ms

---

## 🧪 Plano de Testes

### **Testes de Performance:**

```bash
# Script de teste automatizado
for tipo in razao_social segmento email telefone nome_socio cep; do
  echo "Testando: $tipo"
  time curl -X POST http://localhost:8000/api/v1/smart-cnpj/search \
    -H "Content-Type: application/json" \
    -d "{\"tipo_busca\":\"$tipo\",\"valor_busca\":\"teste\"}"
  echo "---"
done
```

### **Critérios de Sucesso:**

| Tipo | Meta Performance | Status Atual | Meta Status |
|------|------------------|--------------|-------------|
| Razão Social | < 200ms | ❌ >120s | ✅ < 200ms |
| Segmento | < 150ms | ❓ Unknown | ✅ < 150ms |
| Email | < 200ms | ❌ >120s | ✅ < 200ms |
| Telefone | < 100ms | ❌ >120s | ✅ < 100ms |
| Nome Sócio | < 250ms | ❌ Not impl | ✅ < 250ms |
| CEP | < 50ms | ❌ Not impl | ✅ < 50ms |

---

## 📅 Timeline

```
Dia 1 (08/12): ISSUE-FIX-01 + ISSUE-FIX-02
  - Manhã: Razão Social (diagnóstico + correção)
  - Tarde: Segmento/CNAE (testes + otimização)

Dia 2 (09/12): ISSUE-FIX-03 + ISSUE-FIX-04
  - Manhã: Email (REINDEX + LIMIT)
  - Tarde: Telefone (criar índices + query)

Dia 3 (10/12): ISSUE-FIX-05 + ISSUE-FIX-06 + Testes
  - Manhã: Nome Sócio (implementar)
  - Meio-dia: CEP (implementar)
  - Tarde: Testes integração + validação geral
```

---

## 🎯 Priorização (MoSCoW)

### **Must Have (P0-P1):**
- 🔴 ISSUE-FIX-01: Razão Social
- 🟡 ISSUE-FIX-02: Segmento/CNAE
- 🟡 ISSUE-FIX-03: Email

### **Should Have (P2):**
- 🟢 ISSUE-FIX-04: Telefone
- 🟢 ISSUE-FIX-05: Nome Sócio

### **Could Have (P3):**
- 🟢 ISSUE-FIX-06: CEP

---

## 🔗 Relação com Sprint Principal

**FEATURE-02 (Filtros como Busca) está PAUSADA até:**
- ✅ Pelo menos 5 dos 6 tipos de busca funcionarem
- ✅ Performance < 200ms em todos
- ✅ Testes de integração passarem

**Motivo:** Não faz sentido permitir busca só por filtros se busca por tipo não funciona.

---

## 📊 Bloqueios Conhecidos

1. **Índices podem estar desatualizados**
   - Solução: REINDEX após análise
   
2. **PostgreSQL pode não usar índices**
   - Solução: ANALYZE + hints se necessário
   
3. **Dados muito volumosos (68M estabelecimentos)**
   - Solução: LIMIT hardcoded em todas queries

---

## ✅ Definition of Done

Uma issue de correção está "Done" quando:
- [ ] Query implementada (se não estava)
- [ ] Performance < meta definida (testado 3x)
- [ ] EXPLAIN ANALYZE mostra uso de índice
- [ ] Não trava com termos comuns
- [ ] Paginação funcional
- [ ] Redis cache funcionando
- [ ] Teste manual OK
- [ ] Commitado e documentado

---

## 📝 Próximos Passos (após Sub-Sprint)

1. ✅ Retomar FEATURE-02 (Filtros como Busca)
2. ✅ Continuar FEATURE-01 (Tipo de Busca UX)
3. ✅ Implementar FEATURE-03 (Buscas Populares)
4. 🎯 Sprint Review da Sprint Smart CNPJ Search

---

**Criado em:** 08/12/2025  
**Responsável:** IA Copilot + LinkerX  
**Sprint Pai:** Smart CNPJ Search  
**Status:** 🏗️ EM PROGRESSO
