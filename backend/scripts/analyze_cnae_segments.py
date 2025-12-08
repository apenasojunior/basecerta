"""
Script para análise de CNAEs e geração de segmentos simplificados
"""
import csv
import re
from collections import defaultdict
from typing import Dict, List, Tuple

# Mapeamento de palavras-chave para segmentos (EXPANDIDO)
SEGMENTOS_MAP = {
    "Agropecuária": [
        "cultivo", "plantio", "criação de", "produção de sementes", "produção de mudas",
        "apicultura", "pecuária", "agricultura", "florestal", "extração de madeira",
        "lavoura", "horticultura", "silvicultura", "pesca", "aquicultura", "caça",
        "criação de bovinos", "criação de frangos", "criação de suínos", "avicultura"
    ],
    "Indústria": [
        "fabricação", "manufatura", "produção de", "confecção", "tecelagem", 
        "metalúrgica", "siderúrgica", "fundição", "usinagem", "montagem",
        "transformação", "beneficiamento", "preparação de", "recondicionamento",
        "processamento", "moagem", "refino"
    ],
    "Construção": [
        "construção", "edificação", "obra", "reforma", "demolição",
        "terraplanagem", "pavimentação", "alvenaria", "fundação", "acabamento",
        "impermeabilização", "pintura de edifícios", "instalações", "carpintaria"
    ],
    "Comércio": [
        "comércio", "venda", "revenda", "atacado", "varejo", "distribuição",
        "representante comercial", "agente do comércio", "loja", "magazine"
    ],
    "Serviços": [
        "serviço", "manutenção", "reparação", "consultoria",
        "assessoria", "administração", "gestão", "apoio", "limpeza", "segurança",
        "locação", "aluguel de", "recuperação de"
    ],
    "Alimentação": [
        "restaurante", "lanchonete", "bar", "cantina", "fornecimento de alimentos",
        "catering", "buffet", "padaria", "confeitaria"
    ],
    "Saúde": [
        "saúde", "médico", "hospitalar", "clínica", "odontológico", "laboratório",
        "ambulatório", "pronto-socorro", "atendimento médico", "farmácia",
        "fisioterapia", "terapia", "diagnóstico", "tratamento"
    ],
    "Educação": [
        "educação", "ensino", "escola", "curso", "treinamento", "formação profissional",
        "creche", "pré-escola", "faculdade", "universidade", "instrução", "capacitação"
    ],
    "Tecnologia": [
        "desenvolvimento de programas", "software", "tecnologia da informação",
        "consultoria em TI", "suporte técnico", "hospedagem na internet", "web design",
        "programação", "sistemas de informação", "processamento de dados"
    ],
    "Transporte e Logística": [
        "transporte", "logística", "armazenamento", "carga", "passageiro",
        "táxi", "frete", "entrega", "correio", "navegação", "movimentação"
    ],
    "Financeiro": [
        "banco", "financeira", "crédito", "investimento", "seguro", "corretora",
        "previdência", "capitalização", "holding", "fundo de investimento",
        "cooperativa de crédito", "financiamento"
    ],
    "Imobiliário": [
        "imobiliária", "compra e venda de imóveis", "loteamento",
        "incorporação", "administração de imóveis", "corretagem"
    ],
    "Comunicação e Marketing": [
        "telecomunicação", "telefonia", "internet", "rádio", "televisão",
        "publicidade", "propaganda", "marketing", "edição", "impressão",
        "agência", "provedores"
    ],
    "Entretenimento e Cultura": [
        "cinema", "teatro", "show", "evento", "parque de diversão", "cassino",
        "produção cultural", "artístico", "musical", "espetáculo", "recreação",
        "atividades recreativas", "jogos", "loteria", "apostas"
    ],
    "Turismo e Hotelaria": [
        "hotel", "pousada", "albergue", "resort", "agência de viagem",
        "operadora turística", "hospedagem", "apart-hotel"
    ],
    "Beleza e Estética": [
        "cabeleireiro", "salão de beleza", "estética", "manicure", "spa",
        "atividades de estética", "barbearia"
    ],
    "Energia e Utilidades": [
        "geração de energia", "distribuição de energia", "energia elétrica",
        "energia solar", "energia eólica", "gás", "água", "saneamento",
        "tratamento de água", "esgoto"
    ],
    "Mineração": [
        "extração de", "mineração", "minério", "pedreira", "garimpo",
        "exploração", "lavra"
    ],
    "Serviços Profissionais": [
        "advocacia", "contabilidade", "auditoria", "engenharia",
        "arquitetura", "design", "jurídico", "perícia", "consultoria jurídica",
        "consultoria contábil"
    ],
    "Meio Ambiente e Reciclagem": [
        "coleta de resíduos", "reciclagem", "tratamento de resíduos",
        "recuperação de materiais", "limpeza urbana", "descontaminação",
        "remediação", "gestão de resíduos", "esgoto", "conservação"
    ],
    "Editorial e Gráfica": [
        "edição de livros", "edição de jornais", "edição de revistas",
        "impressão de", "gráfica", "reprodução"
    ],
    "Vestuário e Têxtil": [
        "confecção de", "fabricação de vestuário", "fabricação de calçados",
        "fabricação de artigos do vestuário", "tecelagem", "malharia",
        "estamparia"
    ],
    "Aluguel e Locação": [
        "aluguel de", "locação de", "arrendamento", "leasing"
    ],
    "Assistência Social": [
        "assistencial", "ação social", "orfanato", "abrigo", "asilo"
    ],
    "Administração Pública": [
        "administração pública", "defesa", "seguridade social", "justiça",
        "tribunais", "relações exteriores"
    ],
    "Organizações e Associações": [
        "associação", "sindicato", "organização", "federação", "confederação",
        "entidades associativas", "religiosa", "político-partidária"
    ],
    "Outros": []  # Catch-all
}


