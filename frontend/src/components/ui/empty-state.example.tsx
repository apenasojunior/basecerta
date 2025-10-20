"use client"

import {
  FileText,
  Search,
  AlertTriangle,
  Lock,
  Database,
  RefreshCw,
} from "lucide-react"
import {
  EmptyState,
  EmptyStateSuggestions,
  EmptyStateInline,
} from "@/components/ui/empty-state"

export function EmptyStateExamples() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">Empty State Components</h1>

      {/* No Data */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. No Data (Padrão)</h2>
        <EmptyState
          icon={FileText}
          title="Nenhum dado ainda"
          description="Você ainda não possui nenhum item cadastrado. Comece criando seu primeiro item."
          variant="no-data"
          actionLabel="Criar Primeiro Item"
          onAction={() => console.log("Criar item")}
        />
      </section>

      {/* No Results */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. No Results (Busca)</h2>
        <EmptyState
          icon={Search}
          title="Nenhum resultado encontrado"
          description='Não encontramos resultados para "empresa xyz". Tente ajustar os filtros ou buscar por outro termo.'
          variant="no-results"
          actionLabel="Limpar Filtros"
          secondaryActionLabel="Nova Busca"
          onAction={() => console.log("Limpar")}
          onSecondaryAction={() => console.log("Nova busca")}
        >
          <EmptyStateSuggestions
            items={[
              "Verifique a ortografia dos termos de busca",
              "Tente usar termos mais genéricos",
              "Use menos filtros",
            ]}
          />
        </EmptyState>
      </section>

      {/* Error */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Error State</h2>
        <EmptyState
          icon={AlertTriangle}
          title="Erro ao carregar dados"
          description="Ocorreu um erro ao carregar os dados. Por favor, tente novamente."
          variant="error"
          actionLabel="Tentar Novamente"
          onAction={() => console.log("Retry")}
        />
      </section>

      {/* No Access */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. No Access</h2>
        <EmptyState
          icon={Lock}
          title="Acesso Restrito"
          description="Você não tem permissão para acessar este conteúdo. Entre em contato com o administrador."
          variant="no-access"
          actionLabel="Solicitar Acesso"
          onAction={() => console.log("Request access")}
        />
      </section>

      {/* With Card */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Com Card Wrapper</h2>
        <EmptyState
          icon={Database}
          title="Base de dados vazia"
          description="Sua base de dados está vazia. Importe dados ou sincronize com a API."
          variant="no-data"
          actionLabel="Importar Dados"
          secondaryActionLabel="Sincronizar"
          onAction={() => console.log("Import")}
          onSecondaryAction={() => console.log("Sync")}
          withCard
        />
      </section>

      {/* Inline */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">6. Inline (Tabelas/Listas)</h2>
        <div className="rounded-lg border p-4">
          <EmptyStateInline message="Nenhuma empresa encontrada" icon={Search} />
        </div>
      </section>

      {/* Tamanhos de Ícone */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">7. Tamanhos de Ícone</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <EmptyState
            icon={FileText}
            title="Small"
            description="Ícone pequeno"
            iconSize="sm"
            withCard
          />
          <EmptyState
            icon={FileText}
            title="Medium"
            description="Ícone médio"
            iconSize="md"
            withCard
          />
          <EmptyState
            icon={FileText}
            title="Large"
            description="Ícone grande (padrão)"
            iconSize="lg"
            withCard
          />
          <EmptyState
            icon={FileText}
            title="Extra Large"
            description="Ícone extra grande"
            iconSize="xl"
            withCard
          />
        </div>
      </section>

      {/* Customizado */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">8. Conteúdo Customizado</h2>
        <EmptyState
          icon={RefreshCw}
          title="Atualizando dados..."
          description="Estamos sincronizando seus dados. Isso pode levar alguns minutos."
          variant="no-data"
          withCard
        >
          <div className="w-full max-w-xs">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-3/4 animate-pulse bg-primary" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">75% completo</p>
          </div>
        </EmptyState>
      </section>
    </div>
  )
}

export default EmptyStateExamples
