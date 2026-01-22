"""
Models para Base de Dados CNPJ Brasil
Estrutura dividida em dois schemas: cnpjs_ativos e demais_cnpjs
"""
from sqlalchemy import Column, String, Date, DateTime, Numeric, BigInteger, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base


# ======================================
# TABELAS AUXILIARES (Schema: public)
# ======================================

class Cnae(Base):
    """Classificação Nacional de Atividades Econômicas"""
    __tablename__ = "cnaes"
    __table_args__ = {'schema': 'public'}
    
    codigo = Column(String(7), primary_key=True)
    descricao = Column(String(200), nullable=False)


class Municipio(Base):
    """Municípios brasileiros (código IBGE)"""
    __tablename__ = "municipios"
    __table_args__ = {'schema': 'public'}
    
    codigo = Column(String(4), primary_key=True)
    descricao = Column(String(100), nullable=False)


class Pais(Base):
    """Países (código BACEN)"""
    __tablename__ = "paises"
    __table_args__ = {'schema': 'public'}
    
    codigo = Column(String(3), primary_key=True)
    descricao = Column(String(100), nullable=False)


class NaturezaJuridica(Base):
    """Naturezas jurídicas das empresas"""
    __tablename__ = "naturezas_juridicas"
    __table_args__ = {'schema': 'public'}
    
    codigo = Column(String(4), primary_key=True)
    descricao = Column(String(200), nullable=False)


class QualificacaoSocio(Base):
    """Qualificações dos sócios/representantes"""
    __tablename__ = "qualificacoes_socios"
    __table_args__ = {'schema': 'public'}
    
    codigo = Column(String(2), primary_key=True)
    descricao = Column(String(200), nullable=False)


class MotivoSituacaoCadastral(Base):
    """Motivos de situação cadastral"""
    __tablename__ = "motivos_situacao_cadastral"
    __table_args__ = {'schema': 'public'}
    
    codigo = Column(String(2), primary_key=True)
    descricao = Column(String(200), nullable=False)


# ======================================
# FACTORY FUNCTION PARA CRIAR MODELS
# ======================================

