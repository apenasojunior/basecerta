# Sprint: IMPORTA_HASH - Importação Incremental Inteligente

**Data de Criação:** 22/01/2026  
**Status:** 📋 Planejamento  
**Prioridade:** Alta  
**Estimativa:** 3-5 dias  
**Início Previsto:** Após conclusão da importação inicial (dez/2025)

---

## 📊 CONTEXTO E PROBLEMA

### Situação Atual
- **Importação mensal:** 6-8 horas para processar ~65M empresas + 190M estabelecimentos
- **Estratégia:** TRUNCATE temp tables → COPY → MERGE completo
- **Ineficiência:** ~97% dos dados são IGUAIS entre meses consecutivos
- **Desperdício:** Reprocessamos ~63M empresas que não mudaram nada

### Volume de Mudanças Mensais (estimado)
| Tipo de Mudança | Quantidade/Mês | % da Base |
|-----------------|----------------|-----------|
| Novos CNPJs | ~200k | 0.3% |
| Alterações cadastrais | ~500k-1M | 1-2% |
| Mudanças de situação | ~300k | 0.5% |
| **TOTAL IMPACTADO** | **~1-2M** | **1.5-3%** |

### Ganho Esperado
- ⏱️ **Redução de tempo:** De 6-8h para **1-2h** (70-80% mais rápido)
- 💾 **Redução de I/O:** Processar 2M em vez de 65M registros
- 🎯 **Inteligência:** Saber QUAIS dados mudaram e QUANDO

---

## 🎯 OBJETIVOS DA SPRINT

1. ✅ Implementar sistema de hash para detectar mudanças
2. ✅ Adicionar colunas de controle (hash, data_atualizacao)
3. ✅ Modificar script de importação para modo incremental
4. ✅ Criar queries de análise de mudanças
5. ✅ Manter compatibilidade com importação full (primeira vez)
6. ✅ Documentar processo de atualização mensal otimizado

---

## 🗄️ MUDANÇAS NO SCHEMA

### 1. Adicionar Colunas de Controle

```sql
-- Empresas
ALTER TABLE cnpj_brasil.empresas 
ADD COLUMN IF NOT EXISTS hash_dados VARCHAR(32),
ADD COLUMN IF NOT EXISTS data_ultima_atualizacao TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS versao_importacao VARCHAR(10); -- Ex: "2026-02"

CREATE INDEX idx_empresas_hash ON cnpj_brasil.empresas(hash_dados);
CREATE INDEX idx_empresas_atualizacao ON cnpj_brasil.empresas(data_ultima_atualizacao);

-- Estabelecimentos
ALTER TABLE cnpj_brasil.estabelecimentos 
ADD COLUMN IF NOT EXISTS hash_dados VARCHAR(32),
ADD COLUMN IF NOT EXISTS data_ultima_atualizacao TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS versao_importacao VARCHAR(10);

CREATE INDEX idx_estabelec_hash ON cnpj_brasil.estabelecimentos(hash_dados);
CREATE INDEX idx_estabelec_atualizacao ON cnpj_brasil.estabelecimentos(data_ultima_atualizacao);

-- Socios
ALTER TABLE cnpj_brasil.socios 
ADD COLUMN IF NOT EXISTS hash_dados VARCHAR(32),
ADD COLUMN IF NOT EXISTS data_ultima_atualizacao TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS versao_importacao VARCHAR(10);

CREATE INDEX idx_socios_hash ON cnpj_brasil.socios(hash_dados);
CREATE INDEX idx_socios_atualizacao ON cnpj_brasil.socios(data_ultima_atualizacao);

-- Simples Nacional: NÃO precisa hash (pequena, muitas mudanças, truncar é mais rápido)
ALTER TABLE cnpj_brasil.simples_nacional
ADD COLUMN IF NOT EXISTS versao_importacao VARCHAR(10);
```

### 2. Tabela de Auditoria (Histórico de Mudanças)

**⚠️ IMPORTANTE: Análise de Tamanho**

