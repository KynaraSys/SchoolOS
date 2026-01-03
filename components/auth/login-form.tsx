"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Alert } from "@/components/ui/alert"
import { GraduationCap } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Get CSRF Cookie from Sanctum (if using SPA mode, good practice)
      await api.get('/sanctum/csrf-cookie', { baseURL: '' });

      // 2. Login (Internal Route)
      // Note: We use axios here but targeting the internal Next.js API route
      // which is served at /api/auth/login (not the proxied backend /api/login)
      // Since baseURL is '/api', we need to be careful.
      // If we use `api` instance, it prepends `/api`.
      // So `api.post('/auth/login')` -> `/api/auth/login`. This is correct.

      const response = await api.post('/auth/login', {
        email,
        password
      });

      // 3. Store Token (for client-side access if needed) & User
      login(response.data.access_token, response.data.user);

      // 4. Redirect
      router.push("/dashboard"); // Assuming main dashboard path
    } catch (err: any) {
      // console.error(err); // Suppressed to avoid noise for handled errors

      const errorMessage = err.response?.data?.message || "An error occurred during sign in.";

      if (err.response) {
        if (err.response.status === 423) {
          setError(err.response.data.message || "Account locked.");
        } else if (err.response.status === 401) {
          setError("Invalid email or password.");
        } else if (err.response.status === 403) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: err.response.data.message || "Your account has been deactivated.",
          })
        } else {
          setError(errorMessage);
        }
      } else {
        setError("Connection failed. Please check the backend URL.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold">School OS</h1>
          <p className="text-sm font-medium text-primary mt-1">by Kynara Systems</p>
          <p className="text-muted-foreground mt-2">Sign in to your school account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="text-sm">
              {error}
            </Alert>
          )}

          <Field>
            <FieldLabel>Email Address</FieldLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="principal@yourschool.ac.ke"
              required
              autoComplete="email"
            />
          </Field>

          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <FieldDescription>
              <a href="/auth/forgot-password" className="text-primary hover:underline text-sm">
                Forgot your password?
              </a>
            </FieldDescription>
          </Field>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Need access?{" "}
          <a href="/auth/request-access" className="text-primary hover:underline">
            Contact your school administrator
          </a>
        </p>
      </div>
    </div>
  )
}
