"""
Testes unitários para IntelligentInsightsService.

Sprint: S03 - Insights Estratégicos
Feature: F03.5 - Testes e Documentação
"""

import pytest
from unittest.mock import Mock, MagicMock
from app.services.intelligent_insights import IntelligentInsightsService


class TestIntelligentInsightsService:
    """Testes para detecção de anomalias e priorização."""
    
    @pytest.fixture
    def mock_db(self):
        """Mock do SQLAlchemy Session."""
        return Mock()
    
    @pytest.fixture
    def service(self, mock_db):
        """Instância do serviço com DB mockado."""
        return IntelligentInsightsService(mock_db)
    
    def test_classify_anomaly_high_growth(self, service):
        """Testa classificação de crescimento excepcional."""
        result = service._classify_anomaly(z_score=2.5, growth_rate=0.05)
        assert result == 'high_growth'
    
    def test_classify_anomaly_attention(self, service):
        """Testa classificação de queda incomum."""
        result = service._classify_anomaly(z_score=-1.5, growth_rate=-0.03)
        assert result == 'attention'
    
    def test_classify_anomaly_emerging(self, service):
        """Testa classificação de setor emergente."""
        result = service._classify_anomaly(z_score=0.8, growth_rate=0.06)
        assert result == 'emerging'
    
    def test_classify_anomaly_none(self, service):
        """Testa casos sem anomalia relevante."""
        result = service._classify_anomaly(z_score=0.3, growth_rate=0.02)
        assert result is None
    
    def test_estimate_growth_rate_high_growth_sector(self, service):
        """Testa estimativa de taxa de crescimento para setores de alto crescimento."""
        rate = service._estimate_growth_rate('setor', 'Tecnologia e Software')
        assert 0.02 <= rate <= 0.04  # 2-4% semanal
    
    def test_estimate_growth_rate_medium_growth_sector(self, service):
        """Testa estimativa para setores de crescimento médio."""
        rate = service._estimate_growth_rate('setor', 'Comércio Varejista')
        assert 0.01 <= rate <= 0.02  # 1-2% semanal
    
    def test_estimate_growth_rate_large_state(self, service):
        """Testa estimativa para estados grandes."""
        rate = service._estimate_growth_rate('estado', 'São Paulo')
        assert 0.008 <= rate <= 0.015  # 0.8-1.5% semanal
    
    def test_prioritize_insights_ordering(self, service):
        """Testa ordenação de insights por score de prioridade."""
        insights = [
            {
                'z_score': 1.0,
                'absolute_change': 1000,
                'is_consistent_trend': True,
                'current_total': 100000
            },
            {
                'z_score': 2.5,  # Maior Z-score
                'absolute_change': 5000,
                'is_consistent_trend': True,
                'current_total': 500000
            },
            {
                'z_score': 0.5,
                'absolute_change': 500,
                'is_consistent_trend': False,
                'current_total': 50000
            }
        ]
        
        result = service._prioritize_insights(insights)
        
        # Verifica que está ordenado por score (maior primeiro)
        assert result[0]['z_score'] == 2.5
        assert result[1]['z_score'] == 1.0
        assert result[2]['z_score'] == 0.5
        
        # Verifica que scores foram calculados
        assert all('priority_score' in insight for insight in result)
    
    def test_enrich_with_recommendation_high_growth(self, service):
        """Testa geração de recomendação para crescimento excepcional."""
        insight = {
            'anomaly_type': 'high_growth',
            'titulo': 'Tecnologia',
            'growth_rate': 0.032,
            'absolute_change': 2500,
            'z_score': 2.45,
            'insight_key': 'setor_tecnologia',
            'metadata': {},
            'filters': {}
        }
        
        result = service._enrich_with_recommendation(insight)
        
        assert result['priority'] == 'high'
        assert result['emoji'] == '🚀'
        assert 'Tecnologia' in result['title']
        assert 'Crescimento' in result['title']
        assert '2500' in result['description'] or '2.500' in result['description']
        assert 'acima da média' in result['recommendation'].lower()
    
    def test_enrich_with_recommendation_attention(self, service):
        """Testa geração de recomendação para queda incomum."""
        insight = {
            'anomaly_type': 'attention',
            'titulo': 'Construção Civil',
            'growth_rate': -0.02,
            'absolute_change': -1200,
            'z_score': -1.8,
            'insight_key': 'setor_construcao',
            'metadata': {},
            'filters': {}
        }
        
        result = service._enrich_with_recommendation(insight)
        
        assert result['priority'] == 'medium'
        assert result['emoji'] == '⚠️'
        assert 'Queda' in result['title']
        assert 'incomum' in result['title'].lower() or 'Incomum' in result['title']
    
    def test_enrich_with_recommendation_emerging(self, service):
        """Testa geração de recomendação para setor emergente."""
        insight = {
            'anomaly_type': 'emerging',
            'titulo': 'Energia Solar',
            'growth_rate': 0.06,
            'absolute_change': 800,
            'z_score': 0.9,
            'insight_key': 'setor_energia_solar',
            'metadata': {},
            'filters': {}
        }
        
        result = service._enrich_with_recommendation(insight)
        
        assert result['priority'] == 'low'
        assert result['emoji'] == '💡'
        assert 'emergente' in result['title'].lower() or 'Emergente' in result['title']
        assert 'oportunidade' in result['recommendation'].lower()


class TestIntegration:
    """Testes de integração (requerem DB real ou mock mais complexo)."""
    
    @pytest.mark.skip(reason="Requer database configurado")
    def test_get_intelligent_insights_returns_data(self):
        """Testa fluxo completo de geração de insights."""
        # TODO: Implementar com database de teste
        pass
    
    @pytest.mark.skip(reason="Requer database configurado")
    def test_get_intelligent_insights_respects_limit(self):
        """Testa que parâmetro limit é respeitado."""
        # TODO: Implementar com database de teste
        pass


# Executar testes:
# pytest backend/tests/unit/test_intelligent_insights.py -v
