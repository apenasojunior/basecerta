import { FormInput } from "@/components/forms/FormInput"
import { Mail, Lock, User, Search } from "lucide-react"

/**
 * FormInput Component - Input de texto com label, validação e estados
 * 
 * @example
 * // Input básico
 * <FormInput
 *   label="Email"
 *   type="email"
 *   placeholder="seu@email.com"
 * />
 * 
 * @example
 * // Input obrigatório com hint
 * <FormInput
 *   label="Nome completo"
 *   required
 *   hint="Digite seu nome como aparece no documento"
 * />
 * 
 * @example
 * // Input com erro
 * <FormInput
 *   label="Email"
 *   type="email"
 *   error="Email inválido"
 *   defaultValue="email-invalido"
 * />
 * 
 * @example
 * // Input com sucesso
 * <FormInput
 *   label="Email"
 *   type="email"
 *   showSuccessIcon
 *   defaultValue="valid@email.com"
 * />
 * 
 * @example
 * // Input com ícone prefix
 * <FormInput
 *   label="Email"
 *   type="email"
 *   prefixIcon={<Mail className="h-4 w-4" />}
 *   placeholder="seu@email.com"
 * />
 * 
 * @example
 * // Input de busca com ícone
 * <FormInput
 *   label="Buscar"
 *   prefixIcon={<Search className="h-4 w-4" />}
 *   placeholder="Digite para buscar..."
 * />
 * 
 * @example
 * // Input com React Hook Form
 * import { useForm } from "react-hook-form"
 * 
 * function MyForm() {
 *   const { register, formState: { errors } } = useForm()
 *   
 *   return (
 *     <FormInput
 *       label="Email"
 *       {...register("email", { required: "Email é obrigatório" })}
 *       error={errors.email?.message}
 *       required
 *     />
 *   )
 * }
 * 
 * @example
 * // Estados de variante
 * <div className="space-y-4">
 *   <FormInput label="Default" defaultValue="valor" />
 *   <FormInput label="Error" variant="error" defaultValue="valor" />
 *   <FormInput label="Success" variant="success" defaultValue="valor" />
 *   <FormInput label="Warning" variant="warning" defaultValue="valor" />
 * </div>
 * 
 * @example
 * // Disabled
 * <FormInput
 *   label="Campo desabilitado"
 *   disabled
 *   defaultValue="Não editável"
 * />
 */

export default function FormInputExample() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">FormInput Examples</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Estados Básicos</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                label="Input Normal"
                placeholder="Digite algo..."
              />
              
              <FormInput
                label="Input Obrigatório"
                required
                placeholder="Campo obrigatório"
              />
              
              <FormInput
                label="Com Hint"
                hint="Este é um texto de ajuda"
                placeholder="Digite..."
              />
              
              <FormInput
                label="Com Erro"
                error="Este campo é obrigatório"
                defaultValue="valor inválido"
              />
              
              <FormInput
                label="Com Sucesso"
                showSuccessIcon
                defaultValue="email@valido.com"
              />
              
              <FormInput
                label="Desabilitado"
                disabled
                defaultValue="Campo desabilitado"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Com Ícones</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                label="Email"
                type="email"
                prefixIcon={<Mail className="h-4 w-4" />}
                placeholder="seu@email.com"
              />
              
              <FormInput
                label="Senha"
                type="password"
                prefixIcon={<Lock className="h-4 w-4" />}
                placeholder="Digite sua senha"
              />
              
              <FormInput
                label="Nome de usuário"
                prefixIcon={<User className="h-4 w-4" />}
                placeholder="@usuario"
              />
              
              <FormInput
                label="Buscar"
                prefixIcon={<Search className="h-4 w-4" />}
                placeholder="Digite para buscar..."
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Variantes</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                label="Default"
                variant="default"
                defaultValue="Valor padrão"
              />
              
              <FormInput
                label="Error"
                variant="error"
                defaultValue="Valor com erro"
              />
              
              <FormInput
                label="Success"
                variant="success"
                defaultValue="Valor correto"
              />
              
              <FormInput
                label="Warning"
                variant="warning"
                defaultValue="Atenção"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Tipos de Input</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                label="Text"
                type="text"
                placeholder="Texto"
              />
              
              <FormInput
                label="Email"
                type="email"
                placeholder="email@exemplo.com"
              />
              
              <FormInput
                label="Password"
                type="password"
                placeholder="••••••••"
              />
              
              <FormInput
                label="Number"
                type="number"
                placeholder="123"
              />
              
              <FormInput
                label="Tel"
                type="tel"
                placeholder="(11) 98765-4321"
              />
              
              <FormInput
                label="URL"
                type="url"
                placeholder="https://exemplo.com"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
