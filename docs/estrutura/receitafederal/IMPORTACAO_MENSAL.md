# Guia de Importação Mensal - CNPJ Receita Federal

**Objetivo:** Atualizar base CNPJ mensalmente de forma automatizada

---

## 📅 Quando Importar

A Receita Federal disponibiliza dados atualizados **mensalmente**, geralmente até o dia 10 de cada mês.

**Exemplo:** Dados de Janeiro/2026 disponíveis em 10/Fev/2026

---

## 🚀 Processo Simplificado (Automático)

### Opção 1: Script Automático (Recomendado)

```bash
# 1. Baixar dados da Receita Federal
# Site: https://dadosabertos.rfb.gov.br/CNPJ/
# Salvar em: /Volumes/ExtMB/BaseCNPJ/jan2026/

# 2. Executar importação automática
cd /Users/code4us/Documents/ADACODE/basecerta/scripts
./importar_cnpj_mensal.sh 2026-01 /Volumes/ExtMB/BaseCNPJ/jan2026

# O script fará TUDO automaticamente:
# - ✅ Validar arquivos
# - ✅ Aplicar tuning PostgreSQL
# - ✅ Remover Foreign Keys
# - ✅ Importar dados (6-8 horas)
# - ✅ Recriar Foreign Keys
# - ✅ Restaurar configurações
# - ✅ Validar resultados
```

### Opção 2: Processo Manual

```bash
# 1. Tuning PostgreSQL
cd /Users/code4us/Documents/ADACODE/basecerta/scripts
python3 postgres_tuning.py --apply --user code4us
brew services restart postgresql@17

# 2. Importação
# Editar import_cnpj.py: DATA_DIR = Path("/Volumes/ExtMB/BaseCNPJ/jan2026")
python3 import_cnpj.py 2026-01

# 3. Aguardar 6-8 horas

# 4. Restaurar configurações
python3 postgres_tuning.py --restore --user code4us
brew services restart postgresql@17
```

---

## 📂 Preparação dos Dados

### 1. Download

Acessar: https://dadosabertos.rfb.gov.br/CNPJ/

**Arquivos necessários:**

**Auxiliares (6 arquivos):**
- ✅ Cnaes.zip
- ✅ Municipios.zip  
- ✅ Naturezas.zip
- ✅ Paises.zip
- ✅ Qualificacoes.zip
- ✅ Motivos.zip

**Principais (variável):**
- ✅ Empresas*.zip (10 arquivos)
- ✅ Estabelecimentos*.zip (~20 arquivos)
- ✅ Socios*.zip (~11 arquivos)
- ✅ Simples.zip (1 arquivo)

**Total:** ~41 arquivos ZIP, ~6-7 GB

### 2. Organização

```bash
# Criar pasta para o mês
mkdir -p /Volumes/ExtMB/BaseCNPJ/jan2026

# Mover arquivos baixados
mv ~/Downloads/*.ESTABELE.zip /Volumes/ExtMB/BaseCNPJ/jan2026/
mv ~/Downloads/*.EMPRECSV.zip /Volumes/ExtMB/BaseCNPJ/jan2026/
mv ~/Downloads/*.SOCIOCSV.zip /Volumes/ExtMB/BaseCNPJ/jan2026/
# ... etc

# Renomear se necessário (script espera nomes específicos)
cd /Volumes/ExtMB/BaseCNPJ/jan2026/
for f in *.EMPRECSV*.zip; do 
    num=$(echo $f | grep -o '[0-9]\+' | head -1)
    mv "$f" "Empresas${num}.zip"
done
```

### 3. Validação

```bash
# Listar arquivos
ls -lh /Volumes/ExtMB/BaseCNPJ/jan2026/

# Verificar integridade (opcional)
for f in /Volumes/ExtMB/BaseCNPJ/jan2026/*.zip; do
    unzip -t "$f" > /dev/null 2>&1 && echo "✅ $f" || echo "❌ $f"
done
```

---

## ⚙️ Como Funciona (Internamente)

### Fase 0: Preparação
- Remove Foreign Keys (performance)
- Aplica tuning PostgreSQL

### Fase 1: Tabelas Auxiliares (~1 min)
- TRUNCATE CASCADE nas 6 tabelas
- COPY direto dos ZIPs
- ~7,400 registros totais

### Fase 2: Tabelas Principais (6-8h)

Para cada tipo (Empresas, Estabelecimentos, Simples, Sócios):

1. **Criar TEMP table** (UNLOGGED)
2. **COPY** de todos os ZIPs → TEMP
3. **MERGE** (UPSERT) → Tabela produção
   - Batches de 100k registros
   - ON CONFLICT atualiza
4. **DROP TEMP table**

### Fase 3: Finalização
- Recria Foreign Keys (pode falhar se houver códigos inválidos)
- Restaura configurações PostgreSQL
- Gera estatísticas

---

## 🔍 Monitoramento

### Durante a Importação

