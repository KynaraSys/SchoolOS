"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"
import logoImage from "@/assets/logo.png"
import Image from "next/image"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Get CSRF Cookie from Sanctum (if using SPA mode, good practice)
      // Note: This may not be needed for stateless API token auth
      try {
        await fetch('/sanctum/csrf-cookie', { credentials: 'include' });
      } catch {
        // Ignore CSRF cookie failure - may not be configured
      }

      // 2. Login via Next.js API route (sets HttpOnly cookie)
      // We use fetch directly instead of the api client since api client
      // now points to /api/proxy for backend calls
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password, remember: rememberMe }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw { response: { status: response.status, data } };
      }

      // 3. Store user data (token is in HttpOnly cookie, not accessible here)
      login(data.access_token, data.user);

      // 4. Redirect
      router.push("/dashboard"); // Assuming main dashboard path
    } catch (err: any) {
      // console.error(err); // Suppressed to avoid noise for handled errors

      const errorMessage = err.response?.data?.message || "An error occurred during sign in.";

      if (err.response) {
        if (err.response.status === 423) {
          toast({
            variant: "destructive",
            title: "Account Locked",
            description: err.response.data.message || "Your account has been locked. Please contact your administrator.",
            duration: 5000,
          });
        } else if (err.response.status === 401) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            duration: 5000,
          });
        } else if (err.response.status === 403) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: err.response.data.message || "Your account has been deactivated.",
            duration: 5000,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login Error",
            description: errorMessage,
            duration: 5000,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "Unable to connect to the server. Please check your connection and try again.",
          duration: 5000,
        });
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
            <div className="flex h-16 w-16 items-center justify-center">
              <Image
                src={logoImage}
                alt="Kynara Systems Logo"
                width={64}
                height={64}
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
          <h1 className="text-3xl font-semibold">School OS</h1>
          <p className="text-sm font-medium text-primary mt-1">by Kynara Systems</p>
          <p className="text-muted-foreground mt-2">Sign in to your school account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Remember me
            </Label>
          </div>

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