Estimativa de crescimento mensal:
- ~1-2M mudanças/mês × 12 meses = **12-24M registros/ano**
- Tamanho médio por registro: ~200 bytes
- **Crescimento anual: ~3-5 GB**
- Em 5 anos: ~15-25 GB (aceitável)

**Estratégia de Retenção:**
- Manter 24 meses de histórico (2 anos)
- Purge automático de registros > 24 meses
- Ou usar particionamento por mês

```sql
-- Versão 1: Simples (sem particionamento)
CREATE TABLE IF NOT EXISTS cnpj_brasil.mudancas_historico (
    id BIGSERIAL PRIMARY KEY,
    versao VARCHAR(10) NOT NULL,
    tabela VARCHAR(50) NOT NULL,
    tipo_operacao VARCHAR(10) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    cnpj_basico VARCHAR(8),
    cnpj_completo VARCHAR(14),
    campos_alterados JSONB, -- Armazena: {"capital_social": {"de": "10000", "para": "50000"}}
    hash_anterior VARCHAR(32),
    hash_novo VARCHAR(32),
    data_mudanca TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mudancas_versao ON cnpj_brasil.mudancas_historico(versao);
CREATE INDEX idx_mudancas_cnpj ON cnpj_brasil.mudancas_historico(cnpj_basico);
CREATE INDEX idx_mudancas_tabela ON cnpj_brasil.mudancas_historico(tabela, versao);
CREATE INDEX idx_mudancas_data ON cnpj_brasil.mudancas_historico(data_mudanca);
CREATE INDEX idx_mudancas_tipo ON cnpj_brasil.mudancas_historico(tipo_operacao);

-- Índice GIN para buscar em campos alterados específicos
CREATE INDEX idx_mudancas_campos ON cnpj_brasil.mudancas_historico USING GIN (campos_alterados);

-- Versão 2: Com Particionamento (RECOMENDADO para longo prazo)
CREATE TABLE IF NOT EXISTS cnpj_brasil.mudancas_historico (
    id BIGSERIAL,
    versao VARCHAR(10) NOT NULL,
    tabela VARCHAR(50) NOT NULL,
    tipo_operacao VARCHAR(10) NOT NULL,
    cnpj_basico VARCHAR(8),
    cnpj_completo VARCHAR(14),
    campos_alterados JSONB,
    hash_anterior VARCHAR(32),
    hash_novo VARCHAR(32),
    data_mudanca TIMESTAMP DEFAULT NOW()
) PARTITION BY RANGE (data_mudanca);

-- Criar partições para os próximos 6 meses (exemplo)
CREATE TABLE cnpj_brasil.mudancas_202601 PARTITION OF cnpj_brasil.mudancas_historico
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE cnpj_brasil.mudancas_202602 PARTITION OF cnpj_brasil.mudancas_historico
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

CREATE TABLE cnpj_brasil.mudancas_202603 PARTITION OF cnpj_brasil.mudancas_historico
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

-- Índices nas partições
CREATE INDEX idx_mudancas_202601_versao ON cnpj_brasil.mudancas_202601(versao);
CREATE INDEX idx_mudancas_202601_cnpj ON cnpj_brasil.mudancas_202601(cnpj_basico);

-- Script para criar partição automaticamente (executar todo mês)
CREATE OR REPLACE FUNCTION cnpj_brasil.criar_particao_mudancas(mes DATE)
RETURNS VOID AS $$
DECLARE
    table_name TEXT;
    start_date DATE;
    end_date DATE;
BEGIN
    table_name := 'mudancas_' || TO_CHAR(mes, 'YYYYMM');
    start_date := DATE_TRUNC('month', mes);
    end_date := start_date + INTERVAL '1 month';
    
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS cnpj_brasil.%I PARTITION OF cnpj_brasil.mudancas_historico
         FOR VALUES FROM (%L) TO (%L)',
        table_name, start_date, end_date
    );
    
    EXECUTE format('CREATE INDEX idx_%I_versao ON cnpj_brasil.%I(versao)', table_name, table_name);
    EXECUTE format('CREATE INDEX idx_%I_cnpj ON cnpj_brasil.%I(cnpj_basico)', table_name, table_name);
    EXECUTE format('CREATE INDEX idx_%I_campos ON cnpj_brasil.%I USING GIN (campos_alterados)', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Uso: SELECT cnpj_brasil.criar_particao_mudancas('2026-04-01');
```

