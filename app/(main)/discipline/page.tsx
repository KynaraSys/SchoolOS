import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import DisciplineClientPage from "./discipline-client-page"

export default async function DisciplinePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (!token || !token.value) {
    redirect("/auth/login");
  }

  return <DisciplineClientPage />
}
