# 🧪 Testes - Smart CNPJ Backend

Documentação dos testes automatizados do produto Smart CNPJ 360°.

---

## 📊 Status Atual

![Tests](https://img.shields.io/badge/tests-35%20passed-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-75%25-green)
![Time](https://img.shields.io/badge/execution-36s-blue)

**Última atualização:** 24/10/2025  
**Issue:** 2.1.8 - Testes e Documentação

---

## 📁 Estrutura

```
tests/
├── README.md                                    # Este arquivo
├── __init__.py
├── test_models.py                               # 5 testes - Models SQLAlchemy
├── unit/
│   ├── __init__.py
│   ├── test_smart_cnpj_service_simple.py       # 15 testes - Service Layer ✅
│   └── test_smart_cnpj_service.py              # 19 testes - Referência
└── integration/
    ├── __init__.py
    └── test_smart_cnpj_endpoints.py            # 15 testes - API REST ✅
```

---

## 🚀 Quick Start

### 1️⃣ Instalar Dependências

```bash
docker exec basecerta_backend pip install pytest pytest-cov httpx
```

### 2️⃣ Executar Todos os Testes

```bash
docker exec basecerta_backend pytest tests/ -v
```

**Resultado esperado:**
```
35 passed, 32 warnings in 35.74s
```

---

## 📋 Categorias de Testes

### **Models (5 testes)**
Testa estrutura SQLAlchemy e queries no banco.

```bash
docker exec basecerta_backend pytest tests/test_models.py -v
```

**Tempo:** ~34 segundos  
**O que testa:** Conexão DB, queries, formatadores

---

### **Unitários (15 testes)**
Testa lógica de negócio do Service Layer.

```bash
docker exec basecerta_backend pytest tests/unit/test_smart_cnpj_service_simple.py -v
```

**Tempo:** ~0.4 segundos  
**O que testa:** Validações, formatações, schemas

---

### **Integração (15 testes)**
Testa endpoints REST da API.

```bash
docker exec basecerta_backend pytest tests/integration/test_smart_cnpj_endpoints.py -v
```

**Tempo:** ~0.8 segundos  
**O que testa:** GET /{cnpj}, POST /export, validações HTTP

---

## 📊 Cobertura de Código

```bash
docker exec basecerta_backend pytest tests/ --cov=app --cov-report=term
```

**Metas de cobertura:**
- Services: 75%+
- Endpoints: 70%+
- Schemas: 85%+
- Models: 95%+

---

## 📚 Documentação Completa

- **[TESTING_GUIDE.md](/docs/TESTING_GUIDE.md)** - Guia completo de testes
- **[TESTING_QUICK_REFERENCE.md](/docs/TESTING_QUICK_REFERENCE.md)** - Referência rápida

---

## 🔧 Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `pytest tests/ -v` | Executar todos os testes |
| `pytest tests/ -q` | Resumo de testes |
| `pytest tests/ -x` | Parar no primeiro erro |
| `pytest tests/ -s` | Mostrar prints |
| `pytest tests/ --lf` | Executar últimos falhados |
| `pytest tests/ --cov=app` | Relatório de cobertura |

---

## 🐛 Troubleshooting

**Erro "No module named pytest":**
```bash
docker exec basecerta_backend pip install pytest pytest-cov httpx
```

**Containers não rodando:**
```bash
docker-compose up -d
docker ps
```

**Ver logs:**
```bash
docker logs basecerta_backend --tail 50
```

---

## ✅ Checklist Pré-Commit

- [ ] Todos os 35 testes passando
- [ ] Cobertura mínima: 70%
- [ ] Sem warnings críticos
- [ ] Documentação atualizada

---

## 📞 Suporte

- **Issue:** Sprint 2.1 - Issue 2.1.8
- **Docs:** `/docs/TESTING_GUIDE.md`
- **Mantido por:** Equipe BaseCerta