**Política de Retenção Automática:**

```sql
-- Função para remover partições antigas
CREATE OR REPLACE FUNCTION cnpj_brasil.purge_mudancas_antigas(meses_retencao INT DEFAULT 24)
RETURNS VOID AS $$
DECLARE
    partition_name TEXT;
    cutoff_date DATE;
BEGIN
    cutoff_date := CURRENT_DATE - (meses_retencao || ' months')::INTERVAL;
    
    FOR partition_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'cnpj_brasil' 
          AND tablename LIKE 'mudancas_%'
          AND tablename < 'mudancas_' || TO_CHAR(cutoff_date, 'YYYYMM')
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS cnpj_brasil.%I', partition_name);
        RAISE NOTICE 'Partição removida: %', partition_name;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Agendar no cron mensal: SELECT cnpj_brasil.purge_mudancas_antigas(24);
```

**Exemplos de Uso da Tabela de Histórico:**

```sql
-- 1. Histórico completo de uma empresa
SELECT 
    versao,
    tipo_operacao,
    campos_alterados,
    data_mudanca
FROM cnpj_brasil.mudancas_historico
WHERE cnpj_basico = '12345678'
ORDER BY data_mudanca DESC;

-- 2. Empresas que aumentaram capital no último trimestre
SELECT 
    cnpj_basico,
    campos_alterados->'capital_social'->>'de' as capital_anterior,
    campos_alterados->'capital_social'->>'para' as capital_novo,
    data_mudanca
FROM cnpj_brasil.mudancas_historico
WHERE campos_alterados ? 'capital_social'
  AND data_mudanca >= CURRENT_DATE - INTERVAL '3 months'
  AND (campos_alterados->'capital_social'->>'para')::NUMERIC > 
      (campos_alterados->'capital_social'->>'de')::NUMERIC;

-- 3. Mudanças de endereço (estabelecimentos)
SELECT 
    cnpj_completo,
    campos_alterados->'logradouro'->>'de' as endereco_anterior,
    campos_alterados->'logradouro'->>'para' as endereco_novo,
    data_mudanca
FROM cnpj_brasil.mudancas_historico
WHERE tabela = 'estabelecimentos'
  AND campos_alterados ? 'logradouro'
  AND versao = '2026-02';

-- 4. Estatísticas de tipos de mudança por mês
SELECT 
    versao,
    tabela,
    tipo_operacao,
    COUNT(*) as total,
    COUNT(DISTINCT cnpj_basico) as cnpjs_unicos
FROM cnpj_brasil.mudancas_historico
GROUP BY versao, tabela, tipo_operacao
ORDER BY versao DESC, total DESC;

-- 5. CNPJs com mais mudanças (possíveis suspeitos de fraude)
SELECT 
    cnpj_basico,
    COUNT(*) as total_mudancas,
    ARRAY_AGG(DISTINCT versao ORDER BY versao DESC) as meses,
    STRING_AGG(DISTINCT tipo_operacao, ', ') as operacoes
FROM cnpj_brasil.mudancas_historico
WHERE data_mudanca >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY cnpj_basico
HAVING COUNT(*) > 10  -- Mais de 10 mudanças em 6 meses
ORDER BY total_mudancas DESC;
```

**Decisão de Implementação:**

- ✅ **IMPLEMENTAR** se você quer:
  - Rastreabilidade completa de mudanças
  - Análise de tendências temporais
  - Compliance/auditoria
  - Detecção de anomalias
  
- ⚠️ **AVALIAR DEPOIS** se:
  - Quer focar apenas em performance da importação
  - Espaço em disco é crítico
  - Não precisa de histórico (apenas estado atual)

