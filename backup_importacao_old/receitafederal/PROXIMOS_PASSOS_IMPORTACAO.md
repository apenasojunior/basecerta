# Próximos Passos - Importação CNPJ

**Status Atual:** Foreign Keys removidas, importação em andamento

## 📋 Checklist de Execução

### 1. Importação em Andamento

```bash
# Monitorar progresso
tail -f /Volumes/ExtMB/postgresql/logs/import_final.log

# Verificar processo
ps aux | grep import_cnpj

# Status do banco
psql -U aian_db -d basecerta -c "
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'cnpj_brasil'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

**Estimativa:** 6-8 horas para importação completa

### 2. Após Conclusão da Importação

#### A. Restaurar Configurações PostgreSQL

```bash
cd /Users/code4us/Documents/ADACODE/basecerta/scripts

# Restaurar configurações normais
python3 postgres_tuning.py --restore --user code4us

# Reiniciar PostgreSQL
brew services restart postgresql@17
```

#### B. Verificar Códigos Inválidos

```bash
# Verificar referências inválidas
python3 manage_foreign_keys.py check
```

**Ação necessária se houver códigos inválidos:**

```sql
-- Inserir códigos faltantes em qualificacoes_socios
INSERT INTO qualificacoes_socios (codigo, descricao) 
VALUES ('36', 'Código não documentado pela Receita Federal')
ON CONFLICT (codigo) DO NOTHING;

-- Repetir para outros códigos inválidos identificados
```

#### C. Recriar Foreign Keys

```bash
# Tentar recriar FKs (pode falhar se houver códigos inválidos)
python3 manage_foreign_keys.py create
```

**Se falhar:** Códigos inválidos precisam ser corrigidos primeiro (ver passo B)

**Se sucesso:** Integridade referencial restaurada ✅

### 3. Validação Final

```bash
# Verificar totais
psql -U aian_db -d basecerta -c "
SELECT 
    'empresas' as tabela, 
    COUNT(*) as total,
    pg_size_pretty(pg_total_relation_size('cnpj_brasil.empresas')) as tamanho
FROM cnpj_brasil.empresas
UNION ALL
SELECT 
    'estabelecimentos', 
    COUNT(*),
    pg_size_pretty(pg_total_relation_size('cnpj_brasil.estabelecimentos'))
FROM cnpj_brasil.estabelecimentos
UNION ALL
SELECT 
    'simples_nacional', 
    COUNT(*),
    pg_size_pretty(pg_total_relation_size('cnpj_brasil.simples_nacional'))
FROM cnpj_brasil.simples_nacional
UNION ALL
SELECT 
    'socios', 
    COUNT(*),
    pg_size_pretty(pg_total_relation_size('cnpj_brasil.socios'))
FROM cnpj_brasil.socios;
"

# Teste de consulta
psql -U aian_db -d basecerta -c "
SELECT 
    e.cnpj_basico,
    e.razao_social,
    n.descricao as natureza
FROM cnpj_brasil.empresas e
LEFT JOIN naturezas_juridicas n ON e.natureza_juridica = n.codigo
LIMIT 5;
"
```

### 4. Backup Final

```bash
# Backup do banco completo
pg_dump -U code4us -d basecerta \
    --schema=cnpj_brasil \
    --format=custom \
    --file=/Volumes/ExtMB/postgresql/backups/cnpj_brasil_$(date +%Y%m%d).dump

# Verificar tamanho
ls -lh /Volumes/ExtMB/postgresql/backups/
```

## 🔧 Problemas Conhecidos e Soluções

### Problema: Foreign Keys Falham ao Recriar

**Causa:** Dados da Receita Federal contêm códigos não documentados

**Identificados:**
- `qualificacao_responsavel = 36` (não existe em qualificacoes_socios)

**Solução:**
```sql
-- Opção 1: Inserir códigos faltantes
INSERT INTO qualificacoes_socios (codigo, descricao) VALUES
('36', 'Código não documentado pela Receita Federal');

-- Opção 2: Converter para NULL
UPDATE cnpj_brasil.empresas 
SET qualificacao_responsavel = NULL 
WHERE qualificacao_responsavel = '36';

-- Opção 3: Manter sem FKs (índices continuam funcionando)
-- Sem ação necessária
```

### Problema: Importação Lenta

**Soluções aplicadas:**
- ✅ PostgreSQL tuning (fsync=off, shared_buffers=4GB)
- ✅ Foreign keys removidas
- ✅ Tabelas TEMP UNLOGGED
- ✅ COPY direto dos ZIPs

**Se ainda lento:**
```bash
# Verificar espaço em disco
df -h /Volumes/ExtMB

# Verificar I/O
iostat -w 5

# Verificar processos PostgreSQL
ps aux | grep postgres
```

## 📊 Métricas Esperadas

**Totais esperados (Dez/2025):**
- Empresas: ~65M registros
- Estabelecimentos: ~190M registros  
- Simples Nacional: ~20M registros
- Sócios: ~80M registros

**Tamanho em disco:**
- Total: ~180-220 GB
- Empresas: ~15 GB
- Estabelecimentos: ~120-150 GB
- Sócios: ~40-50 GB

**Performance:**
- Importação auxiliares: ~1 minuto
- Importação empresas: ~30 minutos
- Importação estabelecimentos: 4-6 horas
- Importação sócios: 1-2 horas

## 📁 Arquivos Importantes

**Scripts:**
- `/Users/code4us/Documents/ADACODE/basecerta/scripts/import_cnpj.py`
- `/Users/code4us/Documents/ADACODE/basecerta/scripts/postgres_tuning.py`
- `/Users/code4us/Documents/ADACODE/basecerta/scripts/manage_foreign_keys.py`

**Logs:**
- `/Volumes/ExtMB/postgresql/logs/import_final.log`
- `/Volumes/ExtMB/postgresql/logs/recreate_foreign_keys.sql`

**Dados:**
- `/Volumes/ExtMB/BaseCNPJ/dez2025/` (41 arquivos ZIP, 6.8 GB)
- `/Volumes/ExtMB/postgresql/data/` (banco PostgreSQL)

## 🎯 Comando Final de Verificação

```bash
# Executar após tudo concluído
psql -U aian_db -d basecerta << 'EOF'
\timing on

SELECT '=== RESUMO IMPORTAÇÃO CNPJ ===' as info;

SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size('cnpj_brasil.'||tablename)) as tamanho,
    (SELECT COUNT(*) FROM cnpj_brasil.empresas WHERE tablename = 'empresas') as registros
FROM pg_tables 
WHERE schemaname = 'cnpj_brasil'
ORDER BY pg_total_relation_size('cnpj_brasil.'||tablename) DESC;

SELECT '=== ÍNDICES ===' as info;
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_indexes
WHERE schemaname = 'cnpj_brasil'
ORDER BY pg_relation_size(indexrelid) DESC
LIMIT 10;

SELECT '=== FOREIGN KEYS ===' as info;
SELECT COUNT(*) as total_fks
FROM pg_constraint con
JOIN pg_class cls ON con.conrelid = cls.oid
JOIN pg_namespace nsp ON cls.relnamespace = nsp.oid
WHERE con.contype = 'f' AND nsp.nspname = 'cnpj_brasil';

\timing off
EOF
```

**Data última atualização:** 20/01/2026 22:35
**Versão dados:** Dez/2025
**Status:** Importação em andamento (FKs removidas)
