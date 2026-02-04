# S02 - INTEGRAÇÃO BASE CNPJ

**Período**: 01/02/2026 - 15/02/2026  
**Objetivo**: Conectar aplicação BaseCerta à base de dados CNPJ com 322M+ registros, corrigindo models e implementando APIs de consulta  
**Story Points Total**: 55 pontos  
**Status**: 🔴 To Do

---

## 🎯 Objetivo da Sprint

Realizar integração completa da aplicação com a base de dados CNPJ existente, corrigindo divergências estruturais entre os models SQLAlchemy e o banco PostgreSQL real, e implementando endpoints REST para consulta eficiente de empresas, estabelecimentos e sócios.

---

## 📊 Context

**Situação Atual:**
- ✅ Banco PostgreSQL com 322M+ registros no schema `cnpj`
- ✅ Models SQLAlchemy existentes mas com divergências estruturais
- ❌ Models não refletem estrutura real do banco
- ❌ Faltam CRUDs e endpoints para consultas

**Documentação de Referência:**
- [Deep Dive Análise](../../estrutura/db/deepdive_cnpj_20260201_222015.md)
- [Plano de Integração Original](../../estrutura/db/PLANO_INTEGRACAO_CNPJ.md)
- [Estrutura do Banco](../../estrutura/db/database_structure_20260201_214901.md)

---

## 🎯 Features desta Sprint

### S02-F01 - CORRIGIR MODELS SQLALCHEMY
**Story Points**: 13 pontos  
**Responsável**: Dev Backend  
**Status**: 🔴 To Do  
**Prioridade**: 🔥 Critical

**Descrição:**  
Ajustar todos os models em `backend/app/models/cnpj.py` para corresponder exatamente à estrutura real do banco PostgreSQL, incluindo PKs, FKs, tipos de dados e relacionamentos.

**Critérios de Aceitação:**
- [ ] Tabela `socios` corrigida (remover id autoincrement, usar PK composta)
- [ ] Campo `ente_federativo_responsavel` renomeado para `ente_federativo`
- [ ] Todos os tamanhos de varchar() ajustados conforme banco real
- [ ] ForeignKeys removidas de tabelas auxiliares (manter apenas relationships)
- [ ] Models validados contra estrutura real do banco

#### Issues:
- [ ] S02-F01-I01: Corrigir model Socio (remover id, implementar PK composta)
- [ ] S02-F01-I02: Corrigir model Empresa (renomear campo ente_federativo)
- [ ] S02-F01-I03: Ajustar tamanhos de varchar em todos os models
- [ ] S02-F01-I04: Remover ForeignKeys de tabelas auxiliares
- [ ] S02-F01-I05: Validar models contra JSON de análise do banco
- [ ] S02-F01-I06: Testar conexão e queries básicas

---

### S02-F02 - IMPLEMENTAR CRUD REPOSITORY
**Story Points**: 13 pontos  
**Responsável**: Dev Backend  
**Status**: 🔴 To Do  
**Prioridade**: 🔥 Critical

**Descrição:**  
Criar camada de repositório (CRUD) para operações de consulta na base CNPJ, otimizadas para usar os índices existentes.

**Critérios de Aceitação:**
- [ ] Arquivo `backend/app/crud/cnpj.py` criado
- [ ] Métodos de busca implementados e otimizados
- [ ] Queries utilizando índices apropriados
- [ ] Tratamento de erros implementado
- [ ] Testes unitários passando

#### Issues:
- [ ] S02-F02-I01: Criar estrutura base do CNPJRepository
- [ ] S02-F02-I02: Implementar busca por CNPJ básico e completo
- [ ] S02-F02-I03: Implementar busca por razão social (usar índice)
- [ ] S02-F02-I04: Implementar consultas de sócios
- [ ] S02-F02-I05: Implementar consulta Simples Nacional
- [ ] S02-F02-I06: Criar testes unitários do repository

---

### S02-F03 - CRIAR SCHEMAS PYDANTIC
**Story Points**: 8 pontos  
**Responsável**: Dev Backend  
**Status**: 🔴 To Do  
**Prioridade**: 🟠 High

**Descrição:**  
Criar schemas Pydantic para validação de request/response dos endpoints CNPJ, incluindo computed fields e formatação de dados.

**Critérios de Aceitação:**
- [ ] Arquivo `backend/app/schemas/cnpj.py` criado
- [ ] Schemas de request/response definidos
- [ ] Computed fields implementados (CNPJ formatado, etc)
- [ ] Validações de entrada configuradas
- [ ] Documentação automática funcionando

#### Issues:
- [ ] S02-F03-I01: Criar schemas base (Empresa, Estabelecimento, Socio)
- [ ] S02-F03-I02: Criar schemas de response detalhados
- [ ] S02-F03-I03: Implementar computed fields (@property)
- [ ] S02-F03-I04: Criar schemas de request (SearchRequest)
- [ ] S02-F03-I05: Adicionar validações e constraints

---

### S02-F04 - IMPLEMENTAR ENDPOINTS REST API
**Story Points**: 13 pontos  
**Responsável**: Dev Backend  
**Status**: 🔴 To Do  
**Prioridade**: 🟠 High

**Descrição:**  
Criar endpoints REST em FastAPI para consultas na base CNPJ, com paginação, filtros e documentação automática.

**Critérios de Aceitação:**
- [ ] Arquivo `backend/app/api/v1/cnpj.py` criado
- [ ] Endpoints de consulta implementados
- [ ] Paginação configurada
- [ ] Filtros avançados funcionando
- [ ] Swagger docs atualizado
- [ ] Rate limiting configurado