**Recomendação:** 
- Implementar **sem particionamento** inicialmente
- Se crescer muito (>10GB), migrar para versão particionada
- Incluir na sprint mas como **fase opcional** (após importação incremental funcionar)

---

## 🔧 MUDANÇAS NO `import_cnpj.py`

### 1. Adicionar Função de Hash

```python
import hashlib

def calcular_hash_empresa(row: Dict) -> str:
    """
    Calcula hash MD5 dos campos relevantes da empresa.
    Apenas campos que realmente mudam são incluídos.
    """
    campos_relevantes = [
        row.get('razao_social', ''),
        row.get('natureza_juridica', ''),
        row.get('qualificacao_responsavel', ''),
        row.get('capital_social', ''),
        row.get('porte', ''),
    ]
    texto = '|'.join(str(c) for c in campos_relevantes)
    return hashlib.md5(texto.encode('utf-8')).hexdigest()

def calcular_hash_estabelecimento(row: Dict) -> str:
    """
    Calcula hash dos campos relevantes do estabelecimento.
    Foca em campos que mudam frequentemente.
    """
    campos_relevantes = [
        row.get('identificador_matriz_filial', ''),
        row.get('nome_fantasia', ''),
        row.get('situacao_cadastral', ''),
        row.get('data_situacao_cadastral', ''),
        row.get('data_inicio_atividade', ''),
        row.get('cnae_fiscal_principal', ''),
        row.get('cnae_fiscal_secundaria', ''),
        row.get('tipo_logradouro', ''),
        row.get('logradouro', ''),
        row.get('numero', ''),
        row.get('complemento', ''),
        row.get('bairro', ''),
        row.get('cep', ''),
        row.get('uf', ''),
        row.get('municipio', ''),
        row.get('ddd1', ''),
        row.get('telefone1', ''),
        row.get('email', ''),
        row.get('situacao_especial', ''),
        row.get('data_situacao_especial', ''),
    ]
    texto = '|'.join(str(c) for c in campos_relevantes)
    return hashlib.md5(texto.encode('utf-8')).hexdigest()

def calcular_hash_socio(row: Dict) -> str:
    """Calcula hash dos campos do sócio."""
    campos_relevantes = [
        row.get('identificador_socio', ''),
        row.get('nome_socio', ''),
        row.get('cpf_cnpj_socio', ''),
        row.get('qualificacao_socio', ''),
        row.get('data_entrada_sociedade', ''),
        row.get('pais', ''),
        row.get('representante_legal', ''),
        row.get('nome_representante', ''),
        row.get('qualificacao_representante', ''),
        row.get('faixa_etaria', ''),
    ]
    texto = '|'.join(str(c) for c in campos_relevantes)
    return hashlib.md5(texto.encode('utf-8')).hexdigest()
```

### 2. Modificar `extrair_e_copiar` para Calcular Hash

```python
def extrair_e_copiar(self, zip_path: Path, temp_table: str, estrutura: Dict):
    """
    Extrai CSV do ZIP e faz COPY para tabela temporária.
    NOVO: Calcula hash_dados para cada registro.
    """
    # ... código existente ...
    
    # Determinar função de hash baseado na tabela
    if 'empresas' in temp_table.lower():
        hash_func = calcular_hash_empresa
    elif 'estabelecimentos' in temp_table.lower():
        hash_func = calcular_hash_estabelecimento
    elif 'socios' in temp_table.lower():
        hash_func = calcular_hash_socio
    else:
        hash_func = None  # Simples não usa hash
    
    # Processar linha por linha
    lines = []
    for line in content.split('\n'):
        if not line.strip():
            continue
        
        campos = line.split(';', num_colunas - 1)
        
        # ... tratamento de datas e valores ...
        
        # Calcular hash se aplicável
        if hash_func:
            row_dict = dict(zip(estrutura['colunas'], campos))
            hash_valor = hash_func(row_dict)
            campos.append(hash_valor)  # Adicionar hash no final
            campos.append(self.versao)  # Adicionar versão
        
        lines.append(';'.join(campos))
    
    # ... resto do código ...
```

