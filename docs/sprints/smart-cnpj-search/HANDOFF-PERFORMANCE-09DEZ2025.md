# 🚀 HANDOFF: Otimização de Performance Smart CNPJ Search

**Data:** 09/12/2025  
**Contexto:** Sub-sprint emergencial para corrigir performance de buscas  
**Status:** 2/7 tipos funcionando, 5 tipos precisam SQL raw  

---

## 📊 Situação Atual

### Problema Descoberto
Apenas **1 de 7 tipos de busca** funcionava (CNPJ). Os outros 6 tipos tinham timeout (>30s).

### Testes Realizados
**Teste via API real (backend rodando em http://localhost:8000):**

| Tipo | Performance | Status | Observação |
|------|-------------|--------|------------|
| Razão Social | **26ms** | ✅ ÓTIMO | Funciona perfeitamente |
| Nome Sócio | **17ms** | ✅ ÓTIMO | Funciona perfeitamente |
| CNPJ | **39s** | ❌ CRÍTICO | Deveria ser <1ms |
| CNAE/Segmento | **1.2s** | ⚠️ LENTO | Meta: <200ms |
| Email | **35s** | ❌ CRÍTICO | Timeout frequente |
| Telefone | **76s** | ❌ CRÍTICO | Timeout frequente |
| CEP | **TRAVOU** | ❌ CRÍTICO | 26min+ no teste SQL |

**Meta:** <200ms para TODOS os 7 tipos

---

## 🔧 O Que Foi Feito

### 1. Análise do Banco de Dados

**Estrutura:**
- Database: `basecerta` (PostgreSQL 14+)
- Owner: `aian_db` / Password: `aian_db`
- Port: `5432` (padrão, NÃO 5434)
- Schemas: `public` (app) + `cnpj` (dados CNPJ)

**Dados:**
- `cnpj.empresas`: 64M registros (23GB)
- `cnpj.estabelecimentos`: 68M registros (30GB)
- `cnpj.socios`: 26M registros (5.2GB)
- **Total:** 159M registros, ~58GB

**Matrizes ativas:** ~6M de 68M (90% redução com filtro)

### 2. Índices Criados (4.9 GB total)

```sql
-- Índices parciais (apenas matrizes ativas)
idx_estab_matriz_ativa                (778 MB)  -- Base
idx_estab_matriz_ativa_cep            (204 MB)  -- CEP
idx_estab_matriz_ativa_email_gin      (986 MB)  -- Email GIN trigram
idx_estab_matriz_ativa_cnae           (171 MB)  -- CNAE
idx_estab_matriz_ativa_tel1           (638 MB)  -- Telefone 1 (ddd_1 || telefone_1)
idx_estab_matriz_ativa_tel2           (195 MB)  -- Telefone 2 (ddd_2 || telefone_2)

-- Índices compostos (para JOINs)
idx_estab_cnpj_cep_ativa             (1001 MB) -- (cnpj_basico, cep)
idx_estab_cnpj_cnae_ativa            (1001 MB) -- (cnpj_basico, cnae)

-- Já existentes (criados antes)
idx_empresas_razao_social_gin_trgm             -- GIN trigram razão social
```

**Comando para verificar:**
```bash
psql -U aian_db -d basecerta -c "SELECT indexname, pg_size_pretty(pg_relation_size(schemaname||'.'||indexname)) as size FROM pg_indexes WHERE schemaname = 'cnpj' AND tablename = 'estabelecimentos' AND indexname LIKE '%matriz_ativa%';"
```

### 3. Otimizações no Código Python

**Arquivo:** `backend/app/crud/smart_cnpj.py`

**Mudanças aplicadas:**
1. ✅ Remover JOIN prematuro da query base (linha 169)
2. ✅ Filtrar matrizes ativas ANTES de fazer JOIN
3. ✅ Adicionar filtro matriz ativa em TODOS os tipos de busca
4. ✅ Ordem correta: filtros → JOIN (não JOIN → filtros)

**Exemplo (CEP otimizado):**
```python
# ANTES (ruim - JOIN antes de filtrar)
query = db.query(Estabelecimento).join(Estabelecimento.empresa)
query = query.filter(Estabelecimento.cep.like(f"{cep}%"))

# DEPOIS (bom - filtrar antes de JOIN)
query = db.query(Estabelecimento)
query = query.filter(
    and_(
        Estabelecimento.identificador_matriz_filial == '1',  # 90% redução
        Estabelecimento.situacao_cadastral == '02',
        Estabelecimento.cep.like(f"{cep}%")  # Usa idx_estab_cnpj_cep_ativa
    )
)
query = query.join(Estabelecimento.empresa)  # JOIN por último
```

### 4. Configurações do Ambiente

**Python:**
- ⚠️ **Sistema tem Python 3.9.6** (incompatível!)
- ✅ **Projeto requer Python 3.11+** (Pydantic v2)
- 📝 Documentado em `docs/ESTRUTURA_DE_REFERENCIA_PARA_IA/estrutura_servicos.md`

**Docker:**
- Backend rodando: `basecerta_backend` (port 8000)
- Redis rodando: `basecerta_redis` (port 6379)
- PostgreSQL: EXTERNO (não containerizado, port 5432)

**Redis:**
- ✅ Funcionando corretamente
- TTL: 24h para buscas Smart CNPJ
- Cache key: `search:{tipo}:{valor}:{filtros_hash}`
- Performance: 25-40ms cache hit vs 1-70s database miss
- **Nota:** Testes de performance foram feitos SEM Redis (acesso direto ao banco)

---

## 🔍 Diagnóstico Técnico

### Causa Raiz Identificada

**SQLAlchemy ORM não está usando os índices compostos corretamente!**

**Evidência:**
1. ✅ Query SQL raw via psql: CEP em **1s** (usa índices)
2. ❌ Query via ORM SQLAlchemy: CEP em **26min+** (Seq Scan)
3. ✅ Razão Social funciona: Usa índice GIN trigram corretamente
4. ❌ Outros tipos: ORM ignora índices compostos nos JOINs

**Prova (EXPLAIN ANALYZE via psql):**
```sql
-- Query manual (RÁPIDA - 1s)
EXPLAIN ANALYZE 
SELECT e.cnpj_basico FROM cnpj.empresas e
JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
WHERE est.identificador_matriz_filial = '1' 
AND est.situacao_cadastral = '02' 
AND est.cep LIKE '01310%' 
LIMIT 50;

-- Resultado: Index Only Scan using idx_estab_cnpj_cep_ativa
-- Execution Time: 886.822 ms (0.9s)
```

**Mas ORM gera SQL diferente que faz Seq Scan!**

### Por Que Razão Social e Nome Sócio Funcionam?

**Razão Social (26ms):**
- Usa índice GIN trigram `idx_empresas_razao_social_gin_trgm`
- Índice está na tabela `empresas` (não precisa de composto)
- ORM consegue usar índice simples corretamente

**Nome Sócio (17ms):**
- Retorna 0 resultados no teste (query rápida por isso)
- Precisa re-testar com valor que retorne dados

---

## 💡 Solução Proposta

### Converter Queries Críticas para SQL Raw

**5 tipos que precisam SQL raw:**
1. CNPJ (39s → <10ms esperado)
2. CNAE (1.2s → <200ms esperado)
3. Email (35s → <500ms esperado)
4. Telefone (76s → <1s esperado)
5. CEP (TRAVOU → <1s esperado)

**Manter ORM para:**
- Razão Social (já funciona - 26ms)
- Nome Sócio (já funciona - 17ms, mas precisa re-testar com dados)

### Template SQL Raw (CEP exemplo)

```python
from sqlalchemy import text

def search_by_cep(db: Session, cep: str, limit: int = 50, offset: int = 0):
    """Busca por CEP usando SQL raw otimizado"""
    
    sql = text("""
        SELECT 
            e.cnpj_basico,
            e.razao_social,
            e.capital_social,
            est.cnpj_basico || est.cnpj_ordem || est.cnpj_dv as cnpj_completo,
            est.nome_fantasia,
            est.cep,
            est.logradouro,
            est.numero,
            est.bairro
        FROM cnpj.estabelecimentos est
        JOIN cnpj.empresas e ON est.cnpj_basico = e.cnpj_basico
        WHERE est.identificador_matriz_filial = '1'
        AND est.situacao_cadastral = '02'
        AND est.cep LIKE :cep_pattern
        ORDER BY e.capital_social DESC NULLS LAST
        LIMIT :limit OFFSET :offset
    """)
    
    result = db.execute(sql, {
        'cep_pattern': f'{cep}%',
        'limit': limit,
        'offset': offset
    })
    
    return result.fetchall()
```

**Vantagens:**
- ✅ PostgreSQL usa índices compostos corretamente
- ✅ EXPLAIN ANALYZE mostra "Index Only Scan"
- ✅ Performance: 1-2 ordens de magnitude mais rápido
- ✅ Segurança: bind parameters previnem SQL injection
- ✅ Redis continua funcionando (cache na camada service)

**Desvantagens:**
- ⚠️ Perde type hints do ORM
- ⚠️ Precisa mapear resultados manualmente
- ⚠️ Manutenção: SQL strings são menos refatoráveis

---

## 📁 Arquivos Modificados

### Código
- ✅ `backend/app/crud/smart_cnpj.py` - Otimizações ORM aplicadas

### Documentação Atualizada
- ✅ `docs/sprints/smart-cnpj-search/KANBAN.md` - Status atualizado com sub-sprint
- ✅ `docs/ESTRUTURA_DE_REFERENCIA_PARA_IA/estrutura_servicos.md` - Redis, Docker, Python 3.11 requirement

### Scripts Criados
- ✅ `backend/scripts/test_all_search_types.py` - Teste de performance dos 7 tipos

---

## 🎯 Próximos Passos

### Imediato (Sessão Atual)
1. **Implementar SQL raw para os 5 tipos lentos**
   - Começar por CNPJ (mais crítico)
   - Depois CEP, Email, Telefone, CNAE
   
2. **Manter estrutura do service layer**
   - Redis continua na camada `smart_cnpj_service.py`
   - CRUD usa SQL raw, service faz cache
   
3. **Testar cada tipo após implementação**
   - Via API real (não SQL direto)
   - Validar <200ms em todos

### Médio Prazo
4. **Atualizar Python para 3.11+**
   ```bash
   brew install python@3.11
   brew link python@3.11 --force
   ```

5. **Monitorar uso de índices**
   ```sql
   -- Ver índices mais usados
   SELECT schemaname, tablename, indexname, idx_scan 
   FROM pg_stat_user_indexes 
   WHERE schemaname = 'cnpj' 
   ORDER BY idx_scan DESC;
   ```

6. **Considerar adicionar índices compostos adicionais**
   - Se Email e Telefone continuarem lentos com SQL raw
   - Índices com (cnpj_basico, email) e (cnpj_basico, telefones)

---

## 🧪 Como Testar

### 1. Verificar Backend Rodando
```bash
curl http://localhost:8000/health
# Deve retornar: {"status":"healthy","services":{"database":"connected","redis":"connected"}}
```

### 2. Testar via API (CEP exemplo)
```bash
time curl -s -X POST http://localhost:8000/api/v1/smart-cnpj/search \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_busca": "cep",
    "valor_busca": "01310",
    "page": 1,
    "limit": 10
  }' | jq -r '.data | length'
```

### 3. Rodar Teste Completo
```bash
cd backend
python3 scripts/test_all_search_types.py
```

### 4. Verificar Índices
```bash
psql -U aian_db -d basecerta -c "SELECT indexname, pg_size_pretty(pg_relation_size(schemaname||'.'||indexname)) FROM pg_indexes WHERE schemaname = 'cnpj' AND indexname LIKE '%matriz_ativa%';"
```

---

## ⚠️ Avisos Importantes

### Database Connection
- ❌ **NÃO use porta 5434** (não existe)
- ✅ **Use porta 5432** (padrão PostgreSQL)
- Connection string: `postgresql://aian_db:aian_db@localhost:5432/basecerta`

### Python Version
- Sistema atual: Python 3.9.6 (**INCOMPATÍVEL**)
- Projeto requer: Python 3.11+ (Pydantic v2)
- Pode causar erros em runtime

### Redis
- ✅ Funcionando e configurado corretamente
- Não precisa de mudanças
- Continua cacheando após otimizações

### Não Delete Dados!
- ❌ **NÃO deletar registros inativos**
- Índices parciais já fazem isso (filtram 90%)
- Deletar = perda permanente de dados históricos
- Performance não melhora (índices já otimizados)

---

## 📚 Referências Técnicas

### Estrutura do Banco
Ver: `docs/ESTRUTURA_DE_REFERENCIA_PARA_IA/estrutura_db.md`

### Índices e Performance
- Índices parciais: 10x menores que globais
- GIN trigram: Ideal para ILIKE '%termo%'
- Índices compostos: Necessários para JOINs eficientes

### Queries Otimizadas
Padrão para queries rápidas:
1. Filtrar matrizes ativas PRIMEIRO (90% redução)
2. Aplicar filtro específico (CEP, CNAE, etc)
3. Fazer JOIN por ÚLTIMO
4. Usar índices compostos (cnpj_basico + filtro)

---

## 🔗 Links Úteis

- KANBAN: `docs/sprints/smart-cnpj-search/KANBAN.md`
- Estrutura DB: `docs/ESTRUTURA_DE_REFERENCIA_PARA_IA/estrutura_db.md`
- Estrutura Serviços: `docs/ESTRUTURA_DE_REFERENCIA_PARA_IA/estrutura_servicos.md`
- Backend code: `backend/app/crud/smart_cnpj.py`
- Service layer: `backend/app/services/smart_cnpj_service.py`

---

**Última atualização:** 09/12/2025 01:05  
**Próxima sessão:** Implementar SQL raw para os 5 tipos lentos
