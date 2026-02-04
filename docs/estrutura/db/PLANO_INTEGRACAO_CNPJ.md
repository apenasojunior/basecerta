# 🎯 Plano de Integração - Base CNPJ

**Data:** 2026-02-01  
**Autor:** GitHub Copilot (Deep Dive Analysis)  
**Objetivo:** Conectar aplicação BaseCerta à base CNPJ (322M+ registros)

---

## 📊 Análise Completa Realizada

✅ **Banco de Dados Analisado:**
- PostgreSQL 17.7 em localhost:5432
- Database: `basecerta`
- Schema: `cnpj`
- Total: 19 tabelas, 322M+ registros, ~60GB

✅ **Documentação Gerada:**
- Deep Dive: [deepdive_cnpj_20260201_222015.md](./deepdive_cnpj_20260201_222015.md)
- JSON: [deepdive_cnpj_20260201_222015.json](./deepdive_cnpj_20260201_222015.json)

---

## 🔍 Divergências Críticas Encontradas

### 1. ⚠️ **Tabela `socios` - SEM PRIMARY KEY**

**Banco Real:**
```sql
-- NÃO possui PRIMARY KEY definida
-- Possui UNIQUE INDEX: socios_unique_idx (cnpj_basico, identificador_socio)
```

**Model Atual (ERRADO):**
```python
class Socio(Base):
    id = Column(Integer, primary_key=True, autoincrement=True)  # ❌ NÃO EXISTE
```

**Correção Necessária:**
```python
class Socio(Base):
    # PK Composta (usando unique constraint como referência)
    cnpj_basico = Column(String(8), ForeignKey(...), primary_key=True)
    identificador_socio = Column(String(1), primary_key=True)
    cnpj_cpf_socio = Column(String(14))  # Parte do unique index
```

---

### 2. ⚠️ **Campo `ente_federativo` na tabela `empresas`**

**Banco Real:**
```sql
ente_federativo character varying(100) NULL
```

**Model Atual:**
```python
ente_federativo_responsavel = Column(String(100), ...)  # ❌ Nome diferente
```

**Correção:**
```python
ente_federativo = Column(String(100), comment="Ente federativo")
```

---

### 3. ⚠️ **Tamanhos de varchar() diferentes**

| Coluna | Model Atual | Banco Real | Status |
|--------|-------------|------------|--------|
| `empresas.natureza_juridica` | `String(10)` | `varchar(10)` | ✅ OK |
| `empresas.qualificacao_responsavel` | `String(5)` | `varchar(10)` | ❌ CORRIGIR |
| `socios.qualificacao_socio` | `String(5)` | `varchar(10)` | ❌ CORRIGIR |
| `socios.pais` | `String(5)` | `varchar(10)` | ❌ CORRIGIR |
| `socios.qualificacao_representante_legal` | `String(5)` | `varchar(10)` | ❌ CORRIGIR |

---

### 4. ⚠️ **Tabelas Auxiliares - SEM PRIMARY KEY**

**Banco Real:**
- `cnaes`: SEM PK definida (apenas `codigo varchar(10)`)
- `motivos_situacao_cadastral`: SEM PK
- `naturezas_juridicas`: SEM PK
- `paises`: SEM PK
- `qualificacoes_socios`: SEM PK
- `municipios`: SEM PK (mas tem index em descricao)

**Models Atuais:**
```python
class CNAE(Base):
    codigo = Column(String(10), primary_key=True)  # ❌ Banco não tem PK
```

**Decisão:**
- Manter `primary_key=True` nos models para uso do ORM
- Adicionar `extend_existing=True` para evitar erro

---

### 5. ⚠️ **Foreign Keys - Algumas não estão no banco**

**FKs Presentes no Banco:**
1. ✅ `estabelecimentos.cnpj_basico` → `empresas.cnpj_basico`
2. ✅ `socios.cnpj_basico` → `empresas.cnpj_basico`
3. ✅ `simples.cnpj_basico` → `empresas.cnpj_basico`
4. ✅ `control_audit.batch_id` → `control_batches.batch_id`
5. ✅ `control_checkpoints.batch_id` → `control_batches.batch_id`
6. ✅ `historico_*.batch_id` → `control_batches.batch_id`

