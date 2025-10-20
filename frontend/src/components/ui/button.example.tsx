/**
 * EXEMPLOS DE USO - Button Component
 * BaseCerta - Variantes customizadas
 */

import { Button } from "@/components/ui/button"
import { Plus, Trash2, Download, ArrowRight } from "lucide-react"

export function ButtonExamples() {
  return (
    <div className="space-y-8 p-8">
      {/* VARIANTES */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Variantes</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default (Primary)</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="muted">Muted</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* TAMANHOS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Tamanhos</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
          <Button size="icon"><Plus /></Button>
        </div>
      </section>

      {/* COM ÍCONES */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Com Ícones</h2>
        <div className="flex flex-wrap gap-4">
          <Button>
            <Plus />
            Adicionar Créditos
          </Button>
          <Button variant="destructive">
            <Trash2 />
            Excluir
          </Button>
          <Button variant="secondary">
            <Download />
            Baixar Relatório
          </Button>
          <Button variant="ghost">
            Ver Mais
            <ArrowRight />
          </Button>
        </div>
      </section>

      {/* LOADING STATE */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Loading State</h2>
        <div className="flex flex-wrap gap-4">
          <Button loading>Carregando...</Button>
          <Button variant="secondary" loading>Processando</Button>
          <Button variant="destructive" loading>Excluindo</Button>
        </div>
      </section>

      {/* DISABLED */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Desabilitado</h2>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Primary Disabled</Button>
          <Button variant="secondary" disabled>Secondary Disabled</Button>
          <Button variant="destructive" disabled>Destructive Disabled</Button>
        </div>
      </section>

      {/* CASOS DE USO REAIS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Casos de Uso</h2>
        <div className="space-y-4">
          {/* CTA Principal */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">CTA Principal:</p>
            <Button size="lg" className="w-full md:w-auto">
              <Plus />
              Adicionar Créditos
            </Button>
          </div>

          {/* Ações Secundárias */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Ações Secundárias:</p>
            <div className="flex gap-2">
              <Button variant="secondary">Cancelar</Button>
              <Button>Confirmar</Button>
            </div>
          </div>

          {/* Ações Destrutivas */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Ação Destrutiva:</p>
            <div className="flex gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button variant="destructive">
                <Trash2 />
                Excluir Conta
              </Button>
            </div>
          </div>

          {/* Links e Navegação */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Links e Navegação:</p>
            <div className="flex gap-2">
              <Button variant="ghost">Ver Histórico</Button>
              <Button variant="link">Saiba mais</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * GUIA DE USO
 * 
 * VARIANTES:
 * - default/primary: Ações principais, CTAs (#EE4D2D)
 * - secondary: Ações secundárias, alternativas (outline laranja)
 * - ghost: Ações terciárias, menos destaque
 * - destructive: Ações destrutivas (excluir, remover)
 * - outline: Ações neutras com borda
 * - muted: Ações de baixo destaque
 * - link: Links textuais
 * 
 * TAMANHOS:
 * - sm: Botões compactos, tabelas, cards
 * - default: Uso geral
 * - lg: CTAs, destaque
 * - xl: Landing pages, hero sections
 * - icon: Apenas ícone (quadrado)
 * 
 * PROPS:
 * - loading: boolean - Mostra spinner e desabilita
 * - disabled: boolean - Desabilita o botão
 * - asChild: boolean - Renderiza como Slot (útil com Next Link)
 * 
 * EXEMPLOS:
 * 
 * // Botão simples
 * <Button>Click me</Button>
 * 
 * // Com loading
 * <Button loading={isLoading}>Salvar</Button>
 * 
 * // Com Next.js Link
 * <Button asChild>
 *   <Link href="/dashboard">Dashboard</Link>
 * </Button>
 * 
 * // Com ícone
 * <Button>
 *   <Plus />
 *   Adicionar
 * </Button>
 */
