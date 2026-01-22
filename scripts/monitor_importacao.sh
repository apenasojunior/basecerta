#!/bin/bash
#
# Monitor de Progresso da Importação CNPJ
#

clear
echo "🔄 Monitorando importação CNPJ - Ctrl+C para sair"
echo "================================================================"
echo

while true; do
    # Timestamp
    echo -e "\n📅 $(date '+%H:%M:%S')"
    echo "----------------------------------------------------------------"
    
    # Verificar se processo está rodando
    if ps aux | grep -q "[i]mport_cnpj.py"; then
        echo "✅ Processo: RODANDO"
    else
        echo "⚠️  Processo: PARADO"
    fi
    
    # Contagem de registros
    echo -e "\n📊 Registros importados:"
    psql -U aian_db -d basecerta -t -c "
    SELECT 
        '  Empresas: ' || LPAD(COUNT(*)::text, 12) as dados
    FROM cnpj_brasil.empresas
    UNION ALL
    SELECT 
        '  Estabelecimentos: ' || LPAD(COUNT(*)::text, 12)
    FROM cnpj_brasil.estabelecimentos
    UNION ALL
    SELECT 
        '  Simples: ' || LPAD(COUNT(*)::text, 12)
    FROM cnpj_brasil.simples_nacional
    UNION ALL
    SELECT 
        '  Sócios: ' || LPAD(COUNT(*)::text, 12)
    FROM cnpj_brasil.socios;
    "
    
    # Tamanho do banco
    echo -e "\n💾 Tamanho do banco:"
    psql -U aian_db -d basecerta -t -c "
    SELECT '  Total: ' || pg_size_pretty(pg_database_size('basecerta'));
    "
    
    # Query ativa
    echo -e "\n🔧 Query atual:"
    QUERY=$(psql -U aian_db -d basecerta -t -c "
    SELECT COALESCE(LEFT(query, 80), 'Nenhuma query ativa')
    FROM pg_stat_activity 
    WHERE datname = 'basecerta' 
      AND state = 'active' 
      AND query NOT LIKE '%pg_stat_activity%'
    LIMIT 1;
    " 2>/dev/null)
    
    if [ -z "$QUERY" ]; then
        echo "  Aguardando próximo batch..."
    else
        echo "  $QUERY"
    fi
    
    echo -e "\n================================================================"
    echo "Próxima atualização em 30 segundos..."
    
    sleep 30
    clear
    echo "🔄 Monitorando importação CNPJ - Ctrl+C para sair"
    echo "================================================================"
done