### 3. MERGE Inteligente (Atualiza Só o Que Mudou)

```python
def merge_to_production(self, temp_table: str, estrutura: Dict):
    """
    MERGE otimizado: UPDATE apenas se hash mudou.
    """
    tabela_destino = estrutura['tabela_destino']
    colunas = estrutura['colunas']
    pk = estrutura['chave_primaria']
    
    # Simples Nacional: sempre TRUNCATE + INSERT (tabela pequena)
    if 'simples' in tabela_destino.lower():
        self.logger.info(f"  Simples Nacional: TRUNCATE + INSERT")
        self.cursor.execute(f"TRUNCATE {tabela_destino}")
        self.cursor.execute(f"""
            INSERT INTO {tabela_destino} 
            SELECT * FROM {temp_table}
        """)
        self.conn.commit()
        return
    
    # Outras tabelas: MERGE com hash
    cols_str = ', '.join(colunas + ['hash_dados', 'versao_importacao'])
    
    # UPDATE SET clause (todos exceto PK)
    update_cols = [c for c in colunas if c not in pk.strip('()').split(',')]
    update_set = ', '.join([
        f"{col} = EXCLUDED.{col}" for col in update_cols
    ])
    
    merge_sql = f"""
    INSERT INTO {tabela_destino} ({cols_str}, data_ultima_atualizacao)
    SELECT {cols_str}, NOW()
    FROM {temp_table}
    ON CONFLICT {pk} DO UPDATE
    SET 
        {update_set},
        hash_dados = EXCLUDED.hash_dados,
        versao_importacao = EXCLUDED.versao_importacao,
        data_ultima_atualizacao = NOW()
    WHERE {tabela_destino}.hash_dados IS DISTINCT FROM EXCLUDED.hash_dados
    """
    
    self.logger.info(f"  MERGE com detecção de mudanças via hash")
    self.cursor.execute(merge_sql)
    
    rows_affected = self.cursor.rowcount
    self.conn.commit()
    
    self.logger.info(f"  ✅ {rows_affected:,} registros inseridos/atualizados")
    
    # Contar novos vs atualizados
    self.cursor.execute(f"""
        SELECT 
            COUNT(*) FILTER (WHERE data_ultima_atualizacao >= NOW() - INTERVAL '1 minute') as recentes,
            COUNT(*) as total
        FROM {tabela_destino}
        WHERE versao_importacao = %s
    """, (self.versao,))
    
    stats = self.cursor.fetchone()
    self.logger.info(f"     Novos/Atualizados: {stats[0]:,} | Total na base: {stats[1]:,}")
```

### 4. Adicionar Flag `--mode` no Script

```python
def main():
    # ... parsing de argumentos ...
    
    # Novo argumento: --mode [full|incremental]
    import_mode = 'incremental'  # Padrão
    if '--mode' in sys.argv:
        idx = sys.argv.index('--mode')
        if idx + 1 < len(sys.argv):
            import_mode = sys.argv[idx + 1]
    
    # Se é primeira importação ou explicitamente full, desabilitar hash
    if import_mode == 'full':
        print("⚠️  Modo FULL: Reprocessando toda a base (sem otimização de hash)")
    else:
        print("✅ Modo INCREMENTAL: Atualizando apenas registros modificados")
    
    importador = ImportadorCNPJ(versao, mode=import_mode)
    importador.executar_importacao_completa()
```

---

## 📊 QUERIES DE ANÁLISE

### 1. Estatísticas de Mudanças