**FKs NÃO presentes no banco (mas nos models):**
- ❌ `empresas.natureza_juridica` → `naturezas_juridicas.codigo`
- ❌ `empresas.qualificacao_responsavel` → `qualificacoes_socios.codigo`
- ❌ `estabelecimentos.cnae_fiscal_principal` → `cnaes.codigo`
- ❌ `estabelecimentos.municipio` → `municipios.codigo`
- ❌ `socios.qualificacao_socio` → `qualificacoes_socios.codigo`

**Motivo:** Tabelas de domínio podem conter valores não catalogados

**Decisão:**
- Remover `ForeignKey()` do SQLAlchemy
- Manter `relationship()` com `foreign_keys=[...]` para ORM

---

### 6. ✅ **Índices - Todos corretos**

**Principais índices encontrados:**
- ✅ `idx_empresas_razao_social` (text search)
- ✅ `idx_estabelecimentos_cnpj_basico` (FK)
- ✅ `idx_estabelecimentos_cnae_principal`
- ✅ `idx_socios_cnpj_basico` (FK)
- ✅ `idx_socios_cnpj_cpf_socio`
- ✅ `idx_simples_optante`

---

## 📝 Plano de Ação

### **FASE 1: Corrigir Models** 🔧

#### 1.1. Corrigir `backend/app/models/cnpj.py`

**Alterações:**

```python
# ===== EMPRESA =====
class Empresa(Base):
    # ... (manter existente)
    
    # CORRIGIR nome do campo
    ente_federativo = Column(String(100), comment="Ente federativo")  # era: ente_federativo_responsavel
    
    # CORRIGIR tamanho
    qualificacao_responsavel = Column(String(10), comment="...")  # era: String(5)

# ===== SOCIO =====
class Socio(Base):
    __tablename__ = 'socios'
    __table_args__ = (
        # Unique constraint que existe no banco
        UniqueConstraint('cnpj_basico', 'identificador_socio', name='socios_unique_idx'),
        {'schema': 'cnpj', 'extend_existing': True}
    )
    
    # REMOVER id autoincrement
    # id = Column(Integer, primary_key=True, autoincrement=True)  # ❌ DELETAR
    
    # PRIMARY KEY COMPOSTA (baseada no unique index)
    cnpj_basico = Column(String(8), ForeignKey('cnpj.empresas.cnpj_basico'), primary_key=True, index=True)
    identificador_socio = Column(String(1), primary_key=True, comment="1=PF, 2=PJ, 3=Estrangeiro")
    
    # CORRIGIR tamanhos
    qualificacao_socio = Column(String(10), comment="...")  # era: String(5)
    pais = Column(String(10), comment="...")  # era: String(5)
    qualificacao_representante_legal = Column(String(10))  # era: String(5)

# ===== TABELAS AUXILIARES =====
# REMOVER ForeignKey(), manter apenas relationship()

class Empresa(Base):
    natureza_juridica = Column(String(10))  # SEM ForeignKey
    qualificacao_responsavel = Column(String(10))  # SEM ForeignKey
    
    # Relationships SEM foreign_keys
    natureza = relationship("NaturezaJuridica", 
                           primaryjoin="Empresa.natureza_juridica==NaturezaJuridica.codigo",
                           foreign_keys="[Empresa.natureza_juridica]",
                           lazy="joined")

class Estabelecimento(Base):
    cnae_fiscal_principal = Column(String(10))  # SEM ForeignKey
    municipio = Column(String(10))  # SEM ForeignKey
    
    # Similar approach para relationships
```

---

### **FASE 2: Ajustar Configuração** ⚙️

#### 2.1. Arquivo `.env`

