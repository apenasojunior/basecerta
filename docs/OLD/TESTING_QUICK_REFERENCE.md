# 🚀 Quick Reference - Testes Smart CNPJ

**Comandos Essenciais para Execução de Testes**

---

## ⚡ Comandos Rápidos

### **Executar TODOS os Testes**
```bash
docker exec basecerta_backend pytest tests/ -v
```
**Resultado esperado:** `35 passed in ~36s`

---

### **Executar por Categoria**

**Models (5 testes - 34s):**
```bash
docker exec basecerta_backend pytest tests/test_models.py -v
```

**Unitários (15 testes - 0.4s):**
```bash
docker exec basecerta_backend pytest tests/unit/test_smart_cnpj_service_simple.py -v
```

**Integração (15 testes - 0.8s):**
```bash
docker exec basecerta_backend pytest tests/integration/test_smart_cnpj_endpoints.py -v
```

---

## 📊 Resumo Visual

```bash
docker exec basecerta_backend bash -c "
echo '=== RESUMO DE TESTES ===' && 
echo '' && 
echo '✅ Models:' && 
pytest tests/test_models.py --tb=no -q 2>&1 | tail -1 && 
echo '' && 
echo '✅ Unitários:' && 
pytest tests/unit/test_smart_cnpj_service_simple.py --tb=no -q 2>&1 | tail -1 && 
echo '' && 
echo '✅ Integração:' && 
pytest tests/integration/test_smart_cnpj_endpoints.py --tb=no -q 2>&1 | tail -1
"
```

**Output esperado:**
```
=== RESUMO DE TESTES ===

✅ Models:
5 passed, 2 warnings in 34.45s

✅ Unitários:
15 passed, 25 warnings in 0.44s

✅ Integração:
15 passed, 31 warnings in 0.85s
```

---

## 🔍 Testes Específicos

**Por classe:**
```bash
docker exec basecerta_backend pytest tests/unit/test_smart_cnpj_service_simple.py::TestMetodosAuxiliares -v
```

**Por método:**
```bash
docker exec basecerta_backend pytest tests/unit/test_smart_cnpj_service_simple.py::TestMetodosAuxiliares::test_limpar_cnpj_com_formatacao -v
```

---

## 📈 Cobertura de Código

```bash
# Relatório no terminal
docker exec basecerta_backend pytest tests/ --cov=app --cov-report=term

# Com linhas não cobertas
docker exec basecerta_backend pytest tests/ --cov=app --cov-report=term-missing

# Gerar HTML
docker exec basecerta_backend pytest tests/ --cov=app --cov-report=html
```

---

## 🛠️ Opções Úteis

**Parar no primeiro erro:**
```bash
docker exec basecerta_backend pytest tests/ -x
```

**Mostrar prints:**
```bash
docker exec basecerta_backend pytest tests/ -s
```

**Executar apenas últimos falhados:**
```bash
docker exec basecerta_backend pytest tests/ --lf
```

**Modo quiet (resumo):**
```bash
docker exec basecerta_backend pytest tests/ -q
```

**Sem traceback:**
```bash
docker exec basecerta_backend pytest tests/ --tb=no
```

---

## 🐛 Troubleshooting

**Instalar pytest:**
```bash
docker exec basecerta_backend pip install pytest pytest-cov httpx
```

**Verificar instalação:**
```bash
docker exec basecerta_backend pytest --version
```

**Reiniciar containers:**
```bash
docker-compose restart
```

**Ver logs:**
```bash
docker logs basecerta_backend --tail 50
```

---

## 📋 Checklist Pré-Commit

```bash
# 1. Executar testes
docker exec basecerta_backend pytest tests/ -v

# 2. Verificar cobertura
docker exec basecerta_backend pytest tests/ --cov=app --cov-report=term

# 3. Verificar se há warnings críticos
docker exec basecerta_backend pytest tests/ --strict-warnings
```

---

## 📁 Estrutura

```
tests/
├── test_models.py                          # 5 testes
├── unit/
│   └── test_smart_cnpj_service_simple.py  # 15 testes
└── integration/
    └── test_smart_cnpj_endpoints.py       # 15 testes
```

---

## 🎯 Metas de Cobertura

| Módulo | Alvo |
|--------|------|
| Services | 75% |
| Endpoints | 70% |
| Schemas | 85% |
| Models | 95% |

---

**Doc completa:** `/docs/TESTING_GUIDE.md`  
**Última atualização:** 24/10/2025
