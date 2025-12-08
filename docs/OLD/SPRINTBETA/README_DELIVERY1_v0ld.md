# BaseCerta Backend

## 🚀 Status Atual

**DELIVERY 1 (Semanas 1-12):** Backend LIMPO - Frontend usa mockdata  
**DELIVERY 2 (Semanas 12-20):** Reconstruir backend do ZERO

---

## 📋 O que foi mantido:

✅ **Estrutura básica:**
- `app/main.py` - FastAPI básico (apenas health check)
- `app/core/` - Config, database, security
- `app/models/base.py` - SQLAlchemy Base
- `app/utils/` - Logger e utilitários

✅ **Infraestrutura:**
- Docker
- PostgreSQL
- Redis
- Alembic (sem migrations)

---

## ❌ O que foi REMOVIDO (reconstruir no Delivery 2):

- ❌ Models (user, credit, pessoa_juridica)
- ❌ Schemas (todos)
- ❌ Endpoints (users, plans, credits, research_pj)
- ❌ CRUDs (todos)
- ❌ Services (predictus_service)
- ❌ Migrations (todas)
- ❌ Testes (todos)

---

## 🎯 Roadmap:

### Delivery 1 (ATUAL)
- Frontend completo com mockdata
- Backend apenas com health check
- Sem autenticação (user_id=1 fixo no frontend)

### Delivery 2 (PRÓXIMO)
1. Smart CNPJ Backend (PostgreSQL local)
2. Dados 360° PJ (Predictus API)
3. Dados 360° PF (DirectData API)
4. Radar Jurídico (Predictus API)
5. Sistema de Créditos
6. Gateway de Pagamentos

### Delivery 3
- Autenticação RBAC
- Multi-tenancy

### Delivery 4
- Hardening produção
- Monitoring
- Backup

---

## 🏃 Como rodar (Delivery 1):

```bash
# Iniciar apenas o essencial
docker-compose up -d backend redis

# Ver logs
docker-compose logs -f backend

# Health check
curl http://localhost:8000/health
```

**Endpoints disponíveis:**
- `GET /` - Info da API
- `GET /health` - Health check
- `GET /docs` - Swagger UI

---

## 📝 Notas:

- **NÃO** há endpoints funcionais no Delivery 1
- Frontend usa mockdata em `frontend/src/mocks/`
- Backend será reconstruído do ZERO no Delivery 2
- Seguiremos arquitetura limpa e moderna

---

**Última Atualização:** 22/10/2025  
**Versão:** 1.0.0 (Delivery 1)
