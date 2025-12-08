# 📘 Smart CNPJ 360° - Guia de Uso da API

**Versão:** 1.0.0  
**Issue:** 2.1.8 - Testes e Documentação  
**Data:** 2025-01-XX  
**Status:** ✅ Production Ready

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Endpoints](#endpoints)
   - [GET /{cnpj}](#1-get-cnpj---consulta-individual)
   - [POST /search](#2-post-search---busca-avançada)
   - [POST /export](#3-post-export---exportação-csvjson)
   - [GET /historico](#4-get-historico---histórico-de-pesquisas)
   - [GET /estatisticas](#5-get-estatisticas---estatísticas-de-uso)
4. [Códigos de Erro](#códigos-de-erro)
5. [Limites e Quotas](#limites-e-quotas)
6. [Exemplos de Uso](#exemplos-de-uso)

---

## 🎯 Visão Geral

A API Smart CNPJ 360° permite consultar dados cadastrais de empresas brasileiras a partir da base de dados pública da Receita Federal (100M+ CNPJs).

### Base URL

```
http://localhost:8000/api/v1/smart-cnpj
```

**Produção:** `https://api.basecerta.com.br/api/v1/smart-cnpj`

### Documentação Interativa

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Tecnologias

- **Backend:** FastAPI 0.104.1 + Python 3.13
- **Database:** PostgreSQL 14 (100M+ registros)
- **Cache:** Redis 7 (24h TTL)
- **Performance:** < 100ms com cache

---

## 🔐 Autenticação

### Delivery 2.1 (Atual)

**Status:** ❌ Sem autenticação  
Todos os endpoints são públicos para desenvolvimento.

### Delivery 3 (Futuro)

**Status:** 🔜 OAuth2 + JWT  
Header obrigatório:

```http
Authorization: Bearer {token}
```

---

## 🚀 Endpoints

### 1. GET /{cnpj} - Consulta Individual

**Descrição:** Retorna dados completos de uma empresa por CNPJ.

#### Request

```bash
GET /api/v1/smart-cnpj/{cnpj}
```

**Path Parameters:**

| Parâmetro | Tipo   | Obrigatório | Descrição                             |
|-----------|--------|-------------|---------------------------------------|
| `cnpj`    | string | Sim         | CNPJ com ou sem formatação (14 dígitos) |

**Exemplos de CNPJ válidos:**
- `33345748000185`
- `33.345.748/0001-85`

#### Response 200 OK

```json
{
  "cnpj": "33.345.748/0001-85",
  "razaoSocial": "SHOPTUDOAQUI LTDA",
  "nomeFantasia": "SHOP TUDO AQUI",
  "situacaoCadastral": "Ativa",
  "codigoSituacaoCadastral": 2,
  "dataSituacaoCadastral": "2018-01-15",
  "dataInicioAtividade": "2018-01-15",
  "dataAbertura": "2018-01-10",
  "porte": "Microempresa",
  "codigoPorte": 1,
  "naturezaJuridica": "Sociedade Empresária Limitada",
  "codigoNaturezaJuridica": 2062,
  "capitalSocial": 50000.00,
  "endereco": {
    "logradouro": "RUA EXEMPLO",
    "numero": "123",
    "complemento": "SALA 1",
    "bairro": "CENTRO",
    "cep": "01234-567",
    "municipio": "São Paulo",
    "uf": "SP"
  },
  "contatos": {
    "telefone": "(11) 3456-7890",
    "email": "contato@exemplo.com.br"
  },
  "cnaePrincipal": {
    "codigo": "4751-2/01",
    "descricao": "Comércio varejista especializado de equipamentos e suprimentos de informática"
  },
  "cnaesSecundarios": [
    {
      "codigo": "6201-5/00",
      "descricao": "Desenvolvimento de programas de computador sob encomenda"
    }
  ],
  "socios": [
    {
      "nome": "JOAO DA SILVA",
      "documento": "123.456.789-00",
      "qualificacao": "Sócio-Administrador",
      "codigoQualificacao": 49,
      "percentualCapitalSocial": 100.00,
      "dataEntrada": "2018-01-01",
      "faixaEtaria": "Entre 31 a 40 anos"
    }
  ]
}
```

#### Exemplos de Uso

**curl:**
```bash
curl -X GET "http://localhost:8000/api/v1/smart-cnpj/33345748000185"
```

**Python (requests):**
```python
import requests

response = requests.get("http://localhost:8000/api/v1/smart-cnpj/33345748000185")
empresa = response.json()
print(empresa["razaoSocial"])
```

**JavaScript (fetch):**
```javascript
fetch('http://localhost:8000/api/v1/smart-cnpj/33345748000185')
  .then(response => response.json())
  .then(data => console.log(data.razaoSocial));
```

---

### 2. POST /search - Busca Avançada

**Descrição:** Busca empresas com filtros opcionais e paginação.

#### Request

```bash
POST /api/v1/smart-cnpj/search
```

**Body (application/json):**

```json
{
  "tipo_busca": "razao_social",
  "valor_busca": "TECNOLOGIA",
  "filtros": {
    "uf": "SP",
    "situacaoCadastral": 2,
    "porte": 1
  },
  "page": 1,
  "page_size": 20
}
```

**Campos do Body:**

| Campo         | Tipo   | Obrigatório | Descrição                                      |
|---------------|--------|-------------|------------------------------------------------|
| `tipo_busca`  | string | Sim         | Tipo: `cnpj`, `razao_social`, `nome_fantasia`, `cnae`, `municipio`, `uf`, `cep` |
| `valor_busca` | string | Sim         | Valor a ser buscado                            |
| `filtros`     | object | Não         | Filtros opcionais (veja tabela abaixo)         |
| `page`        | int    | Não         | Página atual (padrão: 1)                       |
| `page_size`   | int    | Não         | Itens por página (padrão: 20, máx: 100)        |

**Filtros Disponíveis:**

| Filtro                 | Tipo   | Exemplo      | Descrição                           |
|------------------------|--------|--------------|-------------------------------------|
| `situacaoCadastral`    | int    | `2`          | 2=Ativa, 3=Suspensa, 4=Inapta, etc. |
| `porte`                | int    | `1`          | 1=ME, 2=EPP, 3=MEI, etc.            |
| `naturezaJuridica`     | int    | `2062`       | Código da natureza jurídica         |
| `cnae`                 | string | `6201-5/00`  | CNAE principal ou secundário        |
| `uf`                   | string | `SP`         | Unidade Federativa (2 letras)       |
| `municipio`            | string | `SAO PAULO`  | Nome do município (uppercase)       |
| `dataAberturaInicio`   | string | `2020-01-01` | Data de abertura inicial (ISO)      |
| `dataAberturaFim`      | string | `2023-12-31` | Data de abertura final (ISO)        |

#### Response 200 OK

```json
{
  "empresas": [
    {
      "cnpj": "12.345.678/0001-90",
      "razaoSocial": "EMPRESA TECNOLOGIA LTDA",
      "nomeFantasia": "TECH COMPANY",
      "situacaoCadastral": "Ativa",
      "endereco": {
        "municipio": "São Paulo",
        "uf": "SP"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8
  },
  "tempoRespostaMs": 250
}
```

#### Exemplos de Uso

**Busca por Razão Social:**
```bash
curl -X POST "http://localhost:8000/api/v1/smart-cnpj/search" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_busca": "razao_social",
    "valor_busca": "TECNOLOGIA"
  }'
```

**Busca com Filtros:**
```bash
curl -X POST "http://localhost:8000/api/v1/smart-cnpj/search" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_busca": "municipio",
    "valor_busca": "SAO PAULO",
    "filtros": {
      "uf": "SP",
      "situacaoCadastral": 2,
      "porte": 1
    },
    "page": 1,
    "page_size": 50
  }'
```

**Python:**
```python
import requests

payload = {
    "tipo_busca": "cnae",
    "valor_busca": "6201-5/00",
    "filtros": {"uf": "SP"},
    "page": 1,
    "page_size": 20
}

response = requests.post(
    "http://localhost:8000/api/v1/smart-cnpj/search",
    json=payload
)

results = response.json()
print(f"Total: {results['pagination']['total']}")
for empresa in results['empresas']:
    print(empresa['razaoSocial'])
```

---

### 3. POST /export - Exportação CSV/JSON

**Descrição:** Exporta dados de múltiplas empresas em CSV ou JSON.

#### Request

```bash
POST /api/v1/smart-cnpj/export?cnpjs={cnpj1}&cnpjs={cnpj2}&formato={csv|json}
```

**Query Parameters:**

| Parâmetro | Tipo   | Obrigatório | Descrição                        |
|-----------|--------|-------------|----------------------------------|
| `cnpjs`   | array  | Sim         | Lista de CNPJs (max 100)         |
| `formato` | string | Não         | `csv` ou `json` (padrão: `csv`)  |

#### Response 200 OK (CSV)

**Headers:**
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="empresas.csv"
```

**Body:**
```csv
CNPJ;Razão Social;Nome Fantasia;Situação;UF;Município;Telefone
33.345.748/0001-85;SHOPTUDOAQUI LTDA;SHOP TUDO AQUI;Ativa;SP;SÃO PAULO;(11) 3456-7890
```

#### Response 200 OK (JSON)

**Headers:**
```
Content-Type: application/json
Content-Disposition: attachment; filename="empresas.json"
```

**Body:**
```json
{
  "total": 2,
  "empresas": [
    {
      "cnpj": "33.345.748/0001-85",
      "razaoSocial": "SHOPTUDOAQUI LTDA",
      "nomeFantasia": "SHOP TUDO AQUI"
    }
  ]
}
```

#### Exemplos de Uso

**Exportar 1 CNPJ (CSV):**
```bash
curl -X POST "http://localhost:8000/api/v1/smart-cnpj/export?cnpjs=33345748000185&formato=csv" \
  --output empresas.csv
```

**Exportar múltiplos (JSON):**
```bash
curl -X POST "http://localhost:8000/api/v1/smart-cnpj/export?cnpjs=33345748000185&cnpjs=12345678000190&formato=json" \
  --output empresas.json
```

**Python:**
```python
import requests

params = {
    "cnpjs": ["33345748000185", "12345678000190"],
    "formato": "json"
}

response = requests.post(
    "http://localhost:8000/api/v1/smart-cnpj/export",
    params=params
)

with open("empresas.json", "wb") as f:
    f.write(response.content)
```

---

### 4. GET /historico - Histórico de Pesquisas

**Descrição:** Retorna histórico de pesquisas do usuário.

#### Request

```bash
GET /api/v1/smart-cnpj/historico?page={page}&page_size={size}
```

**Query Parameters:**

| Parâmetro   | Tipo | Obrigatório | Descrição                    |
|-------------|------|-------------|------------------------------|
| `page`      | int  | Não         | Página (padrão: 1)           |
| `page_size` | int  | Não         | Itens por página (padrão: 20) |

#### Response 200 OK

```json
[
  {
    "id": 1,
    "tipo_busca": "RAZAO_SOCIAL",
    "valor_busca": "TECNOLOGIA",
    "filtros_aplicados": {"uf": "SP"},
    "resultados_encontrados": 150,
    "creditos_usados": 5,
    "tempo_resposta_ms": 250,
    "created_at": "2025-01-15T10:30:00"
  }
]
```

#### Exemplo

```bash
curl -X GET "http://localhost:8000/api/v1/smart-cnpj/historico?page=1&page_size=10"
```

---

### 5. GET /estatisticas - Estatísticas de Uso

**Descrição:** Retorna métricas agregadas de uso do produto.

#### Request

```bash
GET /api/v1/smart-cnpj/estatisticas
```

#### Response 200 OK

```json
{
  "totalSearches": 150,
  "totalCreditsUsed": 750,
  "totalResultsFound": 15000,
  "averageResponseTime": 250,
  "mostUsedSearchType": "RAZAO_SOCIAL",
  "searchesByType": {
    "RAZAO_SOCIAL": 80,
    "CNPJ": 40,
    "MUNICIPIO": 30
  }
}
```

#### Exemplo

```bash
curl -X GET "http://localhost:8000/api/v1/smart-cnpj/estatisticas"
```

---

## ⚠️ Códigos de Erro

| Código | Significado           | Solução                                |
|--------|-----------------------|----------------------------------------|
| `400`  | Requisição inválida   | Verifique formato do CNPJ ou filtros   |
| `404`  | Não encontrado        | CNPJ não existe na base                |
| `422`  | Validação falhou      | Verifique tipo_busca ou filtros        |
| `500`  | Erro interno          | Contate suporte técnico                |

**Exemplo de erro:**
```json
{
  "detail": "CNPJ inválido: formato incorreto"
}
```

---

## 📊 Limites e Quotas

### Delivery 2.1 (Atual)

| Recurso                  | Limite       |
|--------------------------|--------------|
| CNPJs por exportação     | 100          |
| Resultados por página    | 100 (max)    |
| Taxa de requisições      | Ilimitado    |
| Cache TTL                | 24 horas     |
| Timeout de requisição    | 30 segundos  |

### Delivery 3 (Futuro)

| Recurso                  | Limite       |
|--------------------------|--------------|
| Requisições/minuto       | 60           |
| Créditos/mês             | 10.000       |
| Créditos por consulta    | 5            |
| Créditos por busca       | 1-10 (variável) |

---

## 💡 Exemplos de Uso

### Caso 1: Dashboard de Empresas

**Objetivo:** Listar empresas de tecnologia em SP

```python
import requests

def get_tech_companies():
    payload = {
        "tipo_busca": "cnae",
        "valor_busca": "6201-5/00",  # Desenvolvimento de software
        "filtros": {
            "uf": "SP",
            "situacaoCadastral": 2  # Ativas
        },
        "page": 1,
        "page_size": 50
    }
    
    response = requests.post(
        "http://localhost:8000/api/v1/smart-cnpj/search",
        json=payload
    )
    
    return response.json()

companies = get_tech_companies()
print(f"Encontradas: {companies['pagination']['total']}")
```

### Caso 2: Exportação em Massa

**Objetivo:** Exportar lista de CNPJs para Excel

```bash
#!/bin/bash

# Exportar CSV
curl -X POST \
  "http://localhost:8000/api/v1/smart-cnpj/export?cnpjs=33345748000185&cnpjs=12345678000190&formato=csv" \
  --output empresas.csv

# Abrir no Excel (macOS)
open empresas.csv
```

### Caso 3: Validação de CNPJ

**Objetivo:** Verificar se CNPJ existe e está ativo

```javascript
async function validateCNPJ(cnpj) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/smart-cnpj/${cnpj}`
    );
    
    if (!response.ok) {
      return { valid: false, message: "CNPJ não encontrado" };
    }
    
    const data = await response.json();
    
    if (data.situacaoCadastral !== "Ativa") {
      return { valid: false, message: "Empresa não está ativa" };
    }
    
    return { valid: true, data };
  } catch (error) {
    return { valid: false, message: error.message };
  }
}

// Uso
const result = await validateCNPJ("33345748000185");
console.log(result);
```

---

## 🔗 Links Úteis

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Repositório:** https://github.com/seu-repo/basecerta
- **Issue Tracker:** Sprint 2.1 - SMART_CNPJ_BACKEND.md

---

## 📞 Suporte

- **Email:** suporte@basecerta.com.br
- **Slack:** #smart-cnpj
- **Documentação:** `/docs/SPRINT_2.1_SMART_CNPJ_BACKEND.md`

---

**Última atualização:** 2025-01-XX  
**Versão da API:** 1.0.0 (Delivery 2.1)
