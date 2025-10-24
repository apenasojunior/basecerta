"""
Models para Schema CNPJ - Dados da Receita Federal
Issue: 2.1.1 - Smart CNPJ Backend

Estes models mapeiam DIRETAMENTE as tabelas existentes no schema 'cnpj'.
NÃO são modelos gerenciados pelo Alembic - são tabelas JÁ EXISTENTES.
"""
from datetime import date
from decimal import Decimal
from typing import Optional, List

from sqlalchemy import (
    Column, String, Numeric, Date, Text, ForeignKey, Integer
)
from sqlalchemy.orm import relationship

from app.core.database import Base


# ================================================================
# MODEL: Empresa (tabela cnpj.empresas)
# ================================================================

class Empresa(Base):
    """
    Empresa - Dados básicos do CNPJ (8 primeiros dígitos)
    Tabela: cnpj.empresas
    PK: cnpj_basico (8 dígitos)
    """
    
    __tablename__ = 'empresas'
    __table_args__ = {'schema': 'cnpj', 'extend_existing': True}
    
    # Primary Key
    cnpj_basico = Column(String(8), primary_key=True, index=True, comment="8 primeiros dígitos do CNPJ")
    
    # Dados Básicos
    razao_social = Column(String(500), nullable=False, index=True, comment="Razão social da empresa")
    natureza_juridica = Column(String(10), ForeignKey('cnpj.naturezas_juridicas.codigo'), comment="Código da natureza jurídica")
    qualificacao_responsavel = Column(String(5), ForeignKey('cnpj.qualificacoes_socios.codigo'), comment="Qualificação do responsável")
    capital_social = Column(Numeric(18, 2), index=True, comment="Capital social da empresa")
    porte_empresa = Column(String(2), index=True, comment="Porte: 01=Micro, 03=Pequena, 05=Grande")
    ente_federativo_responsavel = Column(String(100), comment="Ente federativo responsável")
    
    # Relacionamentos
    estabelecimentos = relationship("Estabelecimento", back_populates="empresa", lazy="select")
    socios = relationship("Socio", back_populates="empresa", lazy="select")
    simples_nacional = relationship("SimplesNacional", back_populates="empresa", uselist=False, lazy="select")
    
    # FK Relationships
    natureza = relationship("NaturezaJuridica", foreign_keys=[natureza_juridica], lazy="joined")
    qualificacao_resp = relationship("QualificacaoSocio", foreign_keys=[qualificacao_responsavel], lazy="joined")
    
    def __repr__(self):
        return f"<Empresa(cnpj_basico={self.cnpj_basico}, razao_social={self.razao_social[:50]})>"


# ================================================================
# MODEL: Estabelecimento (tabela cnpj.estabelecimentos)
# ================================================================

