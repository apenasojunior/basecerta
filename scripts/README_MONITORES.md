# 📊 Monitores de Importação CNPJ

Este diretório contém 3 monitores especializados para acompanhar importações CNPJ com diferentes níveis de detalhe.

---

## 🚀 Monitor Importação Visual (RECOMENDADO)

**Arquivo:** `monitor_importacao_visual.sh`

### Características:
- ✨ Interface visual moderna com barras de progresso
- 📊 Mostra progresso por tabela com percentual
- 🚀 Velocidade de processamento em tempo real
- ⏱️ Estimativa de tempo restante
- 💾 Contadores de registros processados
- 📁 Arquivo atual sendo processado
- 🎨 Cores e emojis para melhor visualização

### Uso:
```bash
# Atualiza a cada 5 segundos (padrão)
./monitor_importacao_visual.sh 2025-12

# Atualiza a cada 10 segundos
./monitor_importacao_visual.sh 2025-12 10

# Atualiza a cada 3 segundos (mais responsivo)
./monitor_importacao_visual.sh 2025-12 3
```

### Exemplo de Saída:
```
╔══════════════════════════════════════════════════════════════════════════════╗
║        🚀 MONITOR DE IMPORTAÇÃO CNPJ - VERSÃO 2025-12                    ║
╚══════════════════════════════════════════════════════════════════════════════╝

🔄 Processo ativo: PID 50057

📊 PROGRESSO POR TABELA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▶ Empresas
  [███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  30%  (3/10 arquivos)
  🔄 Processando: Empresas3.zip
  💾 Registros processados: 34,232,854

📊 VELOCIDADE E ESTATÍSTICAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ Último arquivo completado: Empresas2.zip
  ⏱️ Tempo de processamento: 4m 16s
  💾 Registros: 4,494,860
  🚀 Velocidade: 17,558 reg/s

  ⏱️ Tempo estimado para completar Empresas: 17m 04s

💾 DADOS NO BANCO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Empresas............: 67,123,456
  Estabelecimentos....: 45,678,901
  Sócios..............: 23,456,789

  Tamanho do banco....: 45 GB
```

---

## 📅 Monitor Reimportação Mensal

**Arquivo:** `monitor_reimportacao_mensal.sh`

### Características:
- 🔄 Compara versão nova com anterior
- 📊 Mostra diferenças absolutas e percentuais
- ⬆️ Destaca crescimento/redução por tabela
- 📈 Acompanha progresso da nova importação
- 🎯 Ideal para atualizações mensais

### Uso:
```bash
# Comparar com versão anterior (detecta automaticamente)
./monitor_reimportacao_mensal.sh 2026-01

# Especificar versão para comparar
./monitor_reimportacao_mensal.sh 2026-01 2025-12

# Atualizar a cada 10 segundos
./monitor_reimportacao_mensal.sh 2026-01 2025-12 10
```

### Exemplo de Saída:
```
╔══════════════════════════════════════════════════════════════════════════════╗
║           📅 MONITOR DE REIMPORTAÇÃO MENSAL CNPJ                       ║
╚══════════════════════════════════════════════════════════════════════════════╝

Nova versão: 2026-01     Anterior: 2025-12

🔄 COMPARAÇÃO DE VERSÕES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▶ Empresas
  2026-01: 67,456,789
  2025-12: 67,123,456
  🆕 Diferença: +333,333 (+0.50%)

▶ Estabelecimentos
  2026-01: 46,012,345
  2025-12: 45,678,901
  🆕 Diferença: +333,444 (+0.73%)

📊 PROGRESSO DA REIMPORTAÇÃO 2026-01:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▶ Empresas
  [████████████████████████████████████████]  100%  (10/10 arquivos)
  ✅ Processados: 67,456,789 registros
```

---

## 🔧 Monitor Checkpoint (Técnico)

**Arquivo:** `monitor_checkpoint.sh`

### Características:
- 🔍 Detalhes técnicos dos checkpoints
- 📝 Queries ativas do PostgreSQL
- 💾 Uso de memória e disco
- 🐛 Ideal para debug e troubleshooting
- 📋 Saída em formato tabular

### Uso:
```bash
# Atualiza a cada 10 segundos (padrão)
./monitor_checkpoint.sh 2025-12

# Atualiza a cada 5 segundos
./monitor_checkpoint.sh 2025-12 5
```

### Quando usar:
- Diagnosticar problemas de performance
- Verificar queries que estão executando
- Monitorar uso de recursos
- Debug de checkpoints com falha

