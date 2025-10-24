"""
Script de Teste - Models SQLAlchemy
Issue: 2.1.1 - Smart CNPJ Backend

Testa a importação e funcionalidade básica dos models criados.
"""
import sys
from pathlib import Path

# Adicionar backend ao path
backend_dir = Path(__file__).parent.parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import inspect
from app.core.database import engine, SessionLocal
from app.models import (
    Empresa,
    Estabelecimento,
    Socio,
    CNAE,
    SimplesNacional,
    NaturezaJuridica,
    QualificacaoSocio,
    MotivoSituacaoCadastral,
    Municipio,
    Pais,
    PesquisaCNPJ,
)


def test_models_structure():
    """Testa estrutura dos models"""
    print("\n" + "="*60)
    print("TESTE 1: Estrutura dos Models")
    print("="*60)
    
    models = [
        ("Empresa", Empresa),
        ("Estabelecimento", Estabelecimento),
        ("Socio", Socio),
        ("CNAE", CNAE),
        ("SimplesNacional", SimplesNacional),
        ("NaturezaJuridica", NaturezaJuridica),
        ("QualificacaoSocio", QualificacaoSocio),
        ("MotivoSituacaoCadastral", MotivoSituacaoCadastral),
        ("Municipio", Municipio),
        ("Pais", Pais),
        ("PesquisaCNPJ", PesquisaCNPJ),
    ]
    
    for name, model in models:
        mapper = inspect(model)
        schema = getattr(model.__table__, 'schema', 'public')
        table_name = model.__tablename__
        columns = [col.name for col in mapper.columns]
        
        print(f"\n✅ {name}")
        print(f"   Schema: {schema}")
        print(f"   Tabela: {table_name}")
        print(f"   Colunas: {len(columns)}")
        print(f"   Primary Keys: {[col.name for col in mapper.primary_key]}")


def test_database_connection():
    """Testa conexão com banco de dados"""
    print("\n" + "="*60)
    print("TESTE 2: Conexão com Banco de Dados")
    print("="*60)
    
    try:
        from sqlalchemy import text
        db = SessionLocal()
        
        # Testar conexão
        result = db.execute(text("SELECT 1"))
        print("\n✅ Conexão com banco estabelecida")
        
        # Testar schema cnpj
        result = db.execute(text("SELECT COUNT(*) FROM cnpj.empresas LIMIT 1"))
        count = result.scalar()
        print(f"✅ Schema 'cnpj' acessível - {count:,} empresas")
        
        # Testar schema public
        result = db.execute(text("SELECT COUNT(*) FROM public.users"))
        count = result.scalar()
        print(f"✅ Schema 'public' acessível - {count} usuários")
        
        db.close()
        
    except Exception as e:
        print(f"\n❌ Erro na conexão: {e}")
        return False
    
    return True


def test_query_empresa():
    """Testa query simples em Empresa"""
    print("\n" + "="*60)
    print("TESTE 3: Query em Empresa")
    print("="*60)
    
    try:
        db = SessionLocal()
        
        # Buscar primeira empresa
        empresa = db.query(Empresa).first()
        
        if empresa:
            print(f"\n✅ Query executada com sucesso")
            print(f"   CNPJ Básico: {empresa.cnpj_basico}")
            print(f"   Razão Social: {empresa.razao_social[:50]}...")
            print(f"   Capital Social: R$ {empresa.capital_social:,.2f}" if empresa.capital_social else "   Capital Social: N/A")
            print(f"   Porte: {empresa.porte_empresa}")
            
            # Testar relacionamento com estabelecimentos
            print(f"   Estabelecimentos: {len(empresa.estabelecimentos)} (lazy load)")
        else:
            print("\n⚠️  Nenhuma empresa encontrada")
        
        db.close()
        
    except Exception as e:
        print(f"\n❌ Erro na query: {e}")
        import traceback
        traceback.print_exc()


def test_query_estabelecimento():
    """Testa query em Estabelecimento com relacionamentos"""
    print("\n" + "="*60)
    print("TESTE 4: Query em Estabelecimento (com JOINs)")
    print("="*60)
    
    try:
        db = SessionLocal()
        
        # Buscar estabelecimento matriz ativo
        estabelecimento = db.query(Estabelecimento).filter(
            Estabelecimento.identificador_matriz_filial == '1',
            Estabelecimento.situacao_cadastral == '02'
        ).first()
        
        if estabelecimento:
            print(f"\n✅ Query executada com sucesso")
            print(f"   CNPJ Completo: {estabelecimento.cnpj_formatado}")
            print(f"   É Matriz: {estabelecimento.is_matriz}")
            print(f"   Nome Fantasia: {estabelecimento.nome_fantasia or 'N/A'}")
            print(f"   Endereço: {estabelecimento.endereco_completo}")
            print(f"   CEP: {estabelecimento.cep}")
            print(f"   Município: {estabelecimento.municipio_obj.descricao if estabelecimento.municipio_obj else 'N/A'}")
            print(f"   UF: {estabelecimento.uf}")
            print(f"   Email: {estabelecimento.correio_eletronico or 'N/A'}")
            
            # Testar relacionamento com empresa
            if estabelecimento.empresa:
                print(f"   Razão Social: {estabelecimento.empresa.razao_social[:50]}...")
        else:
            print("\n⚠️  Nenhum estabelecimento encontrado")
        
        db.close()
        
    except Exception as e:
        print(f"\n❌ Erro na query: {e}")
        import traceback
        traceback.print_exc()


def test_formatters():
    """Testa funções de formatação"""
    print("\n" + "="*60)
    print("TESTE 5: Funções de Formatação")
    print("="*60)
    
    from app.models.enums import (
        formatar_cnpj,
        formatar_cpf,
        formatar_cep,
        formatar_telefone,
        limpar_cnpj,
        get_porte_descricao,
        get_situacao_descricao,
        get_tipo_estabelecimento_descricao,
    )
    
    print("\n✅ Formatadores:")
    print(f"   CNPJ: {formatar_cnpj('12345678000190')}")
    print(f"   CPF: {formatar_cpf('12345678901')}")
    print(f"   CEP: {formatar_cep('13024500')}")
    print(f"   Telefone: {formatar_telefone('19', '991234567')}")
    print(f"   Limpar CNPJ: {limpar_cnpj('12.345.678/0001-90')}")
    
    print("\n✅ Descritores:")
    print(f"   Porte '01': {get_porte_descricao('01')}")
    print(f"   Situação '02': {get_situacao_descricao('02')}")
    print(f"   Tipo '1': {get_tipo_estabelecimento_descricao('1')}")


def main():
    """Executa todos os testes"""
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║" + " "*10 + "TESTE DE MODELS SQLALCHEMY - ISSUE 2.1.1" + " "*10 + "║")
    print("╚" + "="*58 + "╝")
    
    # Teste 1: Estrutura
    test_models_structure()
    
    # Teste 2: Conexão
    if not test_database_connection():
        print("\n❌ Abortando testes - Sem conexão com banco")
        return
    
    # Teste 3: Query Empresa
    test_query_empresa()
    
    # Teste 4: Query Estabelecimento
    test_query_estabelecimento()
    
    # Teste 5: Formatadores
    test_formatters()
    
    print("\n" + "="*60)
    print("✅ TODOS OS TESTES CONCLUÍDOS")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()