def create_cnpj_models(schema_name: str):
    """
    Cria os models de CNPJ para um schema específico
    
    Args:
        schema_name: Nome do schema ('cnpjs_ativos' ou 'demais_cnpjs')
    
    Returns:
        Tupla com as classes (Empresa, Estabelecimento, Socio, SimplesNacional)
    """
    
    class Empresa(Base):
        """Dados da empresa (matriz/holding)"""
        __tablename__ = "empresas"
        __table_args__ = {'schema': schema_name}
        
        cnpj_basico = Column(String(8), primary_key=True, comment="8 primeiros dígitos do CNPJ")
        razao_social = Column(String(200), nullable=False, comment="Razão social da empresa")
        natureza_juridica = Column(String(4), nullable=True, comment="Código natureza jurídica")
        qualificacao_responsavel = Column(String(2), nullable=True, comment="Qualificação do responsável")
        capital_social = Column(Numeric(15, 2), nullable=True, comment="Capital social declarado")
        porte_empresa = Column(String(2), nullable=True, comment="01=Não informado, 03=MEI, 05=Outros")
        ente_federativo_responsavel = Column(String(100), nullable=True, comment="Para empresas públicas")
        
        created_at = Column(DateTime, server_default=func.now())
        updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
        
        # Relationships
        estabelecimentos = relationship(
            "Estabelecimento",
            back_populates="empresa",
            cascade="all, delete-orphan"
        )
        socios = relationship(
            "Socio",
            back_populates="empresa",
            cascade="all, delete-orphan"
        )
        simples = relationship(
            "SimplesNacional",
            back_populates="empresa",
            uselist=False,
            cascade="all, delete-orphan"
        )
        
        def __repr__(self):
            return f"<Empresa(cnpj={self.cnpj_basico}, razao_social='{self.razao_social}')>"
    
    
    class Estabelecimento(Base):
        """Dados do estabelecimento (matriz ou filial)"""
        __tablename__ = "estabelecimentos"
        __table_args__ = {'schema': schema_name}
        
        id = Column(BigInteger, primary_key=True, autoincrement=True)
        
        # CNPJ completo (14 dígitos)
        cnpj_basico = Column(String(8), ForeignKey(f'{schema_name}.empresas.cnpj_basico'), nullable=False)
        cnpj_ordem = Column(String(4), nullable=False, comment="Ordem do estabelecimento (0001=matriz)")
        cnpj_dv = Column(String(2), nullable=False, comment="Dígitos verificadores")
        
        # Identificação
        identificador_matriz_filial = Column(String(1), comment="1=Matriz, 2=Filial")
        nome_fantasia = Column(String(200), nullable=True)
        
        # Situação cadastral
        situacao_cadastral = Column(String(2), comment="01=Nula, 02=Ativa, 03=Suspensa, 04=Inapta, 08=Baixada")
        data_situacao_cadastral = Column(Date, nullable=True)
        motivo_situacao_cadastral = Column(String(2), nullable=True)
        
        # Localização exterior
        nome_cidade_exterior = Column(String(100), nullable=True)
        pais = Column(String(3), nullable=True)
        
        # Atividade
        data_inicio_atividade = Column(Date, nullable=True)
        cnae_fiscal_principal = Column(String(7), nullable=True)
        cnae_fiscal_secundaria = Column(Text, nullable=True, comment="CNAEs secundários separados por vírgula")
        
        # Endereço
        tipo_logradouro = Column(String(50), nullable=True)
        logradouro = Column(String(200), nullable=True)
        numero = Column(String(20), nullable=True)
        complemento = Column(String(200), nullable=True)
        bairro = Column(String(100), nullable=True)
        cep = Column(String(8), nullable=True)
        uf = Column(String(2), nullable=True)
        municipio = Column(String(4), nullable=True)
        
        # Contato
        ddd_1 = Column(String(4), nullable=True)
        telefone_1 = Column(String(20), nullable=True)
        ddd_2 = Column(String(4), nullable=True)
        telefone_2 = Column(String(20), nullable=True)
        ddd_fax = Column(String(4), nullable=True)
        fax = Column(String(20), nullable=True)
        email = Column(String(200), nullable=True)
        
        # Situação especial
        situacao_especial = Column(String(100), nullable=True)
        data_situacao_especial = Column(Date, nullable=True)
        
        created_at = Column(DateTime, server_default=func.now())
        updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
        
        # Relationships
        empresa = relationship("Empresa", back_populates="estabelecimentos")
        
        @property
        def cnpj_completo(self) -> str:
            """Retorna o CNPJ completo no formato 00000000000000"""
            return f"{self.cnpj_basico}{self.cnpj_ordem}{self.cnpj_dv}"
        
        @property
        def cnpj_formatado(self) -> str:
            """Retorna o CNPJ formatado: 00.000.000/0001-00"""
            cnpj = self.cnpj_completo
            return f"{cnpj[0:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:14]}"
        
        @property
        def is_ativo(self) -> bool:
            """Verifica se o estabelecimento está ativo"""
            return self.situacao_cadastral == '02'
        
        @property
        def is_matriz(self) -> bool:
            """Verifica se é matriz (ordem = 0001)"""
            return self.cnpj_ordem == '0001' or self.identificador_matriz_filial == '1'
        
        def __repr__(self):
            return f"<Estabelecimento(cnpj={self.cnpj_formatado}, fantasia='{self.nome_fantasia}')>"
    
    
    class Socio(Base):
        """Dados dos sócios/quadro societário"""
        __tablename__ = "socios"
        __table_args__ = {'schema': schema_name}
        
        id = Column(BigInteger, primary_key=True, autoincrement=True)
        
        cnpj_basico = Column(String(8), ForeignKey(f'{schema_name}.empresas.cnpj_basico'), nullable=False)
        
        # Identificação do sócio
        identificador_socio = Column(String(1), comment="1=PJ, 2=PF, 3=Estrangeiro")
        nome_socio = Column(String(200), nullable=False)
        cpf_cnpj_socio = Column(String(14), nullable=True, comment="CPF/CNPJ do sócio (parcialmente mascarado)")
        
        # Qualificação
        qualificacao_socio = Column(String(2), nullable=True)
        data_entrada_sociedade = Column(Date, nullable=True)
        pais = Column(String(3), nullable=True, comment="País de origem (se estrangeiro)")
        
        # Representante legal
        representante_legal = Column(String(14), nullable=True, comment="CPF do representante")
        nome_representante = Column(String(200), nullable=True)
        qualificacao_representante = Column(String(2), nullable=True)
        
        # Faixa etária (PF)
        faixa_etaria = Column(String(1), nullable=True, comment="1=0-12, 2=13-20, 3=21-30, etc")
        
        created_at = Column(DateTime, server_default=func.now())
        updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
        
        # Relationships
        empresa = relationship("Empresa", back_populates="socios")
        
        @property
        def is_pessoa_fisica(self) -> bool:
            """Verifica se o sócio é pessoa física"""
            return self.identificador_socio == '2'
        
        @property
        def is_pessoa_juridica(self) -> bool:
            """Verifica se o sócio é pessoa jurídica"""
            return self.identificador_socio == '1'
        
        def __repr__(self):
            return f"<Socio(nome='{self.nome_socio}', empresa={self.cnpj_basico})>"
    
    
    class SimplesNacional(Base):
        """Dados de optantes do Simples Nacional e MEI"""
        __tablename__ = "simples_nacional"
        __table_args__ = {'schema': schema_name}
        
        cnpj_basico = Column(String(8), ForeignKey(f'{schema_name}.empresas.cnpj_basico'), primary_key=True)
        
        # Simples Nacional
        opcao_simples = Column(String(1), comment="S=Sim, N=Não")
        data_opcao_simples = Column(Date, nullable=True)
        data_exclusao_simples = Column(Date, nullable=True)
        
        # MEI
        opcao_mei = Column(String(1), comment="S=Sim, N=Não")
        data_opcao_mei = Column(Date, nullable=True)
        data_exclusao_mei = Column(Date, nullable=True)
        
        created_at = Column(DateTime, server_default=func.now())
        updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
        
        # Relationships
        empresa = relationship("Empresa", back_populates="simples")
        
        @property
        def is_optante_simples(self) -> bool:
            """Verifica se é optante do Simples Nacional"""
            return self.opcao_simples == 'S'
        
        @property
        def is_mei(self) -> bool:
            """Verifica se é MEI"""
            return self.opcao_mei == 'S'
        
        def __repr__(self):
            return f"<SimplesNacional(cnpj={self.cnpj_basico}, simples={self.opcao_simples}, mei={self.opcao_mei})>"
    
    return Empresa, Estabelecimento, Socio, SimplesNacional