---

## 📋 Comparação Rápida

| Recurso | Visual | Reimportação | Checkpoint |
|---------|--------|--------------|------------|
| Barra de progresso | ✅ | ✅ | ❌ |
| Velocidade estimada | ✅ | ✅ | ❌ |
| Tempo restante | ✅ | ❌ | ❌ |
| Comparação versões | ❌ | ✅ | ❌ |
| Detalhes técnicos | ❌ | ❌ | ✅ |
| Facilidade visual | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Recomendado para** | Uso diário | Mensal | Debug |

---

## 🎯 Recomendações de Uso

### 1️⃣ Importação Inicial (primeira vez)
```bash
./monitor_importacao_visual.sh 2025-12 5
```

### 2️⃣ Reimportação Mensal
```bash
./monitor_reimportacao_mensal.sh 2026-01 2025-12 10
```

### 3️⃣ Troubleshooting/Debug
```bash
./monitor_checkpoint.sh 2025-12 5
```

---

## ⚡ Dicas de Performance

### Intervalo de Atualização
- **3-5s**: Monitoramento intensivo, usa mais CPU
- **10s**: Balanceado (recomendado)
- **30s**: Para processos longos, economiza recursos

### Múltiplas Janelas
Você pode rodar vários monitores ao mesmo tempo:
```bash
# Terminal 1: Visual para acompanhamento
./monitor_importacao_visual.sh 2025-12 10

# Terminal 2: Checkpoint para debug
./monitor_checkpoint.sh 2025-12 30
```

---

## 🚨 Informações Importantes

### ⚠️ Aviso: "Nenhum processo detectado"
Se você ver essa mensagem, significa:
- A importação não foi iniciada ainda, OU
- A importação já foi concluída, OU
- O processo travou/morreu

Verifique com:
```bash
ps aux | grep import_cnpj.py
```

### ✅ Interpretando a Velocidade
- **< 5.000 reg/s**: Lento (verificar disco/RAM)
- **5.000 - 15.000 reg/s**: Normal
- **15.000 - 25.000 reg/s**: Bom
- **> 25.000 reg/s**: Excelente

### ⏱️ Tempo Estimado
O tempo é calculado com base no **último arquivo completado**. 
- Se os arquivos têm tamanhos diferentes, a estimativa pode variar
- Arquivos maiores demoram mais
- Empresas e Simples são menores (4-25M registros)
- Estabelecimentos são maiores (15-30M registros)

---

## 📝 Comandos Úteis

### Verificar processo ativo
```bash
ps aux | grep import_cnpj.py
```

### Verificar checkpoints manualmente
```bash
python3 manage_checkpoints.py status 2025-12
```

### Ver log em tempo real
```bash
tail -f /Volumes/ExtMB/postgresql/logs/import_*.log
```

### Contar registros no banco
```bash
psql -U code4us -d basecerta -c "
SELECT 
    'Empresas' as tabela, COUNT(*) FROM cnpj_brasil.empresas
UNION ALL
SELECT 'Estabelecimentos', COUNT(*) FROM cnpj_brasil.estabelecimentos
UNION ALL
SELECT 'Socios', COUNT(*) FROM cnpj_brasil.socios;
"
```

---

## 🐛 Troubleshooting

### Monitor não atualiza
1. Verifique se o processo está rodando: `ps aux | grep import_cnpj`
2. Verifique conexão PostgreSQL: `psql -U code4us -d basecerta -c "SELECT 1"`
3. Aumente o intervalo: `./monitor_importacao_visual.sh 2025-12 30`

### Velocidade muito baixa
1. Verifique uso de disco: `df -h /Volumes/ExtMB`
2. Verifique memória: `top -l 1 | grep PhysMem`
3. Verifique queries bloqueadas: Use `monitor_checkpoint.sh`

### Barra de progresso não avança
- É normal em arquivos grandes (MERGE pode demorar 5-15 minutos)
- Verifique o log: `tail -f /Volumes/ExtMB/postgresql/logs/import_*.log`
- Use `monitor_checkpoint.sh` para ver query ativa

---

## 📚 Mais Informações

Para detalhes sobre o sistema de checkpoints:
- Ver `manage_checkpoints.py --help`
- Ler documentação em `IMPORTA_HASH.md`
- Verificar logs em `/Volumes/ExtMB/postgresql/logs/`

---

**Última atualização:** Janeiro 2026