```env
# PostgreSQL - MANTER localhost (funciona)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=basecerta
DB_USER=aian_db
DB_PASSWORD=P@lm315@s
```

#### 2.2. Arquivo `backend/app/core/config.py`

**Já está correto** ✅

---

### **FASE 3: Criar CRUDs** 📂

#### 3.1. Criar `backend/app/crud/cnpj.py`

```python
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import Optional, List
from app.models.cnpj import Empresa, Estabelecimento, Socio, SimplesNacional

class CNPJRepository:
    """Repository para consultas na base CNPJ"""
    
    @staticmethod
    def get_empresa_by_cnpj_basico(db: Session, cnpj_basico: str) -> Optional[Empresa]:
        """Busca empresa por CNPJ básico (8 dígitos)"""
        return db.query(Empresa).filter(Empresa.cnpj_basico == cnpj_basico).first()
    
    @staticmethod
    def search_empresas_by_razao_social(
        db: Session, 
        termo: str, 
        limit: int = 50
    ) -> List[Empresa]:
        """Busca empresas por razão social (usa índice idx_empresas_razao_social)"""
        return (
            db.query(Empresa)
            .filter(Empresa.razao_social.ilike(f'%{termo}%'))
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def get_estabelecimento_by_cnpj_completo(
        db: Session, 
        cnpj_completo: str
    ) -> Optional[Estabelecimento]:
        """Busca estabelecimento por CNPJ completo (14 dígitos)"""
        cnpj_basico = cnpj_completo[:8]
        cnpj_ordem = cnpj_completo[8:12]
        cnpj_dv = cnpj_completo[12:14]
        
        return (
            db.query(Estabelecimento)
            .filter(
                Estabelecimento.cnpj_basico == cnpj_basico,
                Estabelecimento.cnpj_ordem == cnpj_ordem,
                Estabelecimento.cnpj_dv == cnpj_dv
            )
            .first()
        )
    
    @staticmethod
    def get_socios_by_empresa(db: Session, cnpj_basico: str) -> List[Socio]:
        """Lista sócios de uma empresa (usa índice idx_socios_cnpj_basico)"""
        return (
            db.query(Socio)
            .filter(Socio.cnpj_basico == cnpj_basico)
            .all()
        )
    
    @staticmethod
    def search_socios_by_nome(db: Session, nome: str, limit: int = 50) -> List[Socio]:
        """Busca sócios por nome (usa índice idx_socios_nome)"""
        return (
            db.query(Socio)
            .filter(Socio.nome_socio.ilike(f'%{nome}%'))
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def search_by_cnpj_cpf_socio(db: Session, documento: str) -> List[Socio]:
        """Busca empresas onde pessoa é sócia (usa idx_socios_cnpj_cpf_socio)"""
        return (
            db.query(Socio)
            .filter(Socio.cnpj_cpf_socio == documento)
            .all()
        )
    
    @staticmethod
    def get_simples_by_empresa(
        db: Session, 
        cnpj_basico: str
    ) -> Optional[SimplesNacional]:
        """Verifica se empresa é optante do Simples Nacional"""
        return (
            db.query(SimplesNacional)
            .filter(SimplesNacional.cnpj_basico == cnpj_basico)
            .first()
        )
```

---

### **FASE 4: Criar Schemas Pydantic** 📋

#### 4.1. Criar `backend/app/schemas/cnpj.py`

