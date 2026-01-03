"use client"

import { Building2, Calendar, BookOpen, DollarSign, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SchoolSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">School Settings</h1>
          <p className="text-muted-foreground mt-1">Configure school profile, terms, and academic setup</p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">School Profile</TabsTrigger>
          <TabsTrigger value="terms">Terms & Calendar</TabsTrigger>
          <TabsTrigger value="classes">Classes & Subjects</TabsTrigger>
          <TabsTrigger value="fees">Fee Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <CardTitle>School Information</CardTitle>
              </div>
              <CardDescription>Basic school details and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>School Name</FieldLabel>
                <Input defaultValue="Nairobi Excellence Academy" />
              </Field>

              <Field>
                <FieldLabel>School Code</FieldLabel>
                <Input defaultValue="NEA" />
                <FieldDescription>Unique identifier for your school</FieldDescription>
              </Field>

              <Field>
                <FieldLabel>School Motto</FieldLabel>
                <Input defaultValue="Excellence Through Knowledge" />
              </Field>

              <Field>
                <FieldLabel>School Email</FieldLabel>
                <Input type="email" defaultValue="info@nea.ac.ke" />
              </Field>

              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <Input type="tel" defaultValue="+254 712 345 678" />
              </Field>

              <Field>
                <FieldLabel>Physical Address</FieldLabel>
                <Textarea defaultValue="123 Education Road, Nairobi, Kenya" rows={3} />
              </Field>

              <Field>
                <FieldLabel>School Logo</FieldLabel>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/20 border border-border">
                    <Building2 className="h-10 w-10 text-primary" />
                  </div>
                  <Button variant="outline">Upload Logo</Button>
                </div>
                <FieldDescription>Recommended size: 512x512px, PNG or JPG</FieldDescription>
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <CardTitle>Academic Terms</CardTitle>
              </div>
              <CardDescription>Configure term dates and holidays</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { name: "Term 1", start: "2025-01-06", end: "2025-04-04" },
                { name: "Term 2", start: "2025-05-05", end: "2025-08-01" },
                { name: "Term 3", start: "2025-09-02", end: "2025-11-21" },
              ].map((term, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border">
                  <p className="text-sm font-medium mb-3">{term.name}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel>Start Date</FieldLabel>
                      <Input type="date" defaultValue={term.start} />
                    </Field>
                    <Field>
                      <FieldLabel>End Date</FieldLabel>
                      <Input type="date" defaultValue={term.end} />
                    </Field>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public Holidays</CardTitle>
              <CardDescription>Mark days when school is closed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: "New Year's Day", date: "2025-01-01" },
                  { name: "Good Friday", date: "2025-04-18" },
                  { name: "Easter Monday", date: "2025-04-21" },
                  { name: "Labour Day", date: "2025-05-01" },
                  { name: "Madaraka Day", date: "2025-06-01" },
                  { name: "Mashujaa Day", date: "2025-10-20" },
                  { name: "Jamhuri Day", date: "2025-12-12" },
                ].map((holiday, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="text-sm font-medium">{holiday.name}</span>
                    <span className="text-sm text-muted-foreground">{holiday.date}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Add Holiday
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <CardTitle>Classes & Streams</CardTitle>
              </div>
              <CardDescription>Manage class structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { level: "Form 1", streams: ["A", "B", "C", "D"], capacity: 45 },
                  { level: "Form 2", streams: ["A", "B", "C", "D"], capacity: 45 },
                  { level: "Form 3", streams: ["A", "B", "C", "D"], capacity: 42 },
                  { level: "Form 4", streams: ["A", "B", "C", "D"], capacity: 40 },
                ].map((level, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium">{level.level}</p>
                      <p className="text-xs text-muted-foreground">{level.streams.length} streams</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {level.streams.map((stream, sidx) => (
                        <div key={sidx} className="px-3 py-1 rounded-md bg-accent text-sm">
                          {stream}
                        </div>
                      ))}
                    </div>
                    <Field>
                      <FieldLabel>Class Capacity</FieldLabel>
                      <Input type="number" defaultValue={level.capacity} />
                    </Field>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subjects</CardTitle>
              <CardDescription>Offered subjects and grading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: "Mathematics", code: "MAT", category: "Core" },
                  { name: "English", code: "ENG", category: "Core" },
                  { name: "Kiswahili", code: "KIS", category: "Core" },
                  { name: "Biology", code: "BIO", category: "Science" },
                  { name: "Chemistry", code: "CHE", category: "Science" },
                  { name: "Physics", code: "PHY", category: "Science" },
                  { name: "History", code: "HIS", category: "Humanities" },
                  { name: "Geography", code: "GEO", category: "Humanities" },
                ].map((subject, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">Code: {subject.code}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{subject.category}</div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Add Subject
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                <CardTitle>Fee Structure</CardTitle>
              </div>
              <CardDescription>Configure term fees by class level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { level: "Form 1", tuition: 38000, boarding: 7000, total: 45000 },
                  { level: "Form 2", tuition: 38000, boarding: 7000, total: 45000 },
                  { level: "Form 3", tuition: 40000, boarding: 7000, total: 47000 },
                  { level: "Form 4", tuition: 42000, boarding: 7000, total: 49000 },
                ].map((fee, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border">
                    <p className="text-sm font-medium mb-3">{fee.level}</p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field>
                        <FieldLabel>Tuition Fee</FieldLabel>
                        <Input type="number" defaultValue={fee.tuition} />
                      </Field>
                      <Field>
                        <FieldLabel>Boarding Fee</FieldLabel>
                        <Input type="number" defaultValue={fee.boarding} />
                      </Field>
                      <Field>
                        <FieldLabel>Total per Term</FieldLabel>
                        <Input type="number" defaultValue={fee.total} disabled />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Configure accepted payment options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { method: "M-Pesa", paybill: "123456", account: "School Fees", enabled: true },
                  { method: "Bank Transfer", bank: "KCB Bank", account: "1234567890", enabled: true },
                  { method: "Cash Payment", location: "School Bursar Office", enabled: true },
                ].map((payment, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{payment.method}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {payment.method === "M-Pesa"
                            ? `Paybill: ${payment.paybill}`
                            : payment.method === "Bank Transfer"
                              ? `${payment.bank}`
                              : payment.location}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
