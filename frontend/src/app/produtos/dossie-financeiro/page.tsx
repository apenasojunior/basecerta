"use client"

import { useState } from "react"
import { CircleDollarSign, Search, User, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/ui/empty-state"
import { FinancialSearchForm } from "@/components/produtos/FinancialSearchForm"
import { FinancialScoreCards } from "@/components/produtos/FinancialScoreCards"
import { ProtestTable } from "@/components/produtos/ProtestTable"
import { DebtTable } from "@/components/produtos/DebtTable"
import { useFinancialDossieCPF, useFinancialDossieCNPJ } from "@/hooks/useFinancialDossie"
import { toast } from "@/lib/toast"

type DossieType = "pf" | "pj"

export default function DossieFinanceiroPage() {
  const [dossieType, setDossieType] = useState<DossieType>("pf")
  const [searchDocument, setSearchDocument] = useState<string>("")
  
  // React Query hooks
  const { 
    data: dossiePF, 
    isLoading: isLoadingPF,
    isError: isErrorPF,
    error: errorPF 
  } = useFinancialDossieCPF(searchDocument, dossieType === "pf" && !!searchDocument)
  
  const { 
    data: dossiePJ, 
    isLoading: isLoadingPJ,
    isError: isErrorPJ,
    error: errorPJ 
  } = useFinancialDossieCNPJ(searchDocument, dossieType === "pj" && !!searchDocument)

  const currentDossie = dossieType === "pf" ? dossiePF : dossiePJ
  const isLoading = dossieType === "pf" ? isLoadingPF : isLoadingPJ
  const isError = dossieType === "pf" ? isErrorPF : isErrorPJ
  const error = dossieType === "pf" ? errorPF : errorPJ

  const handleSearch = async (data: { document: string }) => {
    setSearchDocument(data.document)
    toast.success(`Buscando dossiê ${dossieType === "pf" ? "PF" : "PJ"}...`)
  }

  const handleDownloadCertidao = (protest: any) => {
    toast.info(`Download de certidão em breve...`)
  }

  const handleViewDebtDetails = (debt: any) => {
    toast.info(`Ver detalhes da dívida: ${debt.orgao}`)
  }

  const handlePrintDebt = (debt: any) => {
    toast.info(`Imprimir dívida em breve...`)
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Produtos</span>
          <span>/</span>
          <span className="text-foreground font-medium">Dossiê Financeiro</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <CircleDollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dossiê Financeiro</h1>
            <p className="text-muted-foreground">
              Consulte score de crédito, protestos, dívidas e restrições financeiras
            </p>
          </div>
        </div>
      </div>

      {/* Tabs PF/PJ */}
      <Tabs value={dossieType} onValueChange={(value) => setDossieType(value as DossieType)}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pf" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Pessoa Física
          </TabsTrigger>
          <TabsTrigger value="pj" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Pessoa Jurídica
          </TabsTrigger>
        </TabsList>

        {/* Content PF */}
        <TabsContent value="pf" className="space-y-6 mt-6">
          {/* Search Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Dossiê Pessoa Física
              </CardTitle>
              <CardDescription>
                Digite o CPF para consultar o dossiê financeiro completo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialSearchForm
                type="cpf"
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          {/* Results or Empty State */}
          {!searchDocument || dossieType !== "pf" ? (
            <EmptyState
              icon={CircleDollarSign}
              title="Nenhuma consulta realizada"
              description="Use o formulário acima para buscar o dossiê financeiro de uma pessoa física por CPF."
              variant="no-data"
              withCard
              iconSize="lg"
            >
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  💡 O que você encontrará:
                </h4>
                <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1 list-disc list-inside">
                  <li>Score de crédito atualizado (0-1000 pontos)</li>
                  <li>Histórico de protestos em cartórios</li>
                  <li>Dívidas ativas federais, estaduais e municipais</li>
                  <li>Restrições financeiras e cheques sem fundo</li>
                </ul>
              </div>
            </EmptyState>
          ) : isError ? (
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                <div className="text-center py-8 text-red-600 dark:text-red-400">
                  <p className="font-semibold mb-2">Erro ao buscar dossiê</p>
                  <p className="text-sm">{error?.message || "Tente novamente mais tarde"}</p>
                </div>
              </CardContent>
            </Card>
          ) : currentDossie ? (
            <div className="space-y-6">
              <FinancialScoreCards data={currentDossie.score} isLoading={isLoading} />
              
              {/* Tabela de Protestos */}
              {currentDossie.protestos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Protestos</CardTitle>
                    <CardDescription>
                      Histórico de protestos em cartórios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProtestTable 
                      data={currentDossie.protestos} 
                      isLoading={isLoading}
                      onDownload={handleDownloadCertidao}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Tabela de Dívidas */}
              {currentDossie.dividas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Dívidas Ativas</CardTitle>
                    <CardDescription>
                      Dívidas federais, estaduais e municipais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DebtTable 
                      data={currentDossie.dividas}
                      isLoading={isLoading}
                      onViewDetails={handleViewDebtDetails}
                      onPrint={handlePrintDebt}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}
        </TabsContent>

        {/* Content PJ */}
        <TabsContent value="pj" className="space-y-6 mt-6">
          {/* Search Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Dossiê Pessoa Jurídica
              </CardTitle>
              <CardDescription>
                Digite o CNPJ para consultar o dossiê financeiro completo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialSearchForm
                type="cnpj"
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          {/* Results or Empty State */}
          {!searchDocument || dossieType !== "pj" ? (
            <EmptyState
              icon={CircleDollarSign}
              title="Nenhuma consulta realizada"
              description="Use o formulário acima para buscar o dossiê financeiro de uma empresa por CNPJ."
              variant="no-data"
              withCard
              iconSize="lg"
            >
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  💡 O que você encontrará:
                </h4>
                <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1 list-disc list-inside">
                  <li>Score de crédito empresarial (0-1000 pontos)</li>
                  <li>Protestos e pendências em cartórios</li>
                  <li>Dívidas tributárias e previdenciárias</li>
                  <li>Restrições financeiras e histórico de inadimplência</li>
                </ul>
              </div>
            </EmptyState>
          ) : isError ? (
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                <div className="text-center py-8 text-red-600 dark:text-red-400">
                  <p className="font-semibold mb-2">Erro ao buscar dossiê</p>
                  <p className="text-sm">{error?.message || "Tente novamente mais tarde"}</p>
                </div>
              </CardContent>
            </Card>
          ) : currentDossie ? (
            <div className="space-y-6">
              <FinancialScoreCards data={currentDossie.score} isLoading={isLoading} />
              
              {/* Tabela de Protestos */}
              {currentDossie.protestos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Protestos</CardTitle>
                    <CardDescription>
                      Histórico de protestos em cartórios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProtestTable 
                      data={currentDossie.protestos} 
                      isLoading={isLoading}
                      onDownload={handleDownloadCertidao}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Tabela de Dívidas */}
              {currentDossie.dividas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Dívidas Ativas</CardTitle>
                    <CardDescription>
                      Dívidas tributárias, previdenciárias e trabalhistas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DebtTable 
                      data={currentDossie.dividas}
                      isLoading={isLoading}
                      onViewDetails={handleViewDebtDetails}
                      onPrint={handlePrintDebt}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  )
}
