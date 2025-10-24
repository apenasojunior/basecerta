# 📚 Índice de Documentação - Sprint 2.1

**Smart CNPJ 360° Backend - Documentação Completa**

---

## 🎯 Planejamento e Execução

### **Documento Principal**
📘 **[SPRINT_2.1_SMART_CNPJ_BACKEND.md](SPRINT_2.1_SMART_CNPJ_BACKEND.md)**
- Visão geral da sprint
- 9 Issues detalhadas (2.1.0 a 2.1.8)
- Mapeamento Frontend ↔ Backend
- Cronograma e responsáveis
- Status de cada issue

---

## 🧪 Testes

### **Guias de Teste**

📗 **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - **PRINCIPAL**
- Guia completo passo a passo
- Como executar cada tipo de teste
- Detalhamento dos 35 testes
- Troubleshooting completo
- Manutenção e atualização

📙 **[TESTING_QUICK_REFERENCE.md](TESTING_QUICK_REFERENCE.md)** - **REFERÊNCIA RÁPIDA**
- Comandos essenciais
- Copy-paste ready
- Checklist pré-commit

📕 **[backend/tests/README.md](../backend/tests/README.md)** - **README DOS TESTES**
- Status atual dos testes
- Estrutura de arquivos
- Quick start

### **Scripts de Teste**

🔧 **[scripts/run-tests.sh](../scripts/run-tests.sh)** - **SCRIPT HELPER**
```bash
./scripts/run-tests.sh help        # Ver opções
./scripts/run-tests.sh summary     # Resumo
./scripts/run-tests.sh all         # Executar todos
./scripts/run-tests.sh coverage    # Cobertura
```

---

## 📖 API

📘 **[SMART_CNPJ_API_GUIDE.md](SMART_CNPJ_API_GUIDE.md)** - **GUIA DE USO DA API**
- Todos os 5 endpoints documentados
- Exemplos em curl, Python, JavaScript
- Códigos de erro
- Casos de uso reais
- Limites e quotas

**Swagger UI:** http://localhost:8000/docs

---

## 🗂️ Organização da Documentação

```
docs/
├── INDEX.md                              # Este arquivo
├── SPRINT_2.1_SMART_CNPJ_BACKEND.md     # 📘 Sprint principal
├── TESTING_GUIDE.md                      # 📗 Guia completo de testes
├── TESTING_QUICK_REFERENCE.md           # 📙 Referência rápida
├── SMART_CNPJ_API_GUIDE.md              # 📖 Guia da API
└── frontend/                             # Docs do frontend
    ├── README.md
    └── ...

backend/tests/
└── README.md                             # 📕 README dos testes

scripts/
└── run-tests.sh                          # 🔧 Script helper
```

---

## 🚀 Quick Start

### **1. Executar API**
```bash
docker-compose up -d
```
**Acesso:** http://localhost:8000/docs

### **2. Executar Testes**
```bash
# Instalar dependências
docker exec basecerta_backend pip install pytest pytest-cov httpx

# Executar testes
./scripts/run-tests.sh summary
```

### **3. Consultar API**
```bash
# Exemplo de consulta
curl http://localhost:8000/api/v1/smart-cnpj/33345748000185
```

---

## 📊 Status do Projeto

### **Sprint 2.1 - Smart CNPJ Backend**

| Issue | Descrição | Status |
|-------|-----------|--------|
| 2.1.0 | Análise e Mapeamento | ✅ COMPLETO |
| 2.1.1 | Models SQLAlchemy | ✅ COMPLETO |
| 2.1.2 | Schemas Pydantic | ✅ COMPLETO |
| 2.1.3 | CRUD Operations | ✅ COMPLETO |
| 2.1.4 | Service Layer | ✅ COMPLETO |
| 2.1.5 | API Endpoints | ✅ COMPLETO |
| 2.1.6 | Cache Redis | ✅ COMPLETO |
| 2.1.7 | Export CSV/JSON | ✅ COMPLETO |
| 2.1.8 | Testes e Documentação | ✅ COMPLETO |

**Progresso:** 9/9 issues (100%)

### **Testes**
- **Total:** 35 testes
- **Status:** 100% passando
- **Cobertura:** ~75%
- **Tempo:** ~36 segundos

---

## 📞 Links Úteis

### **Desenvolvimento**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Frontend: http://localhost:3000

### **Repositório**
- Branch: `beta004`
- Owner: apenasojunior
- Repo: basecerta

### **Documentação Externa**
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Pytest Docs](https://docs.pytest.org/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)

---

## 🎯 Navegação Rápida

| Quero... | Vá para... |
|----------|-----------|
| Ver visão geral da sprint | [SPRINT_2.1_SMART_CNPJ_BACKEND.md](SPRINT_2.1_SMART_CNPJ_BACKEND.md) |
| Executar testes | [TESTING_QUICK_REFERENCE.md](TESTING_QUICK_REFERENCE.md) |
| Entender estrutura de testes | [TESTING_GUIDE.md](TESTING_GUIDE.md) |
| Usar a API | [SMART_CNPJ_API_GUIDE.md](SMART_CNPJ_API_GUIDE.md) |
| Ver código dos testes | [backend/tests/](../backend/tests/) |
| Executar script de testes | `./scripts/run-tests.sh help` |

---

**Última atualização:** 24/10/2025  
**Versão:** 1.0  
**Mantido por:** Equipe BaseCerta
