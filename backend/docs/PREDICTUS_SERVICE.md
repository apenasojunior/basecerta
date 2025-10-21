# Serviço Predictus API - Integração PJ

## Visão Geral

O módulo `predictus_service.py` fornece integração completa com a API Predictus para consulta de dossiês de Pessoa Jurídica (PJ).

## Componentes Principais

### 1. PredictusAPIClient

Cliente HTTP assíncrono para comunicação com a API Predictus.

**Características:**
- ✅ Cache Redis com TTL de 7 dias
- ✅ Retry automático com backoff exponencial (3 tentativas)
- ✅ Timeout configurável (padrão 30s)
- ✅ Tratamento de rate limit (429)
- ✅ Validação de CNPJ
- ✅ Logs estruturados

**Exemplo de uso:**

```python
from app.services.predictus_service import PredictusAPIClient

# Inicializar cliente
client = PredictusAPIClient()

# Consultar dossiê (com cache automático)
try:
    data = await client.get_dossie_pj("12.345.678/0001-90")
    print(data["razao_social"])
except PredictusAPIError as e:
    print(f"Erro: {e}")
```

### 2. parse_predictus_pj_response()

Parser que converte JSON da API em models SQLAlchemy com relacionamentos.

**Fluxo:**
1. Verifica se empresa já existe no banco (por CNPJ)
2. Cria ou atualiza registro principal (`PessoaJuridica`)
3. Remove e recria relacionamentos:
   - CNAEs (principal e secundários)
   - Endereços (com coordenadas GPS)
   - Sócios (ativos e histórico)
   - Redes sociais
   - Histórico de dívidas
4. Commit no banco de dados

**Exemplo de uso:**

```python
from app.services.predictus_service import parse_predictus_pj_response
from app.database import get_db

db = next(get_db())

# data = resultado da API Predictus
empresa = parse_predictus_pj_response(data, db)

print(f"Empresa: {empresa.razao_social}")
print(f"CNAEs: {len(empresa.cnaes)}")
print(f"Sócios: {len(empresa.socios)}")
print(f"Score de risco: {empresa.historico_dividas.score_risco}")
```

## Fluxo Completo de Consulta

```python
from app.services.predictus_service import PredictusAPIClient, parse_predictus_pj_response
from app.database import get_db

async def consultar_empresa(cnpj: str):
    # 1. Inicializar cliente
    client = PredictusAPIClient()
    
    # 2. Buscar dados (cache ou API)
    data = await client.get_dossie_pj(cnpj)
    
    # 3. Parse e salvar no banco
    db = next(get_db())
    empresa = parse_predictus_pj_response(data, db)
    
    return empresa
```

### Cache Redis

**Padrão de chave:** `predictus:pj:{cnpj_limpo}`

**Exemplo:**
- CNPJ: `12.345.678/0001-90`
- Chave: `predictus:pj:12345678000190`
- TTL: 7 dias (604800 segundos)

**Comportamento:**
1. **Cache Hit:** Retorna dados do Redis (sem chamar API)
2. **Cache Miss:** Chama API → salva no Redis → retorna dados

### Tratamento de Erros

| Código | Erro | Ação |
|--------|------|------|
| 200 | Sucesso | Salva no cache e retorna dados |
| 401 | API Key inválida | Lança `PredictusAPIError` |
| 404 | CNPJ não encontrado | Lança `PredictusAPIError` |
| 429 | Rate limit | Aguarda 2^n segundos e retry |
| 500+ | Erro servidor | Retry com backoff exponencial |
| Timeout | Timeout rede | Retry com backoff exponencial |

### Retry Logic

**Estratégia:** Backoff exponencial

```
Tentativa 1: Imediato
Tentativa 2: Aguarda 2s (2^1)
Tentativa 3: Aguarda 4s (2^2)
```

Após 3 tentativas, lança `PredictusAPIError` com último erro.

## Variáveis de Ambiente

Configure no arquivo `.env`:

```bash
# API Predictus
PREDICTUS_API_URL=https://api.predictus.com.br/v1
PREDICTUS_API_KEY=your_predictus_api_key_here
```

## Models SQLAlchemy

### Relacionamentos Criados

```
PessoaJuridica (1)
├── cnaes (N) → CNAEEmpresa
├── enderecos (N) → EnderecoEmpresa
├── socios (N) → SocioEmpresa
├── redes_sociais (1) → RedesSociaisEmpresa
└── historico_dividas (1) → HistoricoDividasEmpresa
```

### Estrutura de Dados

**PessoaJuridica:**
- CNPJ (único, indexed)
- Razão Social, Nome Fantasia
- Situação Cadastral, Data Abertura
- Porte, Capital Social, Natureza Jurídica
- Flags: MEI, Simples Nacional
- Soft delete, Timestamps

**CNAEEmpresa:**
- Código, Descrição
- Flag `is_principal` (principal vs secundário)

**EnderecoEmpresa:**
- Endereço completo
- Telefones (JSONB array)
- Email
- Latitude/Longitude (para mapas)

**SocioEmpresa:**
- Nome, CPF/CNPJ
- Qualificação, Percentual Participação
- Datas entrada/saída
- Flag `is_ativo`

**RedesSociaisEmpresa:**
- Website, Facebook, Instagram, LinkedIn, Twitter, YouTube, TikTok
- Google Maps URL
- Marketplaces (JSONB)

**HistoricoDividasEmpresa:**
- Total protestos, valor total
- Total ações judiciais
- Flags: recuperação judicial, falência
- Score de risco (0-1000)
- Classificação: BAIXO, MÉDIO, ALTO, CRÍTICO
- Restrições CADIN (JSONB)

## Conversões de Dados

### Datas
```python
# JSON → SQLAlchemy
"2020-01-15" → datetime.date(2020, 1, 15)
```

### Valores Monetários
```python
# JSON → SQLAlchemy
100000.00 → Decimal("100000.00")
```

### CNPJ
```python
# Remove formatação
"12.345.678/0001-90" → "12345678000190"
```

## Testes

Execute os testes com pytest:

```bash
# Todos os testes do serviço
pytest tests/test_predictus_service.py -v

# Teste específico
pytest tests/test_predictus_service.py::TestPredictusAPIClient::test_cache_key_generation -v

# Com cobertura
pytest tests/test_predictus_service.py --cov=app.services.predictus_service
```

## Logs

O serviço gera logs estruturados:

```
INFO: Chamando Predictus API para CNPJ 12345678000190 (tentativa 1)
INFO: Cache hit para CNPJ 12345678000190
INFO: Dados salvos no cache para CNPJ 12345678000190
INFO: Empresa 12345678000190 salva com sucesso (ID: 123)
ERROR: Timeout na tentativa 1: Connection timeout
WARNING: Rate limit atingido. Aguardando 2s...
```

## Próximos Passos

1. ✅ **Issue 5.2:** Serviço Predictus completo
2. ⏭️ **Issue 5.3:** Endpoints FastAPI (`POST /api/research/pj`, `GET /api/research/pj/{id}`)
3. ⏭️ **Issue 5.4:** CRUD de relacionamentos sócios ↔ empresas
4. ⏭️ **Issues 5.5-5.10:** Frontend (páginas e componentes)

## Referências

- [Documentação FastAPI](https://fastapi.tiangolo.com/)
- [httpx - Cliente HTTP assíncrono](https://www.python-httpx.org/)
- [Redis Python](https://redis-py.readthedocs.io/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