# ======================================
# INSTANCIAR MODELS PARA OS 2 SCHEMAS
# ======================================

# Schema: cnpjs_ativos
EmpresaAtiva, EstabelecimentoAtivo, SocioAtivo, SimplesNacionalAtivo = create_cnpj_models('cnpjs_ativos')

# Schema: demais_cnpjs
EmpresaDemais, EstabelecimentoDemais, SocioDemais, SimplesNacionalDemais = create_cnpj_models('demais_cnpjs')


# ======================================
# HELPERS PARA SELEÇÃO DINÂMICA
# ======================================

def get_models_by_situacao(situacao_cadastral: str):
    """
    Retorna os models apropriados baseado na situação cadastral
    
    Args:
        situacao_cadastral: Código da situação (02=Ativa, etc)
    
    Returns:
        Tupla com (Empresa, Estabelecimento, Socio, SimplesNacional)
    """
    if situacao_cadastral == '02':
        return EmpresaAtiva, EstabelecimentoAtivo, SocioAtivo, SimplesNacionalAtivo
    else:
        return EmpresaDemais, EstabelecimentoDemais, SocioDemais, SimplesNacionalDemais


def get_schema_by_situacao(situacao_cadastral: str) -> str:
    """
    Retorna o nome do schema baseado na situação cadastral
    
    Args:
        situacao_cadastral: Código da situação (02=Ativa, etc)
    
    Returns:
        Nome do schema ('cnpjs_ativos' ou 'demais_cnpjs')
    """
    return 'cnpjs_ativos' if situacao_cadastral == '02' else 'demais_cnpjs'