def categorizar_cnae(descricao: str) -> str:
    """
    Categoriza um CNAE baseado em sua descrição
    """
    descricao_lower = descricao.lower()
    
    # Pontuação para cada segmento
    pontos = defaultdict(int)
    
    for segmento, palavras_chave in SEGMENTOS_MAP.items():
        if segmento == "Outros":
            continue
            
        for palavra in palavras_chave:
            if palavra in descricao_lower:
                # Palavras no início da descrição têm mais peso
                if descricao_lower.startswith(palavra):
                    pontos[segmento] += 3
                else:
                    pontos[segmento] += 1
    
    # Regras específicas para melhor precisão
    
    # ========================================
    # REGRAS PRIORITÁRIAS (mais específicas)
    # ========================================
    
    # Agropecuária - atividades relacionadas
    if any(x in descricao_lower for x in ["pós-colheita", "colheita", "coleta de castanha", 
           "coleta de látex", "coleta de palmito", "cultivo", "criação de", "plantio",
           "produção de mudas", "produção de sementes", "atividades de apoio à agricultura",
           "atividades de apoio à pecuária", "extração de madeira em florestas"]):
        pontos["Agropecuária"] += 6
    
    # Pesca e aquicultura - sempre agropecuária
    if any(x in descricao_lower for x in ["pesca", "aquicultura", "aqüicultura", 
           "criação de peixes", "criação de camarões", "piscicultura"]):
        pontos["Agropecuária"] += 6
    
    # Comércio vs Indústria (muito importante)
    if "fabricação" in descricao_lower:
        pontos["Indústria"] += 5
    elif "comércio" in descricao_lower:
        pontos["Comércio"] += 5
    
    # Evitar confusão entre manutenção e indústria
    if "manutenção" in descricao_lower or "reparação" in descricao_lower:
        pontos["Serviços"] += 4
        pontos["Indústria"] = max(0, pontos["Indústria"] - 2)
    
    # Instalação é serviço, não indústria
    if "instalação" in descricao_lower and "fabricação" not in descricao_lower:
        pontos["Serviços"] += 3
    
    # Reciclagem e resíduos
    if any(x in descricao_lower for x in ["reciclagem", "resíduo", "lixo", "coleta de resíduos",
           "tratamento de resíduos", "recuperação de materiais", "usina de compostagem"]):
        pontos["Meio Ambiente e Reciclagem"] += 6
    
    # Editorial vs Indústria
    if "edição de" in descricao_lower or "editora" in descricao_lower:
        pontos["Editorial e Gráfica"] += 5
        pontos["Indústria"] = 0
    
    # Impressão gráfica
    if "impressão de" in descricao_lower:
        pontos["Editorial e Gráfica"] += 4
    
    # Vestuário
    if any(x in descricao_lower for x in ["vestuário", "roupa", "confecção de", "calçado",
           "fabricação de calçados", "fabricação de meias"]):
        pontos["Vestuário e Têxtil"] += 5
    
    # Aluguel/Locação - muito específico
    if descricao_lower.startswith("aluguel") or descricao_lower.startswith("locação") or "arrendamento" in descricao_lower:
        pontos["Aluguel e Locação"] += 6
    
    # Assistência social
    if any(x in descricao_lower for x in ["assistencial", "abrigo", "orfanato", "asilo"]):
        pontos["Assistência Social"] += 6
    
    # Administração pública
    if any(x in descricao_lower for x in ["administração pública", "defesa civil", 
           "relações exteriores", "segurança pública", "tribunais"]):
        pontos["Administração Pública"] += 6
    
    # Organizações
    if any(x in descricao_lower for x in ["associação de", "sindicato", "organização religiosa",
           "organização sindical", "federação", "confederação"]):
        pontos["Organizações e Associações"] += 6
    
    # Transporte
    if "transporte" in descricao_lower:
        pontos["Transporte e Logística"] += 4
    
    # Água e saneamento
    if any(x in descricao_lower for x in ["água", "esgoto", "saneamento", "captação",
           "tratamento de água", "distribuição de água"]):
        pontos["Energia e Utilidades"] += 5
    
    # Petróleo e gás
    if "petróleo" in descricao_lower or "gás natural" in descricao_lower:
        pontos["Energia e Utilidades"] += 5
        pontos["Mineração"] = max(0, pontos["Mineração"] - 2)
    
    # Atividades financeiras específicas
    if any(x in descricao_lower for x in ["banco", "seguradora", "corretora de valores",
           "fundo de investimento", "cooperativa de crédito"]):
        pontos["Financeiro"] += 5
    
    # Saúde - reforçar
    if any(x in descricao_lower for x in ["hospital", "clínica", "médico", "laboratório",
           "uti", "pronto-socorro", "ambulatório", "odontológico"]):
        pontos["Saúde"] += 5
    
    # Educação - reforçar
    if any(x in descricao_lower for x in ["escola", "ensino", "educação", "creche",
           "faculdade", "universidade", "curso de"]):
        pontos["Educação"] += 5
    
    # Construção - casos específicos
    if any(x in descricao_lower for x in ["construção de", "obra de", "instalação de",
           "reforma de", "demolição", "terraplanagem", "fundação"]):
        pontos["Construção"] += 5
    
    # Serviços domésticos
    if "serviço doméstico" in descricao_lower or "empregado doméstico" in descricao_lower:
        pontos["Serviços"] += 6
    
    # Joias, bijuterias e gemas
    if any(x in descricao_lower for x in ["lapidação", "joalheria", "ourivesaria", 
           "bijuteria", "gemas", "pedras preciosas"]):
        pontos["Indústria"] += 5
    
    # Alimentação - restaurantes e bares
    if any(x in descricao_lower for x in ["restaurante", "lanchonete", "bar ", "cantina",
           "buffet", "catering"]):
        pontos["Alimentação"] += 6
    
    # Se encontrou alguma categoria
    if pontos:
        return max(pontos.items(), key=lambda x: x[1])[0]
    
    return "Outros"