```python
from pydantic import BaseModel, Field, computed_field
from typing import Optional, List
from datetime import date

class EmpresaBase(BaseModel):
    cnpj_basico: str = Field(..., min_length=8, max_length=8)
    razao_social: Optional[str] = None
    natureza_juridica: Optional[str] = None
    capital_social: Optional[float] = None
    porte_empresa: Optional[str] = None
    
    class Config:
        from_attributes = True

class EmpresaDetalhada(EmpresaBase):
    """Empresa com dados relacionados"""
    natureza: Optional[dict] = None  # De natureza_juridica
    total_estabelecimentos: int = 0
    total_socios: int = 0
    is_simples: bool = False

class EstabelecimentoBase(BaseModel):
    cnpj_basico: str
    cnpj_ordem: str
    cnpj_dv: str
    nome_fantasia: Optional[str] = None
    situacao_cadastral: Optional[str] = None
    data_situacao_cadastral: Optional[date] = None
    
    @computed_field
    @property
    def cnpj_completo(self) -> str:
        return f"{self.cnpj_basico}{self.cnpj_ordem}{self.cnpj_dv}"
    
    @computed_field
    @property
    def cnpj_formatado(self) -> str:
        c = self.cnpj_completo
        return f"{c[:2]}.{c[2:5]}.{c[5:8]}/{c[8:12]}-{c[12:14]}"
    
    class Config:
        from_attributes = True

class SocioBase(BaseModel):
    cnpj_basico: str
    identificador_socio: str
    nome_socio: Optional[str] = None
    cnpj_cpf_socio: Optional[str] = None
    qualificacao_socio: Optional[str] = None
    data_entrada_sociedade: Optional[date] = None
    
    class Config:
        from_attributes = True

class SearchEmpresaRequest(BaseModel):
    """Request para busca de empresas"""
    razao_social: Optional[str] = None
    cnpj_basico: Optional[str] = None
    limit: int = Field(default=50, le=100)

class SearchEmpresaResponse(BaseModel):
    """Response para busca de empresas"""
    total: int
    empresas: List[EmpresaBase]
```

---

### **FASE 5: Criar Endpoints API** 🌐

#### 5.1. Criar `backend/app/api/v1/cnpj.py`

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db
from app.crud.cnpj import CNPJRepository
from app.schemas.cnpj import (
    EmpresaBase,
    EmpresaDetalhada,
    EstabelecimentoBase,
    SocioBase,
    SearchEmpresaRequest,
    SearchEmpresaResponse
)

router = APIRouter(prefix="/cnpj", tags=["CNPJ"])

@router.get("/empresa/{cnpj_basico}", response_model=EmpresaDetalhada)
def get_empresa(
    cnpj_basico: str,
    db: Session = Depends(get_db)
):
    """Busca empresa por CNPJ básico (8 dígitos)"""
    empresa = CNPJRepository.get_empresa_by_cnpj_basico(db, cnpj_basico)
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    
    # Enriquecer com dados relacionados
    estabelecimentos = db.query(Estabelecimento).filter(
        Estabelecimento.cnpj_basico == cnpj_basico
    ).count()
    
    socios = db.query(Socio).filter(Socio.cnpj_basico == cnpj_basico).count()
    
    simples = CNPJRepository.get_simples_by_empresa(db, cnpj_basico)
    
    return EmpresaDetalhada(
        **empresa.__dict__,
        total_estabelecimentos=estabelecimentos,
        total_socios=socios,
        is_simples=simples.is_simples if simples else False
    )

@router.get("/search/empresas", response_model=SearchEmpresaResponse)
def search_empresas(
    razao_social: str = Query(..., min_length=3),
    limit: int = Query(default=50, le=100),
    db: Session = Depends(get_db)
):
    """Busca empresas por razão social"""
    empresas = CNPJRepository.search_empresas_by_razao_social(db, razao_social, limit)
    return SearchEmpresaResponse(
        total=len(empresas),
        empresas=empresas
    )

@router.get("/estabelecimento/{cnpj_completo}", response_model=EstabelecimentoBase)
def get_estabelecimento(
    cnpj_completo: str,
    db: Session = Depends(get_db)
):
    """Busca estabelecimento por CNPJ completo (14 dígitos)"""
    # Remover formatação se vier
    cnpj = cnpj_completo.replace(".", "").replace("/", "").replace("-", "")
    
    if len(cnpj) != 14:
        raise HTTPException(status_code=400, detail="CNPJ deve ter 14 dígitos")
    
    estab = CNPJRepository.get_estabelecimento_by_cnpj_completo(db, cnpj)
    if not estab:
        raise HTTPException(status_code=404, detail="Estabelecimento não encontrado")
    
    return estab

