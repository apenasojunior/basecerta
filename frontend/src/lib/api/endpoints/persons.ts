import type { Person, PersonSearchFilters, PersonSearchResult } from "@/types/person"

/**
 * Mock data para demonstração
 */
const MOCK_PERSONS: Person[] = [
  {
    id: "1",
    cpf: "12345678901",
    nomeCompleto: "João Silva Santos",
    dataNascimento: "1989-05-15",
    idade: 35,
    sexo: "M",
    estadoCivil: "CASADO",
    uf: "SP",
    municipio: "São Paulo",
    status: "REGULAR",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    cpf: "98765432109",
    nomeCompleto: "Maria Oliveira Costa",
    dataNascimento: "1996-08-22",
    idade: 28,
    sexo: "F",
    estadoCivil: "SOLTEIRO",
    uf: "RJ",
    municipio: "Rio de Janeiro",
    status: "PENDENCIAS",
    email: "maria.costa@email.com",
    telefone: "(21) 91234-5678",
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "3",
    cpf: "45678912301",
    nomeCompleto: "Carlos Eduardo Ferreira",
    dataNascimento: "1982-03-10",
    idade: 42,
    sexo: "M",
    estadoCivil: "DIVORCIADO",
    uf: "MG",
    municipio: "Belo Horizonte",
    status: "RESTRICOES",
    email: "carlos.ferreira@email.com",
    telefone: "(31) 99876-5432",
    createdAt: "2024-01-10T08:45:00Z",
    updatedAt: "2024-01-18T16:30:00Z",
  },
  {
    id: "4",
    cpf: "78912345602",
    nomeCompleto: "Ana Paula Rodrigues",
    dataNascimento: "1993-11-28",
    idade: 31,
    sexo: "F",
    estadoCivil: "UNIAO_ESTAVEL",
    uf: "RS",
    municipio: "Porto Alegre",
    status: "REGULAR",
    email: "ana.rodrigues@email.com",
    telefone: "(51) 98888-7777",
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-12T11:00:00Z",
  },
  {
    id: "5",
    cpf: "32165498703",
    nomeCompleto: "Pedro Henrique Alves",
    dataNascimento: "1999-07-05",
    idade: 25,
    sexo: "M",
    estadoCivil: "SOLTEIRO",
    uf: "BA",
    municipio: "Salvador",
    status: "REGULAR",
    email: "pedro.alves@email.com",
    telefone: "(71) 97777-6666",
    createdAt: "2024-01-14T13:30:00Z",
    updatedAt: "2024-01-14T13:30:00Z",
  },
  {
    id: "6",
    cpf: "65432198704",
    nomeCompleto: "Juliana Martins Souza",
    dataNascimento: "1987-12-18",
    idade: 37,
    sexo: "F",
    estadoCivil: "CASADO",
    uf: "PR",
    municipio: "Curitiba",
    status: "REGULAR",
    email: "juliana.souza@email.com",
    telefone: "(41) 96666-5555",
    createdAt: "2024-01-17T09:20:00Z",
    updatedAt: "2024-01-17T09:20:00Z",
  },
  {
    id: "7",
    cpf: "15975348605",
    nomeCompleto: "Roberto Carlos Lima",
    dataNascimento: "1975-04-30",
    idade: 49,
    sexo: "M",
    estadoCivil: "VIUVO",
    uf: "CE",
    municipio: "Fortaleza",
    status: "PENDENCIAS",
    email: "roberto.lima@email.com",
    telefone: "(85) 95555-4444",
    createdAt: "2024-01-11T15:45:00Z",
    updatedAt: "2024-01-19T10:20:00Z",
  },
  {
    id: "8",
    cpf: "75395148606",
    nomeCompleto: "Fernanda Cristina Pereira",
    dataNascimento: "1991-09-12",
    idade: 33,
    sexo: "F",
    estadoCivil: "SEPARADO",
    uf: "SC",
    municipio: "Florianópolis",
    status: "REGULAR",
    email: "fernanda.pereira@email.com",
    telefone: "(48) 94444-3333",
    createdAt: "2024-01-13T12:10:00Z",
    updatedAt: "2024-01-13T12:10:00Z",
  },
]

/**
 * Busca pessoas por CPF ou nome
 */
export async function searchPersons(params: {
  searchType: "cpf" | "nome"
  searchValue: string
  filters?: PersonSearchFilters
  page?: number
  pageSize?: number
}): Promise<PersonSearchResult> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 800))

  const { searchType, searchValue, filters, page = 1, pageSize = 10 } = params

  // Filtrar por tipo de busca
  let results = MOCK_PERSONS

  if (searchType === "cpf") {
    const cleanCPF = searchValue.replace(/\D/g, "")
    results = results.filter((p) => p.cpf.includes(cleanCPF))
  } else {
    const lowerSearch = searchValue.toLowerCase()
    results = results.filter((p) =>
      p.nomeCompleto.toLowerCase().includes(lowerSearch)
    )
  }

  // Aplicar filtros adicionais
  if (filters) {
    if (filters.uf) {
      results = results.filter((p) => p.uf === filters.uf)
    }
    if (filters.sexo) {
      results = results.filter((p) => p.sexo === filters.sexo)
    }
    if (filters.estadoCivil) {
      results = results.filter((p) => p.estadoCivil === filters.estadoCivil)
    }
    if (filters.faixaEtaria) {
      const [min, max] = filters.faixaEtaria.split("-").map(Number)
      results = results.filter((p) => p.idade >= min && p.idade <= max)
    }
  }

  // Paginação
  const total = results.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedResults = results.slice(start, end)

  return {
    data: paginatedResults,
    total,
    page,
    pageSize,
    hasNext: end < total,
    hasPrev: page > 1,
  }
}

/**
 * Busca uma pessoa por ID
 */
export async function getPersonById(id: string): Promise<Person | null> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  return MOCK_PERSONS.find((p) => p.id === id) || null
}

/**
 * Busca uma pessoa por CPF exato
 */
export async function getPersonByCPF(cpf: string): Promise<Person | null> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  const cleanCPF = cpf.replace(/\D/g, "")
  return MOCK_PERSONS.find((p) => p.cpf === cleanCPF) || null
}