```sql
-- Total de mudanças na última importação
SELECT 
    'Empresas' as tabela,
    COUNT(*) FILTER (WHERE data_ultima_atualizacao >= NOW() - INTERVAL '1 day') as mudancas_24h,
    COUNT(*) as total,
    ROUND(100.0 * COUNT(*) FILTER (WHERE data_ultima_atualizacao >= NOW() - INTERVAL '1 day') / COUNT(*), 2) as percentual
FROM cnpj_brasil.empresas

UNION ALL

SELECT 
    'Estabelecimentos',
    COUNT(*) FILTER (WHERE data_ultima_atualizacao >= NOW() - INTERVAL '1 day'),
    COUNT(*),
    ROUND(100.0 * COUNT(*) FILTER (WHERE data_ultima_atualizacao >= NOW() - INTERVAL '1 day') / COUNT(*), 2)
FROM cnpj_brasil.estabelecimentos

UNION ALL

SELECT 
    'Sócios',
    COUNT(*) FILTER (WHERE data_ultima_atualizacao >= NOW() - INTERVAL '1 day'),
    COUNT(*),
    ROUND(100.0 * COUNT(*) FILTER (WHERE data_ultima_atualizacao >= NOW() - INTERVAL '1 day') / COUNT(*), 2)
FROM cnpj_brasil.socios;
```

### 2. Top Municípios com Mais Mudanças

```sql
SELECT 
    m.descricao as municipio,
    e.uf,
    COUNT(*) as total_mudancas,
    COUNT(*) FILTER (WHERE e.situacao_cadastral = '01') as novas_baixas
FROM cnpj_brasil.estabelecimentos e
JOIN cnpj_brasil.municipios m ON e.municipio = m.codigo
WHERE e.data_ultima_atualizacao >= NOW() - INTERVAL '1 month'
GROUP BY m.descricao, e.uf
ORDER BY total_mudancas DESC
LIMIT 20;
```

### 3. CNPJs Que Mudaram de Situação

```sql
-- Empresas que foram baixadas no último mês
SELECT 
    e.cnpj_basico,
    e.razao_social,
    e.data_situacao_cadastral,
    e.data_ultima_atualizacao
FROM cnpj_brasil.empresas e
WHERE e.data_ultima_atualizacao >= NOW() - INTERVAL '1 month'
  AND e.situacao_cadastral = '01' -- Baixada
ORDER BY e.data_ultima_atualizacao DESC;
```

### 4. Novos CNPJs do Mês

```sql
SELECT 
    e.cnpj_basico,
    e.razao_social,
    e.natureza_juridica,
    nj.descricao as tipo_empresa,
    e.porte,
    e.data_inicio_atividade
FROM cnpj_brasil.empresas e
LEFT JOIN cnpj_brasil.naturezas_juridicas nj ON e.natureza_juridica = nj.codigo
WHERE e.versao_importacao = '2026-02' -- Versão atual
  AND e.data_ultima_atualizacao >= NOW() - INTERVAL '1 day'
ORDER BY e.data_inicio_atividade DESC
LIMIT 100;
```

### 5. Análise de Performance da Importação

```sql
-- Criar view para análise histórica
CREATE OR REPLACE VIEW cnpj_brasil.v_stats_importacao AS
SELECT 
    versao_importacao,
    tabela,
    COUNT(*) as total_registros,
    COUNT(*) FILTER (WHERE data_ultima_atualizacao >= data_importacao) as registros_atualizados,
    ROUND(100.0 * COUNT(*) FILTER (WHERE data_ultima_atualizacao >= data_importacao) / COUNT(*), 2) as taxa_atualizacao
FROM (
    SELECT 'Empresas' as tabela, versao_importacao, data_ultima_atualizacao,
           (SELECT MIN(data_ultima_atualizacao) FROM cnpj_brasil.empresas WHERE versao_importacao = e.versao_importacao) as data_importacao
    FROM cnpj_brasil.empresas e
    
    UNION ALL
    
    SELECT 'Estabelecimentos', versao_importacao, data_ultima_atualizacao,
           (SELECT MIN(data_ultima_atualizacao) FROM cnpj_brasil.estabelecimentos WHERE versao_importacao = est.versao_importacao)
    FROM cnpj_brasil.estabelecimentos est
    
    UNION ALL
    
    SELECT 'Sócios', versao_importacao, data_ultima_atualizacao,
           (SELECT MIN(data_ultima_atualizacao) FROM cnpj_brasil.socios WHERE versao_importacao = s.versao_importacao)
    FROM cnpj_brasil.socios s
) dados
GROUP BY versao_importacao, tabela
ORDER BY versao_importacao DESC, tabela;
```

