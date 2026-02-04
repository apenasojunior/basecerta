"use client";

import React, { useState } from 'react';
import { Download, FileText, Image as ImageIcon, FileSpreadsheet, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportButtonProps {
  targetElementId?: string;
  fileName?: string;
  data?: any;
}

export default function ExportButton({ 
  targetElementId = 'insights-page',
  fileName = 'basecerta-insights',
  data 
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);

  const handleExportPDF = async () => {
    setExporting(true);
    setExportFormat('pdf');
    
    try {
      const element = document.getElementById(targetElementId);
      if (!element) throw new Error('Elemento não encontrado');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      // Header
      pdf.setFontSize(16);
      pdf.setTextColor(238, 77, 45); // Orange
      pdf.text('BaseCerta - Insights Estratégicos', 15, 15);
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 15, 22);

      // Content
      pdf.addImage(imgData, 'PNG', imgX, imgY + 20, imgWidth * ratio, imgHeight * ratio);

      // Footer
      const pageCount = pdf.internal.pages.length - 1;
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `BaseCerta | basecerta.com | Página ${pageCount}`,
        pdfWidth / 2,
        pdfHeight - 10,
        { align: 'center' }
      );

      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setExporting(false);
      setExportFormat(null);
      setIsOpen(false);
    }
  };

  const handleExportPNG = async () => {
    setExporting(true);
    setExportFormat('png');
    
    try {
      const element = document.getElementById(targetElementId);
      if (!element) throw new Error('Elemento não encontrado');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Erro ao gerar imagem');
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.png`;
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('Erro ao exportar PNG:', error);
      alert('Erro ao gerar PNG. Tente novamente.');
    } finally {
      setExporting(false);
      setExportFormat(null);
      setIsOpen(false);
    }
  };

  const handleExportCSV = () => {
    setExporting(true);
    setExportFormat('csv');
    
    try {
      if (!data || !Array.isArray(data)) {
        throw new Error('Dados não disponíveis para exportação CSV');
      }

      // Gerar CSV dos insights
      const headers = ['Categoria', 'Título', 'Total Empresas', 'Percentual'];
      const rows = data.map(insight => [
        insight.categoria,
        insight.titulo,
        insight.total_empresas,
        insight.percentual ? `${insight.percentual.toFixed(1)}%` : '-'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('Erro ao gerar CSV. Tente novamente.');
    } finally {
      setExporting(false);
      setExportFormat(null);
      setIsOpen(false);
    }
  };

  const exportOptions = [
    {
      id: 'pdf',
      label: 'PDF (relatório completo)',
      icon: FileText,
      action: handleExportPDF,
      color: 'text-red-600'
    },
    {
      id: 'png',
      label: 'PNG (screenshot)',
      icon: ImageIcon,
      action: handleExportPNG,
      color: 'text-blue-600'
    },
    {
      id: 'csv',
      label: 'CSV (dados tabulares)',
      icon: FileSpreadsheet,
      action: handleExportCSV,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="relative">
      {/* Botão Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Exportando...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Exportar Insights
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !exporting && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isCurrentlyExporting = exporting && exportFormat === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={option.action}
                  disabled={exporting}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  {isCurrentlyExporting ? (
                    <Loader2 className={`w-5 h-5 animate-spin ${option.color}`} />
                  ) : (
                    <Icon className={`w-5 h-5 ${option.color}`} />
                  )}
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {option.label.split('(')[0].trim()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ({option.label.split('(')[1]?.replace(')', '') || ''})
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