def analisar_cnaes(csv_path: str) -> List[Tuple[str, str, str]]:
    """
    Analisa todos os CNAEs e retorna lista com (codigo, descricao, segmento)
    """
    resultados = []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        # Remove as aspas triplas do CSV
        conteudo = f.read().replace('"""', '"')
        
        reader = csv.DictReader(conteudo.splitlines())
        
        for row in reader:
            codigo = row['codigo'].strip('"')
            descricao = row['descricao'].strip('"')
            
            segmento = categorizar_cnae(descricao)
            
            resultados.append((codigo, descricao, segmento))
    
    return resultados


def gerar_relatorio(resultados: List[Tuple[str, str, str]], output_path: str):
    """
    Gera arquivo CSV com os resultados
    """
    with open(output_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['codigo', 'descricao', 'segmento'])
        
        for codigo, descricao, segmento in resultados:
            writer.writerow([codigo, descricao, segmento])
    
    print(f"✅ Arquivo gerado: {output_path}")


def gerar_estatisticas(resultados: List[Tuple[str, str, str]]):
    """
    Gera estatísticas sobre a distribuição de segmentos
    """
    contagem = defaultdict(int)
    
    for _, _, segmento in resultados:
        contagem[segmento] += 1
    
    print("\n" + "="*60)
    print("ESTATÍSTICAS DE SEGMENTOS")
    print("="*60)
    
    total = len(resultados)
    
    # Ordena por quantidade
    for segmento, qtd in sorted(contagem.items(), key=lambda x: x[1], reverse=True):
        percentual = (qtd / total) * 100
        print(f"{segmento:30} {qtd:5} ({percentual:5.2f}%)")
    
    print("-"*60)
    print(f"{'TOTAL':30} {total:5} (100.00%)")
    print("="*60)