---

## 🧪 PLANO DE TESTES

### Fase 1: Testes Unitários
- [ ] Função `calcular_hash_empresa()` com dados de exemplo
- [ ] Função `calcular_hash_estabelecimento()` com dados de exemplo
- [ ] Função `calcular_hash_socio()` com dados de exemplo
- [ ] Verificar que hash muda quando dados mudam
- [ ] Verificar que hash permanece igual para dados iguais

### Fase 2: Teste com Subset
```bash
# Criar subset de teste (10% dos dados)
# 1. Importar base dez/2025 completa (já feito)
# 2. Importar base dez/2025 novamente em modo incremental
# 3. Verificar: 0 mudanças detectadas (hash idêntico)
# 4. Modificar manualmente 100 registros
# 5. Reimportar: deve detectar exatamente 100 mudanças
```

### Fase 3: Teste Completo
- [ ] Baixar base fev/2026 da Receita
- [ ] Executar importação incremental completa
- [ ] Medir tempo de execução
- [ ] Validar quantidade de mudanças detectadas
- [ ] Comparar com estatísticas da Receita (se disponíveis)

### Fase 4: Validação de Integridade
```sql
-- Verificar se algum registro ficou sem hash
SELECT COUNT(*) FROM cnpj_brasil.empresas WHERE hash_dados IS NULL;
SELECT COUNT(*) FROM cnpj_brasil.estabelecimentos WHERE hash_dados IS NULL;
SELECT COUNT(*) FROM cnpj_brasil.socios WHERE hash_dados IS NULL;

-- Verificar duplicatas de hash (não deveria haver, mas...)
SELECT hash_dados, COUNT(*) 
FROM cnpj_brasil.empresas 
GROUP BY hash_dados 
HAVING COUNT(*) > 1;
```

---

## 📅 CRONOGRAMA DE IMPLEMENTAÇÃO

### Dia 1: Preparação do Schema
- [ ] Executar ALTER TABLE para adicionar colunas (hash, data_atualizacao, versao)
- [ ] Criar índices nas colunas de controle
- [ ] **Decisão:** Implementar tabela de histórico? (avaliar necessidade)
- [ ] Se SIM: Criar mudancas_historico (versão simples primeiro)
- [ ] Se SIM: Criar função criar_particao_mudancas() para futuro
- [ ] Criar views de análise
- [ ] **Backup completo do banco antes das mudanças**
- [ ] Documentar tamanho atual do banco para comparação

### Dia 2: Modificação do Script Python
- [ ] Implementar funções de hash (empresas, estabelecimentos, socios)
- [ ] Modificar `extrair_e_copiar()` para calcular hash
- [ ] Modificar `merge_to_production()` com WHERE hash diferente
- [ ] Adicionar flag `--mode [full|incremental]`
- [ ] Adicionar logging detalhado (novos, atualizados, inalterados)
- [ ] **Se tabela histórico:** Implementar gravação de mudanças no MERGE

### Dia 3: Testes Unitários e Subset
- [ ] Criar testes unitários das funções de hash
- [ ] Teste 1: Reimportar dez/2025 em modo incremental
- [ ] Validar: 0 mudanças detectadas (100% hash igual)
- [ ] Teste 2: Modificar 100 registros manualmente
- [ ] Reimportar e validar: exatamente 100 mudanças detectadas
- [ ] **Se tabela histórico:** Validar registros gravados corretamente

### Dia 4: Teste Completo com Base Fev/2026
- [ ] Baixar base fev/2026 da Receita
- [ ] Executar importação incremental completa
- [ ] Medição de performance (tempo total, por tabela)
- [ ] Análise: quantos INSERTs vs UPDATEs
- [ ] Validação de integridade (nenhum hash NULL)
- [ ] **Se tabela histórico:** Analisar tipos de mudanças mais comuns
- [ ] Ajustes de otimização se necessário