class Estabelecimento(Base):
    """
    Estabelecimento - Matriz ou Filial
    Tabela: cnpj.estabelecimentos
    PK Composta: (cnpj_basico, cnpj_ordem, cnpj_dv)
    """
    
    __tablename__ = 'estabelecimentos'
    __table_args__ = {'schema': 'cnpj', 'extend_existing': True}
    
    # Primary Key Composta (CNPJ completo = cnpj_basico + cnpj_ordem + cnpj_dv)
    cnpj_basico = Column(String(8), ForeignKey('cnpj.empresas.cnpj_basico'), primary_key=True)
    cnpj_ordem = Column(String(4), primary_key=True, comment="Ordem do estabelecimento (0001 = primeira)")
    cnpj_dv = Column(String(2), primary_key=True, comment="Dígito verificador")
    
    # Identificação
    identificador_matriz_filial = Column(String(1), index=True, comment="1=Matriz, 2=Filial")
    nome_fantasia = Column(String(500), comment="Nome fantasia")
    
    # Situação Cadastral
    situacao_cadastral = Column(String(2), index=True, comment="02=Ativa, 03=Suspensa, 04=Inapta, 08=Baixada")
    data_situacao_cadastral = Column(Date, comment="Data da situação cadastral")
    motivo_situacao_cadastral = Column(String(5), ForeignKey('cnpj.motivos_situacao_cadastral.codigo'))
    
    # Datas
    data_inicio_atividade = Column(Date, index=True, comment="Data de abertura")
    
    # CNAEs
    cnae_fiscal_principal = Column(String(10), ForeignKey('cnpj.cnaes.codigo'), index=True, comment="CNAE principal")
    cnae_fiscal_secundaria = Column(Text, comment="CNAEs secundários separados por vírgula")
    
    # Endereço
    tipo_logradouro = Column(String(50), comment="RUA, AVENIDA, etc")
    logradouro = Column(String(500), comment="Nome do logradouro")
    numero = Column(String(20), comment="Número")
    complemento = Column(String(300), comment="Complemento")
    bairro = Column(String(100), comment="Bairro")
    cep = Column(String(8), index=True, comment="CEP sem formatação")
    uf = Column(String(2), index=True, comment="Sigla UF")
    municipio = Column(String(10), ForeignKey('cnpj.municipios.codigo'), index=True, comment="Código do município")
    
    # Localização Externa
    nome_cidade_exterior = Column(String(100), comment="Nome da cidade no exterior")
    pais = Column(String(5), ForeignKey('cnpj.paises.codigo'), comment="Código do país")
    
    # Contatos
    ddd_1 = Column(String(5), comment="DDD telefone 1")
    telefone_1 = Column(String(20), comment="Telefone 1")
    ddd_2 = Column(String(5), comment="DDD telefone 2")
    telefone_2 = Column(String(20), comment="Telefone 2")
    ddd_fax = Column(String(5), comment="DDD fax")
    fax = Column(String(20), comment="Fax")
    correio_eletronico = Column(String(200), comment="Email")
    
    # Situação Especial
    situacao_especial = Column(String(100), comment="Situação especial")
    data_situacao_especial = Column(Date, comment="Data situação especial")
    
    # Relacionamentos
    empresa = relationship("Empresa", back_populates="estabelecimentos")
    cnae_principal = relationship("CNAE", foreign_keys=[cnae_fiscal_principal], lazy="joined")
    municipio_obj = relationship("Municipio", foreign_keys=[municipio], lazy="joined")
    pais_obj = relationship("Pais", foreign_keys=[pais], lazy="joined")
    motivo_situacao = relationship("MotivoSituacaoCadastral", foreign_keys=[motivo_situacao_cadastral], lazy="joined")
    
    @property
    def cnpj_completo(self) -> str:
        """Retorna CNPJ completo sem formatação (14 dígitos)"""
        return f"{self.cnpj_basico}{self.cnpj_ordem}{self.cnpj_dv}"
    
    @property
    def cnpj_formatado(self) -> str:
        """Retorna CNPJ formatado: 00.000.000/0000-00"""
        cnpj = self.cnpj_completo
        return f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:14]}"
    
    @property
    def is_matriz(self) -> bool:
        """True se for matriz"""
        return self.identificador_matriz_filial == '1'
    
    @property
    def endereco_completo(self) -> str:
        """Retorna endereço formatado"""
        partes = []
        if self.tipo_logradouro:
            partes.append(self.tipo_logradouro)
        if self.logradouro:
            partes.append(self.logradouro)
        if self.numero:
            partes.append(f", {self.numero}")
        if self.complemento:
            partes.append(f" - {self.complemento}")
        return "".join(partes)
    
    def __repr__(self):
        return f"<Estabelecimento(cnpj={self.cnpj_formatado}, matriz={self.is_matriz})>"


# ================================================================
# MODEL: Socio (tabela cnpj.socios)
# ================================================================

class Socio(Base):
    """
    Sócio - Quadro societário da empresa
    Tabela: cnpj.socios
    PK: id (autoincrement)
    """
    
    __tablename__ = 'socios'
    __table_args__ = {'schema': 'cnpj', 'extend_existing': True}
    
    # Primary Key
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # FK Empresa
    cnpj_basico = Column(String(8), ForeignKey('cnpj.empresas.cnpj_basico'), nullable=False, index=True)
    
    # Identificação do Sócio
    identificador_socio = Column(String(1), index=True, comment="1=PF, 2=PJ, 3=Estrangeiro")
    nome_socio = Column(String(500), comment="Nome do sócio")
    cnpj_cpf_socio = Column(String(14), index=True, comment="CPF ou CNPJ do sócio")
    
    # Qualificação
    qualificacao_socio = Column(String(5), ForeignKey('cnpj.qualificacoes_socios.codigo'), comment="Qualificação do sócio")
    
    # Datas
    data_entrada_sociedade = Column(Date, comment="Data de entrada na sociedade")
    
    # País
    pais = Column(String(5), ForeignKey('cnpj.paises.codigo'), comment="País do sócio")
    
    # Representante Legal
    representante_legal = Column(String(11), comment="CPF do representante legal")
    nome_representante = Column(String(300), comment="Nome do representante")
    qualificacao_representante_legal = Column(String(5), ForeignKey('cnpj.qualificacoes_socios.codigo'))
    
    # Faixa Etária
    faixa_etaria = Column(String(1), comment="Faixa etária do sócio")
    
    # Relacionamentos
    empresa = relationship("Empresa", back_populates="socios")
    qualificacao = relationship("QualificacaoSocio", foreign_keys=[qualificacao_socio], lazy="joined")
    qualificacao_rep = relationship("QualificacaoSocio", foreign_keys=[qualificacao_representante_legal], lazy="joined")
    pais_obj = relationship("Pais", foreign_keys=[pais], lazy="joined")
    
    @property
    def cpf_cnpj_formatado(self) -> Optional[str]:
        """Retorna CPF/CNPJ formatado"""
        if not self.cnpj_cpf_socio:
            return None
        
        doc = self.cnpj_cpf_socio
        if len(doc) == 11:  # CPF
            return f"{doc[:3]}.{doc[3:6]}.{doc[6:9]}-{doc[9:11]}"
        elif len(doc) == 14:  # CNPJ
            return f"{doc[:2]}.{doc[2:5]}.{doc[5:8]}/{doc[8:12]}-{doc[12:14]}"
        return doc
    
    def __repr__(self):
        return f"<Socio(id={self.id}, nome={self.nome_socio[:30]}, cnpj_basico={self.cnpj_basico})>"


