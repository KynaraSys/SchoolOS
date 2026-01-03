import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-user"

export async function withAuth() {
  const user = await getCurrentUser()

  if (!user) {
    // If we are server-side and can't find a user, we redirect to login.
    // This assumes pages using withAuth REQUIRE authentication.
    redirect("/auth/login")
  }

  return user
}
