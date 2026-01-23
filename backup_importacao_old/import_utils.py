"""
Funções auxiliares para importação CNPJ Brasil
"""
import zipfile
import io
import logging
from typing import Iterator, List, Tuple, Optional
from datetime import datetime
from decimal import Decimal, InvalidOperation
import csv

from .import_config import (
    SOURCE_ENCODING,
    TARGET_ENCODING,
    CSV_DELIMITER,
    CSV_QUOTE_CHAR,
    SITUACAO_ATIVA,
    SCHEMA_PRINCIPAL,
    SCHEMA_OUTRAS_SITUACOES
)

logger = logging.getLogger('cnpj_import')


# =======================
# PROCESSAMENTO DE ARQUIVOS ZIP
# =======================

def read_zip_file_stream(zip_path: str) -> Iterator[str]:
    """
    Lê um arquivo ZIP e retorna um iterador de linhas
    Não descompacta para disco, tudo em memória
    
    Args:
        zip_path: Caminho para o arquivo .zip
        
    Yields:
        Linhas do arquivo descompactado
    """
    logger.info(f"Abrindo arquivo: {zip_path}")
    
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        # Pegar o primeiro arquivo dentro do zip
        file_list = zip_ref.namelist()
        if not file_list:
            raise ValueError(f"Arquivo ZIP vazio: {zip_path}")
        
        internal_file = file_list[0]
        logger.debug(f"Arquivo interno: {internal_file}")
        
        with zip_ref.open(internal_file) as file:
            # Ler e decodificar
            for line in io.TextIOWrapper(file, encoding=SOURCE_ENCODING):
                # Remover caracteres NUL que podem aparecer nos arquivos da Receita
                clean_line = line.replace('\x00', '').strip()
                if clean_line:  # Só retornar linhas não vazias
                    yield clean_line


def parse_csv_line(line: str, num_columns: int) -> List[str]:
    """
    Faz parse de uma linha CSV respeitando aspas e delimitadores
    
    Args:
        line: Linha do CSV
        num_columns: Número esperado de colunas
        
    Returns:
        Lista com os valores das colunas
    """
    # Usar csv.reader para tratar aspas e delimitadores corretamente
    reader = csv.reader(
        [line],
        delimiter=CSV_DELIMITER,
        quotechar=CSV_QUOTE_CHAR
    )
    
    row = next(reader)
    
    # Garantir que temos o número correto de colunas
    if len(row) < num_columns:
        # Preencher com vazios se necessário
        row.extend([''] * (num_columns - len(row)))
    elif len(row) > num_columns:
        # Truncar se tiver colunas extras
        row = row[:num_columns]
    
    return row


# =======================
# CONVERSÃO DE DADOS
# =======================

def safe_date_conversion(date_str: str) -> Optional[str]:
    """
    Converte string de data YYYYMMDD para formato PostgreSQL YYYY-MM-DD
    
    Args:
        date_str: Data no formato YYYYMMDD
        
    Returns:
        Data no formato YYYY-MM-DD ou None se inválida
    """
    if not date_str or date_str == '00000000' or date_str.strip() == '':
        return None
    
    try:
        # Formato: YYYYMMDD
        year = date_str[0:4]
        month = date_str[4:6]
        day = date_str[6:8]
        
        # Validação básica
        if int(year) < 1900 or int(month) < 1 or int(month) > 12 or int(day) < 1 or int(day) > 31:
            return None
        
        return f"{year}-{month}-{day}"
    except (IndexError, ValueError):
        return None


def safe_decimal_conversion(value_str: str) -> Optional[Decimal]:
    """
    Converte string para Decimal, tratando vírgula como separador decimal
    
    Args:
        value_str: Valor em formato brasileiro (ex: "1.000,50")
        
    Returns:
        Decimal ou None se inválido
    """
    if not value_str or value_str.strip() == '':
        return None
    
    try:
        # Remover pontos de milhar e substituir vírgula por ponto
        normalized = value_str.replace('.', '').replace(',', '.')
        return Decimal(normalized)
    except (InvalidOperation, ValueError):
        return None


def safe_string(value: str, max_length: Optional[int] = None) -> Optional[str]:
    """
    Limpa e valida string, removendo caracteres nulos (NUL/\x00)
    
    Args:
        value: Valor a ser limpo
        max_length: Tamanho máximo (trunca se maior)
        
    Returns:
        String limpa ou None se vazia
    """
    if not value or value.strip() == '':
        return None
    
    # Remover caracteres NUL (\x00) que PostgreSQL não aceita
    cleaned = value.replace('\x00', '').strip()
    
    if not cleaned:  # Se ficou vazia após remover \x00
        return None
    
    if max_length and len(cleaned) > max_length:
        cleaned = cleaned[:max_length]
    
    return cleaned


# =======================
# LÓGICA DE SEPARAÇÃO POR SCHEMA
# =======================

def get_schema_for_situacao(situacao_cadastral: str) -> str:
    """
    Retorna o schema apropriado baseado na situação cadastral
    
    Args:
        situacao_cadastral: Código da situação (02=Ativa, etc)
        
    Returns:
        Nome do schema (sempre SCHEMA_PRINCIPAL com arquitetura de schema único)
    """
    # Com schema único, sempre retorna SCHEMA_PRINCIPAL
    # A separação será feita na fase final, após importação completa
    return SCHEMA_PRINCIPAL


def is_cnpj_ativo(situacao_cadastral: str) -> bool:
    """
    Verifica se um CNPJ está ativo
    
    Args:
        situacao_cadastral: Código da situação
        
    Returns:
        True se ativo, False caso contrário
    """
    return situacao_cadastral == SITUACAO_ATIVA