#### Issues:
- [ ] S02-F04-I01: Criar router e estrutura base
- [ ] S02-F04-I02: Implementar GET /empresa/{cnpj_basico}
- [ ] S02-F04-I03: Implementar GET /search/empresas (razão social)
- [ ] S02-F04-I04: Implementar GET /estabelecimento/{cnpj_completo}
- [ ] S02-F04-I05: Implementar GET /socios/empresa/{cnpj_basico}
- [ ] S02-F04-I06: Implementar GET /socios/search (nome, CPF/CNPJ)
- [ ] S02-F04-I07: Registrar router no app principal

---

### S02-F05 - TESTES E VALIDAÇÃO
**Story Points**: 8 pontos  
**Responsável**: Dev Backend + QA  
**Status**: 🔴 To Do  
**Prioridade**: 🟡 Medium

**Descrição:**  
Criar suite de testes completa para validar integração, performance e correção dos endpoints CNPJ.

**Critérios de Aceitação:**
- [ ] Testes de integração implementados
- [ ] Testes de performance com dados reais
- [ ] Validação de queries otimizadas
- [ ] Coverage > 80%
- [ ] CI/CD atualizado

#### Issues:
- [ ] S02-F05-I01: Criar testes de integração para endpoints
- [ ] S02-F05-I02: Criar testes de performance (queries com índices)
- [ ] S02-F05-I03: Validar uso correto dos índices (EXPLAIN ANALYZE)
- [ ] S02-F05-I04: Testar edge cases e erros
- [ ] S02-F05-I05: Documentar resultados dos testes

---

## 📋 Checklist Geral da Sprint

### Pré-requisitos
- [x] Análise do banco de dados concluída
- [x] Documentação técnica gerada
- [x] Plano de integração definido
- [ ] Ambiente de desenvolvimento configurado

### Durante a Sprint
- [ ] Models corrigidos e validados
- [ ] CRUDs implementados
- [ ] Schemas Pydantic criados
- [ ] Endpoints REST funcionando
- [ ] Testes passando
- [ ] Documentação atualizada

### Entrega Final
- [ ] Code review realizado
- [ ] Testes de integração passando
- [ ] Performance validada
- [ ] Swagger docs atualizado
- [ ] README atualizado com exemplos de uso
- [ ] Deploy em staging

---

## 🎯 Métricas de Sucesso

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Coverage de Testes | > 80% | pytest --cov |
| Performance de Queries | < 500ms | EXPLAIN ANALYZE |
| Endpoints Funcionais | 100% | Testes de integração |
| Documentação | 100% | Swagger completo |

---

## 📊 Burndown Esperado

```
Story Points: 55
Dia 1-3:   Feature 1 (13 pontos) - Models
Dia 4-6:   Feature 2 (13 pontos) - CRUDs
Dia 7-9:   Feature 3 (8 pontos) - Schemas
Dia 10-12: Feature 4 (13 pontos) - Endpoints
Dia 13-14: Feature 5 (8 pontos) - Testes
```

---

## 🔗 Dependências

**Bloqueia:**
- Sprint 03: Implementação de Features Avançadas de Busca
- Sprint 04: Dashboard Analytics com dados CNPJ

**Depende de:**
- ✅ Banco de dados CNPJ importado e funcional
- ✅ Análise técnica da estrutura concluída

---

## 📝 Notas Importantes

### Divergências Críticas Encontradas:
1. **Tabela socios**: NÃO tem PK autoincrement (usar PK composta)
2. **Campo renomeado**: `ente_federativo_responsavel` → `ente_federativo`
3. **FKs ausentes**: Tabelas auxiliares não têm FKs no banco
4. **Índices importantes**: Já existem e devem ser usados nas queries

### Decisões Técnicas:
- Manter `primary_key=True` nos models de tabelas auxiliares (necessário para ORM)
- Remover `ForeignKey()` mas manter `relationship()` para tabelas de domínio
- Usar `extend_existing=True` em todos os models para evitar conflitos

---

## 📚 Recursos e Referências

### Documentação Técnica:
- [Deep Dive Banco CNPJ](../../estrutura/db/deepdive_cnpj_20260201_222015.md)
- [JSON Análise Estrutural](../../estrutura/db/deepdive_cnpj_20260201_222015.json)
- [Estrutura Original do Banco](../../estrutura/db/database_structure_20260201_214901.md)

### Código de Referência:
- Models atuais: `backend/app/models/cnpj.py`
- Config: `backend/app/core/config.py`
- Database: `backend/app/core/database.py`

### Ferramentas:
- Script de análise: `analyze_database.py`
- PostgreSQL: localhost:5432
- Database: basecerta
- Schema: cnpj

---

## 🎬 Próximos Passos (Sprint 03)

Após conclusão desta sprint:
1. Implementar cache Redis para queries frequentes
2. Criar endpoints de busca avançada (filtros compostos)
3. Implementar exportação de dados (CSV, Excel)
4. Dashboard analytics com dados CNPJ
5. Busca fuzzy e full-text search

---

**Criado em**: 01 de Fevereiro de 2026  
**Localização**: `docs/estrutura/sprints/S02-INTEGRACAO-CNPJ.md`  
**Status**: 🔴 To Do  

---

🎯 **BaseCerta - Conectando à maior base de dados empresariais do Brasil!**