### Dia 5: Documentação, Validação e Rollout
- [ ] Executar todas as queries de análise de mudanças
- [ ] Comparar tempo: importação atual vs incremental
- [ ] Validar ganho de performance (meta: 70%+ redução)
- [ ] Atualizar README com novo processo
- [ ] Documentar queries de análise úteis
- [ ] **Se tabela histórico:** Documentar queries de auditoria
- [ ] Criar script de migração para adicionar hash à base existente
- [ ] Atualizar `importar_cnpj_mensal.sh` para usar modo incremental por padrão
- [ ] Commit e deploy em produção

---

## 📈 MÉTRICAS DE SUCESSO

| Métrica | Valor Atual | Meta | Como Medir |
|---------|-------------|------|------------|
| Tempo de importação | 6-8h | 1-2h | Comparar logs antes/depois |
| Registros processados | 65M (100%) | ~2M (3%) | COUNT com data_ultima_atualizacao |
| Uso de disco temporário | ~220GB | ~50GB | du -sh durante importação |
| I/O do PostgreSQL | Alto | 70% menor | pg_stat_io |
| Taxa de detecção de mudanças | N/A | 98%+ precisão | Comparação manual de amostra |
| **Tabela histórico (se implementada):** |
| Tamanho da tabela histórico | N/A | <500MB/mês | pg_total_relation_size |
| Crescimento anual | N/A | ~3-5GB | Projeção baseada em 12 meses |
| Partições criadas | N/A | 1/mês automático | Função criar_particao_mudancas() |

---

## 🚨 RISCOS E MITIGAÇÕES

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Hash não detecta mudança real | Alto | Baixo | Testes extensivos, incluir TODOS campos relevantes |
| Colisão de hash | Médio | Muito Baixo | MD5 suficiente para esse caso; migrar para SHA256 se necessário |
| Performance do cálculo de hash | Médio | Baixo | Hash calculado 1x no COPY, não no MERGE |
| Primeira importação após mudança | Baixo | Alto | Usar `--mode full` para popular hash inicial |
| Bug não detecta novos CNPJs | Alto | Baixo | ON CONFLICT INSERT sempre funciona |

---

## 📝 NOTAS TÉCNICAS

### Por que MD5 é suficiente?
- Não é criptografia (não precisa ser seguro)
- Risco de colisão: 1 em 2^128 (praticamente zero para nosso caso)
- Mais rápido que SHA256
- 32 caracteres (compacto)

### Por que não usar timestamp dos arquivos?
- Receita não garante que timestamp reflita mudança real
- Hash é proof of change definitivo
- Permite detectar mudanças mesmo em reimportações

### Estratégia de Rollback
Se algo der errado:
```sql
-- Remover colunas adicionadas
ALTER TABLE cnpj_brasil.empresas 
DROP COLUMN hash_dados,
DROP COLUMN data_ultima_atualizacao,
DROP COLUMN versao_importacao;

-- Voltar script import_cnpj.py para versão anterior
git checkout HEAD~1 scripts/import_cnpj.py
```

---

## 🔗 REFERÊNCIAS

- [Layout da Receita Federal](../estrutura/receitafederal/LAYOUT_CNPJ.pdf)
- [Script atual: import_cnpj.py](../../scripts/import_cnpj.py)
- [Documentação PostgreSQL MERGE](https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT)
- [Hash MD5 em Python](https://docs.python.org/3/library/hashlib.html)

---

## ✅ CHECKLIST PRÉ-IMPLEMENTAÇÃO

Antes de iniciar a sprint, confirmar:

- [ ] Importação inicial (dez/2025) está 100% completa
- [ ] Backup do banco de dados realizado
- [ ] Schema documentado
- [ ] Scripts atuais commitados no Git
- [ ] HD externo com espaço suficiente (>100GB livres)
- [ ] PostgreSQL com performance tuning restaurada
- [ ] Próxima base (fev/2026) baixada e disponível

---

**Status Atual:** 📋 Aguardando conclusão da importação inicial  
**Próximo Passo:** Executar checklist pré-implementação  
**Responsável:** Equipe BaseCerta  
**Revisão:** Após primeira execução em fev/2026