# =======================
# FORMATAÇÃO E VALIDAÇÃO CNPJ
# =======================

def validate_cnpj_basico(cnpj_basico: str) -> bool:
    """
    Valida se o CNPJ básico tem formato correto
    
    Args:
        cnpj_basico: 8 primeiros dígitos do CNPJ
        
    Returns:
        True se válido
    """
    if not cnpj_basico or len(cnpj_basico) != 8:
        return False
    
    try:
        int(cnpj_basico)
        return True
    except ValueError:
        return False


def format_cnpj_completo(cnpj_basico: str, cnpj_ordem: str, cnpj_dv: str) -> str:
    """
    Formata CNPJ completo: 00.000.000/0001-00
    
    Args:
        cnpj_basico: 8 dígitos
        cnpj_ordem: 4 dígitos
        cnpj_dv: 2 dígitos
        
    Returns:
        CNPJ formatado
    """
    cnpj = f"{cnpj_basico}{cnpj_ordem}{cnpj_dv}"
    return f"{cnpj[0:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:14]}"


# =======================
# PROCESSAMENTO EM BATCHES
# =======================

def chunk_iterator(iterator: Iterator, chunk_size: int) -> Iterator[List]:
    """
    Divide um iterador em chunks de tamanho fixo
    
    Args:
        iterator: Iterador de entrada
        chunk_size: Tamanho de cada chunk
        
    Yields:
        Listas com chunk_size elementos
    """
    chunk = []
    for item in iterator:
        chunk.append(item)
        if len(chunk) >= chunk_size:
            yield chunk
            chunk = []
    
    # Yield do último chunk parcial
    if chunk:
        yield chunk


# =======================
# ESTATÍSTICAS E PROGRESSO
# =======================

class ImportStats:
    """Classe para rastrear estatísticas de importação"""
    
    def __init__(self, nome_arquivo: str):
        self.nome_arquivo = nome_arquivo
        self.total_processados = 0
        self.total_ativos = 0
        self.total_demais = 0
        self.total_erros = 0
        self.inicio = datetime.now()
        self.erros_detalhados = []
    
    def registrar_processado(self, is_ativo: bool = False):
        """Registra um registro processado"""
        self.total_processados += 1
        if is_ativo:
            self.total_ativos += 1
        else:
            self.total_demais += 1
    
    def registrar_erro(self, linha_num: int, erro: str):
        """Registra um erro"""
        self.total_erros += 1
        self.erros_detalhados.append({
            'linha': linha_num,
            'erro': erro
        })
    
    def get_duracao(self) -> float:
        """Retorna duração em segundos"""
        return (datetime.now() - self.inicio).total_seconds()
    
    def get_taxa_processamento(self) -> float:
        """Retorna registros por segundo"""
        duracao = self.get_duracao()
        return self.total_processados / duracao if duracao > 0 else 0
    
    def log_progresso(self, intervalo: int = 10000):
        """Loga progresso a cada X registros"""
        if self.total_processados % intervalo == 0:
            taxa = self.get_taxa_processamento()
            logger.info(
                f"[{self.nome_arquivo}] Processados: {self.total_processados:,} | "
                f"Ativos: {self.total_ativos:,} | Demais: {self.total_demais:,} | "
                f"Erros: {self.total_erros} | Taxa: {taxa:.0f} reg/s"
            )
    
    def log_final(self):
        """Loga estatísticas finais"""
        duracao = self.get_duracao()
        taxa = self.get_taxa_processamento()
        
        logger.info(f"\\n{'='*80}")
        logger.info(f"CONCLUÍDO: {self.nome_arquivo}")
        logger.info(f"{'='*80}")
        logger.info(f"Total processados: {self.total_processados:,}")
        logger.info(f"  - CNPJs Ativos: {self.total_ativos:,}")
        logger.info(f"  - Demais CNPJs: {self.total_demais:,}")
        logger.info(f"Total de erros: {self.total_erros}")
        logger.info(f"Duração: {duracao:.2f}s ({duracao/60:.2f} minutos)")
        logger.info(f"Taxa média: {taxa:.0f} registros/segundo")
        logger.info(f"{'='*80}\\n")
        
        # Logar alguns erros se houver
        if self.erros_detalhados:
            logger.warning(f"Primeiros 10 erros:")
            for erro in self.erros_detalhados[:10]:
                logger.warning(f"  Linha {erro['linha']}: {erro['erro']}")


# =======================
# LIMPEZA PÓS-IMPORTAÇÃO
# =======================

def remove_zip_file_safely(zip_path: str) -> bool:
    """
    Remove arquivo .zip após verificar sucesso da importação
    
    Args:
        zip_path: Caminho do arquivo a remover
        
    Returns:
        True se removido com sucesso
    """
    import os
    
    try:
        if os.path.exists(zip_path):
            os.remove(zip_path)
            logger.info(f"Arquivo removido: {zip_path}")
            return True
        return False
    except Exception as e:
        logger.error(f"Erro ao remover arquivo {zip_path}: {e}")
        return False


# =======================
# HELPERS PARA CNAE SECUNDÁRIO
# =======================

def parse_cnaes_secundarios(cnae_string: str) -> Optional[str]:
    """
    Processa string de CNAEs secundários
    Vem separado por vírgulas, retorna como está
    
    Args:
        cnae_string: String com CNAEs separados por vírgula
        
    Returns:
        String limpa ou None
    """
    if not cnae_string or cnae_string.strip() == '':
        return None
    
    # Limpar e retornar
    cnaes = [c.strip() for c in cnae_string.split(',') if c.strip()]
    
    return ','.join(cnaes) if cnaes else None
