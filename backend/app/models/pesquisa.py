"""
Model para Histórico de Pesquisas - Smart CNPJ
Issue: 2.1.1 - Smart CNPJ Backend

Tabela: public.pesquisa_cnpj
Armazena histórico de buscas realizadas no produto Smart CNPJ 360°
"""
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import uuid4

from sqlalchemy import (
    Column, String, Integer, ForeignKey, Text, CheckConstraint, Index
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base


class PesquisaCNPJ(Base):
    """
    Histórico de Pesquisas do Smart CNPJ
    
    Registra cada busca realizada com:
    - Tipo de busca (cnpj, razao_social, etc)
    - Valor pesquisado
    - Filtros aplicados (JSONB)
    - Total de resultados
    - Créditos consumidos
    - Performance (tempo de resposta)
    
    Trigger automático: Ao inserir, debita créditos do usuário
    """
    
    __tablename__ = 'pesquisa_cnpj'
    __table_args__ = (
        CheckConstraint(
            "tipo_busca IN ('cnpj', 'razao_social', 'segmento', 'email', 'telefone', 'nome_socio', 'cep')",
            name='check_tipo_busca_valido'
        ),
        Index('idx_pesquisa_user_id', 'user_id'),
        Index('idx_pesquisa_cnpj', 'cnpj_encontrado'),
        Index('idx_pesquisa_created_at', 'created_at'),
        Index('idx_pesquisa_tipo_busca', 'tipo_busca'),
        Index('idx_pesquisa_user_created', 'user_id', 'created_at'),
        Index('idx_pesquisa_filtros_gin', 'filtros_aplicados', postgresql_using='gin'),
        {'schema': 'public', 'extend_existing': True}
    )
    
    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, comment="UUID único da pesquisa")
    
    # FK User (referencia public.users) - TODO: Descomentar no Delivery 3
    # user_id = Column(Integer, ForeignKey('public.users.id', ondelete='CASCADE'), nullable=False, index=True, comment="ID do usuário que fez a busca")
    user_id = Column(Integer, nullable=False, index=True, comment="ID do usuário que fez a busca (FK temporariamente removida)")
    
    # Busca Realizada
    tipo_busca = Column(
        String(20), 
        nullable=False, 
        comment="Tipo: cnpj|razao_social|segmento|email|telefone|nome_socio|cep"
    )
    valor_busca = Column(Text, nullable=False, comment="Valor pesquisado (ex: '12345678', 'empresa LTDA')")
    
    # Filtros Aplicados (JSON)
    filtros_aplicados = Column(
        JSONB, 
        comment="Filtros: {uf, municipio, situacao, porte, capitalMinimo, capitalMaximo, dataAberturaInicio, dataAberturaFim}"
    )
    
    # Resultados
    total_resultados = Column(Integer, comment="Quantidade de CNPJs encontrados")
    
    # Créditos
    creditos_usados = Column(Integer, default=5, nullable=False, comment="Créditos debitados (padrão: 5)")
    
    # Performance
    tempo_resposta_ms = Column(Integer, comment="Tempo de resposta em milissegundos (para monitoramento)")
    
    # Auditoria
    created_at = Column(
        String(50),  # Compatível com TIMESTAMP WITHOUT TIME ZONE
        default=lambda: datetime.utcnow().isoformat(),
        comment="Data/hora da pesquisa"
    )
    updated_at = Column(
        String(50),
        default=lambda: datetime.utcnow().isoformat(),
        onupdate=lambda: datetime.utcnow().isoformat(),
        comment="Data/hora da última atualização"
    )
    
    # Cache: CNPJ encontrado (se busca por CNPJ específico)
    cnpj_encontrado = Column(String(18), index=True, comment="CNPJ formatado se busca foi por CNPJ")
    
    # Relacionamento com User (assumindo que existe model User)
    # user = relationship("User", back_populates="pesquisas_cnpj")
    
    def to_dict(self) -> Dict[str, Any]:
        """Converte para dicionário (JSON serializable)"""
        return {
            'id': str(self.id),
            'user_id': self.user_id,
            'tipo_busca': self.tipo_busca,
            'valor_busca': self.valor_busca,
            'filtros_aplicados': self.filtros_aplicados,
            'total_resultados': self.total_resultados,
            'creditos_usados': self.creditos_usados,
            'tempo_resposta_ms': self.tempo_resposta_ms,
            'cnpj_encontrado': self.cnpj_encontrado,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
    
    @property
    def tipo_busca_formatado(self) -> str:
        """Retorna nome amigável do tipo de busca"""
        tipos = {
            'cnpj': 'CNPJ',
            'razao_social': 'Razão Social',
            'segmento': 'Segmento (CNAE)',
            'email': 'E-mail',
            'telefone': 'Telefone',
            'nome_socio': 'Nome do Sócio',
            'cep': 'CEP'
        }
        return tipos.get(self.tipo_busca, self.tipo_busca)
    
    def __repr__(self):
        return f"<PesquisaCNPJ(id={self.id}, tipo={self.tipo_busca}, user_id={self.user_id}, resultados={self.total_resultados})>"
