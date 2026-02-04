"""
CRUD Repository para Base CNPJ
Feature: S02-F02
Sprint: S02 - Integração Base CNPJ

Repository pattern para operações otimizadas de consulta na base CNPJ.
Usa índices existentes para performance em 322M+ registros.
"""
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_, and_, select

from app.models.cnpj import (
    Empresa,
    Estabelecimento,
    Socio,
    SimplesNacional,
    CNAE,
    NaturezaJuridica,
    QualificacaoSocio,
    Municipio,
    Pais
)


class CNPJRepository:
    """
    Repository para consultas na base CNPJ da Receita Federal
    
    Implementa consultas otimizadas usando índices existentes:
    - idx_empresas_razao_social (text search)
    - idx_estabelecimentos_cnpj_basico (FK)
    - idx_estabelecimentos_cnae_principal
    - idx_socios_cnpj_basico (FK)
    - idx_socios_cnpj_cpf_socio
    - idx_socios_nome
    """
    
    # ================================================================
    # EMPRESAS - Busca por CNPJ Básico e Razão Social
    # ================================================================
    
    @staticmethod
    def get_empresa_by_cnpj_basico(
        db: Session, 
        cnpj_basico: str,
        include_relations: bool = False
    ) -> Optional[Empresa]:
        """
        Busca empresa por CNPJ básico (8 dígitos)
        
        Args:
            db: SQLAlchemy session
            cnpj_basico: 8 primeiros dígitos do CNPJ
            include_relations: Se True, carrega natureza e qualificação
            
        Returns:
            Empresa ou None
            
        Performance:
            Usa PK (pk_empresas) - O(1) lookup
        """
        query = db.query(Empresa).filter(Empresa.cnpj_basico == cnpj_basico)
        
        if include_relations:
            query = query.options(
                joinedload(Empresa.natureza),
                joinedload(Empresa.qualificacao_resp)
            )
        
        return query.first()
    
    @staticmethod
    def search_empresas_by_razao_social(
        db: Session,
        termo: str,
        limit: int = 50,
        offset: int = 0
    ) -> Tuple[List[Empresa], int]:
        """
        Busca empresas por razão social (case-insensitive)
        
        Args:
            db: SQLAlchemy session
            termo: Texto a buscar na razão social
            limit: Máximo de resultados (padrão: 50, máx: 100)
            offset: Paginação - número de registros a pular
            
        Returns:
            Tupla (lista de empresas, total de resultados)
            
        Performance:
            Usa índice idx_empresas_razao_social para ILIKE
            ~2-10x mais rápido que Sequential Scan
        """
        # Limitar resultados para performance
        limit = min(limit, 100)
        
        # Query base
        base_query = db.query(Empresa).filter(
            Empresa.razao_social.ilike(f'%{termo}%')
        )
        
        # Total de resultados (para paginação)
        total = base_query.count()
        
        # Resultados paginados
        empresas = base_query.limit(limit).offset(offset).all()
        
        return empresas, total
    
    @staticmethod
    def get_empresas_by_natureza_juridica(
        db: Session,
        codigo_natureza: str,
        limit: int = 50
    ) -> List[Empresa]:
        """
        Busca empresas por natureza jurídica
        
        Performance:
            Usa índice idx_empresas_natureza_juridica
        """
        return (
            db.query(Empresa)
            .filter(Empresa.natureza_juridica == codigo_natureza)
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def get_empresas_by_porte(
        db: Session,
        porte: str,
        limit: int = 50
    ) -> List[Empresa]:
        """
        Busca empresas por porte (01=ME, 03=EPP, 05=Demais)
        
        Performance:
            Usa índice idx_empresas_porte
        """
        return (
            db.query(Empresa)
            .filter(Empresa.porte_empresa == porte)
            .limit(limit)
            .all()
        )
    
    # ================================================================
    # ESTABELECIMENTOS - Busca por CNPJ Completo
    # ================================================================
    
    @staticmethod
    def get_estabelecimento_by_cnpj_completo(
        db: Session,
        cnpj_completo: str,
        include_relations: bool = False
    ) -> Optional[Estabelecimento]:
        """
        Busca estabelecimento por CNPJ completo (14 dígitos)
        
        Args:
            db: SQLAlchemy session
            cnpj_completo: CNPJ completo (14 dígitos, sem formatação)
            include_relations: Se True, carrega empresa, CNAE, município
            
        Returns:
            Estabelecimento ou None
            
        Performance:
            Usa PK composta - O(1) lookup
        """
        # Dividir CNPJ em componentes
        cnpj_basico = cnpj_completo[:8]
        cnpj_ordem = cnpj_completo[8:12]
        cnpj_dv = cnpj_completo[12:14]
        
        query = db.query(Estabelecimento).filter(
            and_(
                Estabelecimento.cnpj_basico == cnpj_basico,
                Estabelecimento.cnpj_ordem == cnpj_ordem,
                Estabelecimento.cnpj_dv == cnpj_dv
            )
        )
        
        if include_relations:
            query = query.options(
                joinedload(Estabelecimento.empresa),
                joinedload(Estabelecimento.cnae_principal),
                joinedload(Estabelecimento.municipio_obj)
            )
        
        return query.first()
    
    @staticmethod
    def get_estabelecimentos_by_empresa(
        db: Session,
        cnpj_basico: str,
        apenas_matriz: bool = False,
        apenas_ativos: bool = False
    ) -> List[Estabelecimento]:
        """
        Lista estabelecimentos de uma empresa
        
        Args:
            db: SQLAlchemy session
            cnpj_basico: CNPJ básico da empresa
            apenas_matriz: Se True, retorna apenas matriz (identificador=1)
            apenas_ativos: Se True, filtra apenas situação cadastral=02
            
        Returns:
            Lista de estabelecimentos
            
        Performance:
            Usa índice idx_estabelecimentos_cnpj_basico (FK)
            100-3900x mais rápido que Sequential Scan
        """
        query = db.query(Estabelecimento).filter(
            Estabelecimento.cnpj_basico == cnpj_basico
        )
        
        if apenas_matriz:
            query = query.filter(Estabelecimento.identificador_matriz_filial == '1')
        
        if apenas_ativos:
            query = query.filter(Estabelecimento.situacao_cadastral == '02')
        
        return query.all()
    
    @staticmethod
    def get_estabelecimentos_by_cnae(
        db: Session,
        codigo_cnae: str,
        limit: int = 50
    ) -> List[Estabelecimento]:
        """
        Busca estabelecimentos por CNAE principal
        
        Performance:
            Usa índice idx_estabelecimentos_cnae_principal
            10-50x mais rápido
        """
        return (
            db.query(Estabelecimento)
            .filter(Estabelecimento.cnae_fiscal_principal == codigo_cnae)
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def get_estabelecimentos_by_municipio(
        db: Session,
        codigo_municipio: str,
        limit: int = 50
    ) -> List[Estabelecimento]:
        """
        Busca estabelecimentos por município
        
        Performance:
            Usa índice idx_estabelecimentos_municipio
        """
        return (
            db.query(Estabelecimento)
            .filter(Estabelecimento.municipio == codigo_municipio)
            .limit(limit)
            .all()
        )
    
    # ================================================================
    # SÓCIOS - Busca por Empresa, Nome, CPF/CNPJ
    # ================================================================
    
    @staticmethod
    def get_socios_by_empresa(
        db: Session,
        cnpj_basico: str,
        include_relations: bool = False
    ) -> List[Socio]:
        """
        Lista sócios de uma empresa
        
        Args:
            db: SQLAlchemy session
            cnpj_basico: CNPJ básico da empresa
            include_relations: Se True, carrega qualificação e país
            
        Returns:
            Lista de sócios
            
        Performance:
            Usa índice idx_socios_cnpj_basico (FK)
            50-500x mais rápido
        """
        query = db.query(Socio).filter(Socio.cnpj_basico == cnpj_basico)
        
        if include_relations:
            query = query.options(
                joinedload(Socio.qualificacao),
                joinedload(Socio.pais_obj)
            )
        
        return query.all()
    
    @staticmethod
    def search_socios_by_nome(
        db: Session,
        nome: str,
        limit: int = 50,
        offset: int = 0
    ) -> Tuple[List[Socio], int]:
        """
        Busca sócios por nome (case-insensitive)
        
        Args:
            db: SQLAlchemy session
            nome: Texto a buscar no nome do sócio
            limit: Máximo de resultados
            offset: Paginação
            
        Returns:
            Tupla (lista de sócios, total de resultados)
            
        Performance:
            Usa índice idx_socios_nome
        """
        limit = min(limit, 100)
        
        base_query = db.query(Socio).filter(
            Socio.nome_socio.ilike(f'%{nome}%')
        )
        
        total = base_query.count()
        socios = base_query.limit(limit).offset(offset).all()
        
        return socios, total
    
    @staticmethod
    def search_by_cnpj_cpf_socio(
        db: Session,
        documento: str,
        include_empresa: bool = False
    ) -> List[Socio]:
        """
        Busca empresas onde uma pessoa/empresa é sócia
        
        Args:
            db: SQLAlchemy session
            documento: CPF ou CNPJ do sócio (11 ou 14 dígitos)
            include_empresa: Se True, carrega dados da empresa
            
        Returns:
            Lista de participações societárias
            
        Performance:
            Usa índice idx_socios_cnpj_cpf_socio
        """
        query = db.query(Socio).filter(Socio.cnpj_cpf_socio == documento)
        
        if include_empresa:
            query = query.options(joinedload(Socio.empresa))
        
        return query.all()
    
    @staticmethod
    def get_socio_by_pk(
        db: Session,
        cnpj_basico: str,
        identificador_socio: str
    ) -> Optional[Socio]:
        """
        Busca sócio por PK composta
        
        Args:
            db: SQLAlchemy session
            cnpj_basico: CNPJ básico da empresa
            identificador_socio: Identificador do sócio
            
        Returns:
            Socio ou None
            
        Performance:
            Usa PK composta - O(1) lookup
        """
        return db.query(Socio).filter(
            and_(
                Socio.cnpj_basico == cnpj_basico,
                Socio.identificador_socio == identificador_socio
            )
        ).first()
    
    # ================================================================
    # SIMPLES NACIONAL - Regime Tributário
    # ================================================================
    
    @staticmethod
    def get_simples_by_empresa(
        db: Session,
        cnpj_basico: str
    ) -> Optional[SimplesNacional]:
        """
        Verifica se empresa é optante do Simples Nacional
        
        Args:
            db: SQLAlchemy session
            cnpj_basico: CNPJ básico da empresa
            
        Returns:
            SimplesNacional ou None
            
        Performance:
            Usa PK (pk_simples) - O(1) lookup
        """
        return db.query(SimplesNacional).filter(
            SimplesNacional.cnpj_basico == cnpj_basico
        ).first()
    
    @staticmethod
    def get_empresas_simples(
        db: Session,
        apenas_mei: bool = False,
        limit: int = 50
    ) -> List[SimplesNacional]:
        """
        Lista empresas optantes do Simples Nacional
        
        Args:
            db: SQLAlchemy session
            apenas_mei: Se True, filtra apenas MEI
            limit: Máximo de resultados
            
        Returns:
            Lista de SimplesNacional
            
        Performance:
            Usa índices idx_simples_optante ou idx_simples_mei_optante
        """
        query = db.query(SimplesNacional).filter(
            SimplesNacional.opcao_simples == 'S'
        )
        
        if apenas_mei:
            query = query.filter(SimplesNacional.opcao_mei == 'S')
        
        return query.limit(limit).all()
    
    # ================================================================
    # TABELAS AUXILIARES - CNAEs, Naturezas, etc
    # ================================================================
    
    @staticmethod
    def get_cnae_by_codigo(db: Session, codigo: str) -> Optional[CNAE]:
        """Busca CNAE por código"""
        return db.query(CNAE).filter(CNAE.codigo == codigo).first()
    
    @staticmethod
    def search_cnaes_by_descricao(
        db: Session,
        termo: str,
        limit: int = 50
    ) -> List[CNAE]:
        """Busca CNAEs por descrição"""
        return (
            db.query(CNAE)
            .filter(CNAE.descricao.ilike(f'%{termo}%'))
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def get_natureza_juridica(
        db: Session,
        codigo: str
    ) -> Optional[NaturezaJuridica]:
        """Busca natureza jurídica por código"""
        return db.query(NaturezaJuridica).filter(
            NaturezaJuridica.codigo == codigo
        ).first()
    
    @staticmethod
    def get_qualificacao_socio(
        db: Session,
        codigo: str
    ) -> Optional[QualificacaoSocio]:
        """Busca qualificação de sócio por código"""
        return db.query(QualificacaoSocio).filter(
            QualificacaoSocio.codigo == codigo
        ).first()
    
    @staticmethod
    def get_municipio(db: Session, codigo: str) -> Optional[Municipio]:
        """Busca município por código IBGE"""
        return db.query(Municipio).filter(Municipio.codigo == codigo).first()
    
    @staticmethod
    def get_pais(db: Session, codigo: str) -> Optional[Pais]:
        """Busca país por código BACEN"""
        return db.query(Pais).filter(Pais.codigo == codigo).first()
    
    # ================================================================
    # UTILITÁRIOS - Queries complexas
    # ================================================================
    
    @staticmethod
    def get_empresa_completa(
        db: Session,
        cnpj_basico: str
    ) -> Optional[dict]:
        """
        Retorna dados completos de uma empresa:
        - Dados cadastrais
        - Todos os estabelecimentos
        - Quadro societário
        - Simples Nacional
        
        Args:
            db: SQLAlchemy session
            cnpj_basico: CNPJ básico da empresa
            
        Returns:
            Dict com dados completos ou None
        """
        empresa = CNPJRepository.get_empresa_by_cnpj_basico(
            db, cnpj_basico, include_relations=True
        )
        
        if not empresa:
            return None
        
        estabelecimentos = CNPJRepository.get_estabelecimentos_by_empresa(
            db, cnpj_basico
        )
        
        socios = CNPJRepository.get_socios_by_empresa(
            db, cnpj_basico, include_relations=True
        )
        
        simples = CNPJRepository.get_simples_by_empresa(db, cnpj_basico)
        
        return {
            'empresa': empresa,
            'estabelecimentos': estabelecimentos,
            'socios': socios,
            'simples_nacional': simples,
            'total_estabelecimentos': len(estabelecimentos),
            'total_socios': len(socios),
            'is_simples': simples.is_simples if simples else False,
            'is_mei': simples.is_mei if simples else False
        }
