# Scripts de Importação CNPJ

## 📦 Scripts Principais

### 🚀 `import_cnpj.py` (Produção)
**Função:** Importação completa dos dados da Receita Federal  
**Uso:**
```bash
python3 import_cnpj.py 2025-12
```
**Características:**
- Arquitetura TEMP tables + MERGE (sem duplicação)
- UPSERT em batches de 100k registros
- Suporta atualizações mensais
- Logs detalhados em `/Volumes/ExtMB/postgresql/logs/`
- Progresso em tempo real

**Tempo:** 6-8 horas (primeira vez), 4-5 horas (atualizações)

---

### ⚙️ `postgres_tuning.py` (Otimização)
**Função:** Auto-tuning do PostgreSQL para importação  
**Uso:**
```bash
# Aplicar tuning para importação
python3 postgres_tuning.py --apply

# Verificar configurações
python3 postgres_tuning.py --status

# Restaurar configurações originais
python3 postgres_tuning.py --restore
```
**O que faz:**
- Detecta RAM, CPU, tipo de disco
- Calcula configurações otimizadas
- Backup automático do postgresql.conf
- Aplica tuning agressivo (fsync=off, etc.)
- Restaura configurações seguras após importação

**Ganho:** ~30% mais rápido

---

## 📊 Scripts de Análise

### `analise_qualidade_campos.py`
**Função:** Análise de qualidade campo a campo  
**Uso:**
```bash
python3 analise_qualidade_campos.py
```
**Saída:**
- % de NULL por campo
- Detecção de encoding issues
- Contagem de erros de parsing
- Análise de caracteres especiais
- Amostra de 100k registros por arquivo

**Quando usar:** Antes da primeira importação ou ao receber novos dados

---

### `analise_detalhada_receita.py`
**Função:** Análise completa dos arquivos ZIP  
**Uso:**
```bash
python3 analise_detalhada_receita.py
```
**Saída:**
- Estatísticas por campo
- Valores mais comuns
- Distribuição de dados
- Detecção de outliers

**Quando usar:** Para entender melhor a estrutura dos dados

---

### `analisar_receita.py`
**Função:** Contador rápido de registros  
**Uso:**
```bash
python3 analisar_receita.py
```
**Saída:**
- Total de registros por tabela
- Tamanho dos arquivos ZIP
- Estimativa de espaço pós-importação

**Quando usar:** Verificação rápida dos dados

---

### `contar_linhas_zip.py`
**Função:** Contagem precisa linha a linha  
**Uso:**
```bash
python3 contar_linhas_zip.py
```
**Saída:**
- Contagem exata de linhas em cada ZIP
- Total por tipo de arquivo
- Comparação com banco (se importado)

**Quando usar:** Validação pós-importação

---

## 🔧 Configuração

### Paths Atuais
```python
DATA_DIR = Path("/Volumes/ExtMB/BaseCNPJ/dez2025")
TEMP_EXTRACT_DIR = Path("/Volumes/ExtMB/temp")
LOG_DIR = Path("/Volumes/ExtMB/postgresql/logs")

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'basecerta',
    'user': 'aian_db',
    'password': 'P@lm315@s'
}
```

### Para Atualizar para Nova Versão (ex: Jan/2026)
```python
# Em import_cnpj.py, linha 18:
DATA_DIR = Path("/Volumes/ExtMB/BaseCNPJ/jan2026")

# Em scripts de análise:
BASE_DIR = Path("/Volumes/ExtMB/BaseCNPJ/jan2026")
```

---

## 📝 Dependências

```bash
pip install psycopg2-binary psutil
```

---

## 🎯 Workflow Completo

```bash
# 1. Análise inicial dos dados
python3 analise_qualidade_campos.py

# 2. Aplicar tuning
python3 postgres_tuning.py --apply

# 3. Executar importação
python3 import_cnpj.py 2025-12

# 4. Validar (em outro terminal)
python3 contar_linhas_zip.py

# 5. Restaurar config
python3 postgres_tuning.py --restore
brew services restart postgresql@17
```

---

## 📚 Documentação Completa

Ver: `docs/estrutura/receitafederal/GUIA_COMPLETO_IMPORTACAO_CNPJ.md`

Contém:
- Estrutura completa dos dados
- Como foi feita a migração do PostgreSQL para disco externo
- Arquitetura de importação detalhada
- Troubleshooting completo
- Comandos de manutenção