def gerar_exemplos_por_segmento(resultados: List[Tuple[str, str, str]], n: int = 5):
    """
    Mostra exemplos de CNAEs para cada segmento
    """
    exemplos = defaultdict(list)
    
    for codigo, descricao, segmento in resultados:
        if len(exemplos[segmento]) < n:
            exemplos[segmento].append((codigo, descricao))
    
    print("\n" + "="*80)
    print("EXEMPLOS POR SEGMENTO")
    print("="*80)
    
    for segmento in sorted(exemplos.keys()):
        print(f"\n📁 {segmento.upper()}")
        print("-"*80)
        for codigo, descricao in exemplos[segmento]:
            print(f"  {codigo} - {descricao}")


def gerar_sql_migration(resultados: List[Tuple[str, str, str]], output_path: str):
    """
    Gera script SQL para adicionar coluna e atualizar dados
    """
    sql = """-- ========================================
-- Migration: Adicionar coluna 'segmento' na tabela cnae
-- Data: 2025-10-24
-- ========================================

-- 1. Adicionar coluna 'segmento'
ALTER TABLE cnpj.cnae 
ADD COLUMN IF NOT EXISTS segmento VARCHAR(50);

-- 2. Criar índice para melhor performance nas buscas
CREATE INDEX IF NOT EXISTS idx_cnae_segmento ON cnpj.cnae(segmento);

-- 3. Atualizar todos os registros com os segmentos
"""
    
    # Agrupa por segmento para fazer UPDATEs eficientes
    por_segmento = defaultdict(list)
    for codigo, _, segmento in resultados:
        por_segmento[segmento].append(codigo)
    
    for segmento, codigos in sorted(por_segmento.items()):
        sql += f"\n-- {segmento} ({len(codigos)} CNAEs)\n"
        
        # Divide em lotes de 500 para não criar queries muito longas
        batch_size = 500
        for i in range(0, len(codigos), batch_size):
            batch = codigos[i:i + batch_size]
            codigos_str = "', '".join(batch)
            sql += f"UPDATE cnpj.cnae SET segmento = '{segmento}' WHERE codigo IN ('{codigos_str}');\n"
    
    sql += """
-- 4. Validar resultados
SELECT segmento, COUNT(*) as total 
FROM cnpj.cnae 
GROUP BY segmento 
ORDER BY total DESC;

-- 5. Verificar se algum CNAE ficou sem segmento
SELECT COUNT(*) as sem_segmento 
FROM cnpj.cnae 
WHERE segmento IS NULL;

-- ========================================
-- FIM DA MIGRATION
-- ========================================
"""
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(sql)
    
    print(f"✅ Script SQL gerado: {output_path}")


if __name__ == "__main__":
    print("🚀 Iniciando análise de CNAEs...")
    
    csv_input = "/Users/linkerx/Documents/ADACODE/basecerta/docs/cnaes.csv"
    csv_output = "/Users/linkerx/Documents/ADACODE/basecerta/backend/scripts/cnaes_com_segmento.csv"
    sql_output = "/Users/linkerx/Documents/ADACODE/basecerta/backend/scripts/04_add_segmento_cnae.sql"
    
    # Analisar CNAEs
    resultados = analisar_cnaes(csv_input)
    
    # Gerar relatório CSV
    gerar_relatorio(resultados, csv_output)
    
    # Gerar estatísticas
    gerar_estatisticas(resultados)
    
    # Mostrar exemplos
    gerar_exemplos_por_segmento(resultados, n=5)
    
    # Gerar migration SQL
    gerar_sql_migration(resultados, sql_output)
    
    print("\n✅ Análise concluída!")
    print(f"\n📊 Revise os resultados:")
    print(f"   - CSV: {csv_output}")
    print(f"   - SQL: {sql_output}")
