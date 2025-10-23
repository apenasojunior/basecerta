"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Star, Trash2, Eye, Filter, X } from "lucide-react"
import { useFavorites, type FavoriteType } from "@/hooks/useFavorites"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatCPF, formatCNPJ } from "@/lib/utils/formatters"
import { toast } from "@/lib/toast"

const TYPE_LABELS: Record<FavoriteType, string> = {
  PF: "Pessoa Física",
  PJ: "Pessoa Jurídica",
  FINANCEIRO: "Dossiê Financeiro",
}

const TYPE_COLORS: Record<FavoriteType, string> = {
  PF: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  PJ: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  FINANCEIRO: "bg-green-100 text-green-800 hover:bg-green-200",
}

export default function FavoritosPage() {
  const router = useRouter()
  const { favorites, isLoading, removeFavorite, clearAllFavorites, getStats } = useFavorites()
  const [filterType, setFilterType] = useState<FavoriteType | "ALL">("ALL")
  const [clearDialogOpen, setClearDialogOpen] = useState(false)

  const stats = getStats()

  // Filtra favoritos por tipo
  const filteredFavorites = useMemo(() => {
    if (filterType === "ALL") return favorites
    return favorites.filter((fav) => fav.type === filterType)
  }, [favorites, filterType])

  // Formata documento (CPF ou CNPJ)
  const formatDocument = (document: string, type: FavoriteType) => {
    if (type === "PJ" || type === "FINANCEIRO") {
      return document.length === 14 ? formatCNPJ(document) : document
    }
    return document.length === 11 ? formatCPF(document) : document
  }

  // Navega para a página de consulta
  const handleView = (type: FavoriteType, document: string) => {
    // Remove formatação do documento
    const cleanDocument = document.replace(/[.\-\/]/g, '')
    
    if (type === "PF") {
      // Pessoa Física → Dados 360° PF
      router.push(`/dados360/pf/${cleanDocument}?from=favoritos`)
    } else if (type === "PJ") {
      // Pessoa Jurídica → Smart CNPJ Detalhes
      router.push(`/smart-cnpj/${cleanDocument}?from=favoritos`)
    } else if (type === "FINANCEIRO") {
      // Dossiê Financeiro
      const docType = document.length === 14 || cleanDocument.length === 14 ? "cnpj" : "cpf"
      router.push(`/produtos/dossie-financeiro?${docType}=${cleanDocument}&from=favoritos`)
    }
  }

  // Remove favorito
  const handleRemove = (id: string, name: string) => {
    removeFavorite(id)
    toast.success(`"${name}" removido dos favoritos`)
  }

  // Limpa todos os favoritos
  const handleClearAll = () => {
    clearAllFavorites()
    setClearDialogOpen(false)
    toast.success("Todos os favoritos foram removidos")
  }

  // Formata data
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando favoritos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
            Meus Favoritos
          </h1>
          <p className="text-muted-foreground mt-1">
            Acesso rápido às suas consultas mais importantes
          </p>
        </div>

        {favorites.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setClearDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Todos
          </Button>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Favoritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {stats.total} / {stats.total + stats.remaining}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.remaining} restantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pessoa Física
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.byType.PF}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pessoa Jurídica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{stats.byType.PJ}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dossiê Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.byType.FINANCEIRO}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Favoritos</CardTitle>
              <CardDescription>
                {filteredFavorites.length} de {favorites.length} favorito(s)
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
                <Button
                  variant={filterType === "ALL" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("ALL")}
                >
                  Todos
                </Button>
                <Button
                  variant={filterType === "PF" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("PF")}
                >
                  PF
                </Button>
                <Button
                  variant={filterType === "PJ" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("PJ")}
                >
                  PJ
                </Button>
                <Button
                  variant={filterType === "FINANCEIRO" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("FINANCEIRO")}
                >
                  Financeiro
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                {filterType === "ALL"
                  ? "Nenhum favorito ainda"
                  : `Nenhum favorito do tipo ${TYPE_LABELS[filterType]}`}
              </p>
              <p className="text-sm text-muted-foreground">
                Adicione consultas aos favoritos para acesso rápido
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Adicionado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFavorites.map((favorite) => (
                    <TableRow key={favorite.id}>
                      <TableCell>
                        <Badge className={TYPE_COLORS[favorite.type]}>
                          {TYPE_LABELS[favorite.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {favorite.name}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatDocument(favorite.document, favorite.type)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {favorite.metadata?.uf && favorite.metadata?.municipio
                          ? `${favorite.metadata.municipio} - ${favorite.metadata.uf}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(favorite.timestamp)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleView(favorite.type, favorite.document)
                            }
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemove(favorite.id, favorite.name)
                            }
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmação para limpar todos */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os {stats.total} favoritos
              serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-destructive hover:bg-destructive/90"
            >
              Sim, limpar todos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
