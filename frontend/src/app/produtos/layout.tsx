import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function ProdutosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
