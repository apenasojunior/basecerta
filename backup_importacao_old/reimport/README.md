# 📁 Pasta Reimport - Arquivada

**Data de Arquivamento:** 22/01/2026

## ⚠️ Conteúdo Removido

Esta pasta continha scripts de importação CNPJ de uma abordagem anterior que **não está mais em uso**:

### Scripts Removidos:
- `atualizar_base_cnpj_mensal.sh` - Importação mensal com schema swap
- `cnpj-manager.sh` - Menu interativo (700 linhas)
- `rollback_swap_cnpj.sh` - Rollback de schema swap
- `verificar_status_cnpj.sh` - Status de schema
- `limpar-logs.sh` / `cron-limpar-logs.sh` - Limpeza de logs
- `ver-progresso.sh` - Monitor de progresso
- Documentação antiga (README_CNPJ.md, COMANDOS_RAPIDOS.txt, etc.)

### Por que foram removidos?

**Abordagem Antiga:**
- Usava Docker containers para backend
- Schema swap (cnpj_brasil_new → cnpj_brasil)
- Dados em `docs/baseCNPJ/`
- PostgreSQL dentro do container

**Abordagem Atual (em uso):**
- PostgreSQL 17 nativo no HD externo Samsung T7
- TEMP UNLOGGED + MERGE (sem duplicação)
- Dados em `/Volumes/ExtMB/BaseCNPJ/`
- Scripts: `import_cnpj.py` + `importar_cnpj_mensal.sh`

---

## ✅ Scripts Atuais em Uso

Localização: `/scripts/` (raiz)

### Importação:
- **`import_cnpj.py`** - Script Python principal de importação
- **`importar_cnpj_mensal.sh`** - Wrapper de automação mensal (corrigido)

### Monitoramento:
- **`monitor_importacao.sh`** - Monitor em tempo real

### Gerenciamento HD Externo:
- **`pausar_para_desconectar_hd.sh`** - Pausa segura para desconectar HD
- **`reconectar_e_retomar.sh`** - Retoma após reconectar HD

### Tuning:
- **`postgres_tuning.py`** - Aplica/restaura configurações de performance

---

## 📚 Documentação Atual

- **Estrutura do Banco:** `/docs/estrutura/receitafederal/`
- **Sprints:** `/docs/sprints/`
  - `IMPORTA_HASH.md` - Próxima sprint (importação incremental)

---

## 🗂️ Esta Pasta

Mantida vazia para futuras necessidades de reimportação ou scripts experimentais.

Se precisar recuperar scripts antigos: consultar histórico do Git (commit anterior a 22/01/2026).