# ================================================================
# MODEL: CNAE (tabela cnpj.cnaes)
# ================================================================

class CNAE(Base):
    """
    CNAE - Classificação Nacional de Atividades Econômicas
    Tabela: cnpj.cnaes
    PK: codigo
    """
    
    __tablename__ = 'cnaes'
    __table_args__ = {'schema': 'cnpj', 'extend_existing': True}
    
    # Primary Key
    codigo = Column(String(10), primary_key=True, comment="Código CNAE")
    descricao = Column(String(250), nullable=False, comment="Descrição da atividade")
    
    def __repr__(self):
        return f"<CNAE(codigo={self.codigo}, descricao={self.descricao[:50]})>"


# ================================================================
# MODEL: SimplesNacional (tabela cnpj.simples)
# ================================================================

class SimplesNacional(Base):
    """
    Simples Nacional - Regime tributário
    Tabela: cnpj.simples
    PK: cnpj_basico
    """
    
    __tablename__ = 'simples'
    __table_args__ = {'schema': 'cnpj', 'extend_existing': True}
    
    # Primary Key (FK Empresa)
    cnpj_basico = Column(String(8), ForeignKey('cnpj.empresas.cnpj_basico'), primary_key=True)
    
    # Opção pelo Simples
    opcao_simples = Column(String(1), comment="S=Sim, N=Não")
    data_opcao_simples = Column(Date, comment="Data da opção")
    data_exclusao_simples = Column(Date, comment="Data da exclusão")
    
    # Opção pelo MEI
    opcao_mei = Column(String(1), comment="S=Sim, N=Não")
    data_opcao_mei = Column(Date, comment="Data da opção MEI")
    data_exclusao_mei = Column(Date, comment="Data da exclusão MEI")
    
    # Relacionamento
    empresa = relationship("Empresa", back_populates="simples_nacional")
    
    @property
    def is_simples(self) -> bool:
        """True se optante do Simples Nacional"""
        return self.opcao_simples == 'S'
    
    @property
    def is_mei(self) -> bool:
        """True se MEI"""
        return self.opcao_mei == 'S'
    
    def __repr__(self):
        return f"<SimplesNacional(cnpj_basico={self.cnpj_basico}, simples={self.is_simples}, mei={self.is_mei})>"


# ================================================================
# TABELAS AUXILIARES
# ================================================================

class NaturezaJuridica(Base):
    """Tabela: cnpj.naturezas_juridicas"""
    __tablename__ = 'naturezas_juridicas'
    __table_args__ = {'schema': 'cnpj', 'extend_existing': True}
    
    codigo = Column(String(10), primary_key=True)
    descricao = Column(String(200), nullable=False)
    
    def __repr__(self):
        return f"<NaturezaJuridica(codigo={self.codigo}, descricao={self.descricao[:30]})>"


class QualificacaoSocio(Base):
    """Tabela: cnpj.qualificacoes_socios"""
    __tablename__ = 'qualificacoes_socios'
    __table_args__ = {'schema': 'cnpj', 'extend_existing': True}
    
    codigo = Column(String(5), primary_key=True)
    descricao = Column(String(200), nullable=False)
    
    def __repr__(self):
        return f"<QualificacaoSocio(codigo={self.codigo}, descricao={self.descricao[:30]})>"


class MotivoSituacaoCadastral(Base):
    """Tabela: cnpj.motivos_situacao_cadastral"""
    __tablename__ = 'motivos_situacao_cadastral'
    __table_args__ = {'schema': 'cnpj', 'extend_existing': True}
    
    codigo = Column(String(5), primary_key=True)
    descricao = Column(String(200), nullable=False)
    
    def __repr__(self):
        return f"<MotivoSituacaoCadastral(codigo={self.codigo})>"


class Municipio(Base):
    """Tabela: cnpj.municipios"""
    __tablename__ = 'municipios'
    __table_args__ = {'schema': 'cnpj', 'extend_existing': True}
    
    codigo = Column(String(10), primary_key=True)
    descricao = Column(String(200), nullable=False)
    
    def __repr__(self):
        return f"<Municipio(codigo={self.codigo}, descricao={self.descricao})>"


class Pais(Base):
    """Tabela: cnpj.paises"""
    __tablename__ = 'paises'
    __table_args__ = {'schema': 'cnpj', 'extend_existing': True}
    
    codigo = Column(String(5), primary_key=True)
    descricao = Column(String(200), nullable=False)
    
    def __repr__(self):
        return f"<Pais(codigo={self.codigo}, descricao={self.descricao})>"
