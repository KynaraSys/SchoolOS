"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Database, Key } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SetupRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Supabase Setup Required</CardTitle>
              <CardDescription>Configure your database to use School OS</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Demo Mode Active</AlertTitle>
            <AlertDescription>
              You are viewing School OS in demo mode with mock data. To use the full application, please configure
              Supabase.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold">Setup Steps:</h3>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  1
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Connect Supabase Integration</p>
                  <p className="text-sm text-muted-foreground">
                    Click the "Connect" button in the sidebar or go to the Integrations section to add Supabase.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  2
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Run Database Schema</p>
                  <p className="text-sm text-muted-foreground">
                    After connecting Supabase, run the SQL scripts in the{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">scripts/</code> folder to create the database
                    tables.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  3
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Start Using School OS</p>
                  <p className="text-sm text-muted-foreground">
                    Once configured, you'll be able to create users, manage students, track attendance, and use all
                    features.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1">
              <Key className="mr-2 h-4 w-4" />
              Connect Supabase
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => window.location.reload()}>
              Continue in Demo Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