@router.get("/socios/empresa/{cnpj_basico}", response_model=List[SocioBase])
def get_socios_empresa(
    cnpj_basico: str,
    db: Session = Depends(get_db)
):
    """Lista sócios de uma empresa"""
    return CNPJRepository.get_socios_by_empresa(db, cnpj_basico)

@router.get("/socios/search", response_model=List[SocioBase])
def search_socios(
    nome: Optional[str] = Query(None, min_length=3),
    cpf_cnpj: Optional[str] = Query(None),
    limit: int = Query(default=50, le=100),
    db: Session = Depends(get_db)
):
    """Busca sócios por nome ou CPF/CNPJ"""
    if nome:
        return CNPJRepository.search_socios_by_nome(db, nome, limit)
    elif cpf_cnpj:
        return CNPJRepository.search_by_cnpj_cpf_socio(db, cpf_cnpj)
    else:
        raise HTTPException(
            status_code=400, 
            detail="Informe 'nome' ou 'cpf_cnpj' para busca"
        )
```

#### 5.2. Registrar router em `backend/app/api/v1/__init__.py`

```python
from app.api.v1 import cnpj

# ... existing routers
api_router.include_router(cnpj.router, tags=["CNPJ"])
```

---

### **FASE 6: Testar** 🧪

#### 6.1. Script de Teste

```python
# tests/test_cnpj_integration.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_empresa():
    """Testa busca de empresa por CNPJ básico"""
    response = client.get("/api/v1/cnpj/empresa/00000000")
    assert response.status_code in [200, 404]

def test_search_empresas():
    """Testa busca por razão social"""
    response = client.get("/api/v1/cnpj/search/empresas?razao_social=PETROBRAS")
    assert response.status_code == 200
    data = response.json()
    assert "empresas" in data
    assert "total" in data
```

---

## 📅 Cronograma

| Fase | Descrição | Tempo Estimado |
|------|-----------|----------------|
| 1 | Corrigir Models | 1-2h |
| 2 | Ajustar Config | 15min |
| 3 | Criar CRUDs | 2-3h |
| 4 | Criar Schemas | 1-2h |
| 5 | Criar Endpoints | 2-3h |
| 6 | Testar | 1-2h |
| **TOTAL** | | **7-12h** |

---

## ✅ Checklist de Execução

- [ ] **FASE 1:** Models corrigidos
  - [ ] Tabela `socios` sem id autoincrement
  - [ ] Campo `ente_federativo` renomeado
  - [ ] Tamanhos de varchar ajustados
  - [ ] ForeignKeys removidas de tabelas auxiliares
  
- [ ] **FASE 2:** Configuração validada
  - [ ] `.env` com credenciais corretas
  - [ ] Conexão testada

- [ ] **FASE 3:** CRUDs implementados
  - [ ] `crud/cnpj.py` criado
  - [ ] Métodos de busca testados

- [ ] **FASE 4:** Schemas criados
  - [ ] `schemas/cnpj.py` criado
  - [ ] Validações implementadas

- [ ] **FASE 5:** Endpoints criados
  - [ ] `api/v1/cnpj.py` criado
  - [ ] Routers registrados

- [ ] **FASE 6:** Testes realizados
  - [ ] Testes unitários
  - [ ] Testes de integração
  - [ ] Validação de performance

---

## 🎯 Próximos Passos Após Integração

1. **Otimização de Queries**
   - Implementar cache Redis para buscas frequentes
   - Adicionar paginação eficiente
   - Usar índices de full-text search

2. **Features Avançadas**
   - Busca fuzzy em razão social
   - Filtros compostos (porte + CNAE + UF)
   - Exportação de dados (CSV, Excel)

3. **Monitoramento**
   - Logs de queries lentas
   - Métricas de uso de endpoints
   - Alertas de performance

---

**Documento gerado automaticamente pela análise profunda do banco de dados.**