```bash
# Seguir log em tempo real
tail -f /Volumes/ExtMB/postgresql/logs/import_2026-01_*.log

# Verificar processo
ps aux | grep import_cnpj

# Tamanho do banco (atualiza em tempo real)
watch -n 60 'psql -U aian_db -d basecerta -c "
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size('"'"'cnpj_brasil.'"'"'||tablename)) as tamanho
FROM pg_tables 
WHERE schemaname = '"'"'cnpj_brasil'"'"'
ORDER BY pg_total_relation_size('"'"'cnpj_brasil.'"'"'||tablename) DESC;"'
```

### Progresso Esperado

| Etapa | Duração | Progresso |
|-------|---------|-----------|
| Auxiliares | ~1 min | 0.1% |
| Empresas | ~30 min | 5% |
| Estabelecimentos | 4-6 horas | 85% |
| Simples | ~20 min | 90% |
| Sócios | 1-2 horas | 100% |

---

## ⚠️ Problemas Comuns

### 1. Foreign Keys Falham ao Recriar

**Causa:** Dados contêm códigos não documentados pela Receita

**Identificados:**
- `qualificacao_responsavel = 36`

**Solução:**
```bash
# Verificar códigos inválidos
python3 manage_foreign_keys.py check

# Inserir códigos faltantes
psql -U code4us -d basecerta << 'EOF'
INSERT INTO qualificacoes_socios (codigo, descricao) VALUES
('36', 'Código não documentado pela Receita Federal')
ON CONFLICT (codigo) DO NOTHING;
EOF

# Tentar recriar FKs novamente
python3 manage_foreign_keys.py create
```

**Alternativa:** Manter sem FKs (índices continuam funcionando normalmente)

### 2. Erro "Disk Full"

```bash
# Verificar espaço
df -h /Volumes/ExtMB

# Liberar espaço se necessário
rm -rf /Volumes/ExtMB/BaseCNPJ/dez2025  # Versão anterior
```

### 3. Importação Muito Lenta

```bash
# Verificar se tuning foi aplicado
psql -U aian_db -d basecerta -c "SHOW shared_buffers;"
psql -U aian_db -d basecerta -c "SHOW fsync;"

# Deve mostrar:
# shared_buffers = 4GB
# fsync = off

# Se não, reaplicar:
python3 postgres_tuning.py --apply --user code4us
brew services restart postgresql@17
```

### 4. Script Interrompido

```bash
# Retomar importação (seguro - usa UPSERT)
python3 import_cnpj.py 2026-01

# Ou restaurar configurações manualmente
python3 postgres_tuning.py --restore --user code4us
brew services restart postgresql@17
```

---

## 📊 Validação Pós-Importação

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
    n.descricao as natureza,
    est.nome_fantasia
FROM cnpj_brasil.empresas e
LEFT JOIN naturezas_juridicas n ON e.natureza_juridica = n.codigo
LEFT JOIN cnpj_brasil.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico 
    AND est.identificador_matriz_filial = '1'
LIMIT 10;
"
```

**Totais esperados (Janeiro/2026 - estimativa):**
- Empresas: ~66M
- Estabelecimentos: ~192M
- Simples Nacional: ~21M
- Sócios: ~82M

---

## 🔄 Estratégia de Atualização

### Primeira Importação (Completa)
- Carrega todos os dados do zero
- ~6-8 horas

### Atualizações Mensais (Incremental via UPSERT)
- MERGE atualiza registros existentes
- INSERT cria novos registros
- Mesmo tempo (~6-8 horas)
- **Sem duplicação de dados**

### Versionamento
- Campo `updated_at` marca última modificação
- Sem histórico (apenas estado atual)
- Para histórico: implementar tabela de auditoria

---

## 💾 Backup Mensal

```bash
# Backup completo (recomendado antes de atualizar)
pg_dump -U code4us -d basecerta \
    --schema=cnpj_brasil \
    --format=custom \
    --file=/Volumes/ExtMB/postgresql/backups/cnpj_brasil_$(date +%Y%m).dump

# Restaurar se necessário
# pg_restore -U code4us -d basecerta \
#     /Volumes/ExtMB/postgresql/backups/cnpj_brasil_202601.dump
```

---

## 📅 Calendário de Manutenção

**Mensalmente:**
- Download novos dados (~dia 10)
- Importação mensal (~dia 15)

**Trimestralmente:**
- Backup completo do banco
- Verificar espaço em disco

**Anualmente:**
- Revisar índices e performance
- Atualizar versão PostgreSQL se necessário

---

## 🆘 Suporte

**Logs importantes:**
- Importação: `/Volumes/ExtMB/postgresql/logs/import_*.log`
- PostgreSQL: `/Volumes/ExtMB/postgresql/data/log/`

**Scripts auxiliares:**
- `manage_foreign_keys.py` - Gerenciar FKs
- `postgres_tuning.py` - Configurar PostgreSQL

**Comandos úteis:**
```bash
# Ver configurações atuais
python3 postgres_tuning.py --status

# Verificar FKs
python3 manage_foreign_keys.py check

# Tamanho do banco
psql -U aian_db -d basecerta -c "\l+ basecerta"
```

---

**Última atualização:** 20/01/2026
**Próxima importação sugerida:** Fevereiro/2026
