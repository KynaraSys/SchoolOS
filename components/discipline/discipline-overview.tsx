"use client"

import { useState, useEffect } from "react"
import { ShieldAlert, TrendingDown, AlertTriangle, CheckCircle2, Plus, Loader2, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { User } from "@/lib/types/roles"
import api from "@/lib/api"
import { format } from "date-fns"
import { updateIncident, getAssignees } from "@/lib/api-discipline"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DisciplineOverviewProps {
  user: User | null
}

interface Incident {
  id: number
  student: {
    first_name: string
    last_name: string
    admission_number: string
  }
  reporter_id: number
  reporter: {
    id: number
    name: string
  }
  assigned_to: number | null
  title: string
  description?: string
  action_taken?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed' | 'escalated'
  occurred_at: string
  created_at: string
}

import { ReportIssueModal } from "./report-issue-modal"

// ... (previous imports)

export default function DisciplineOverview({ user }: DisciplineOverviewProps) {
  // Determine if view should be restricted (Normal Teacher)
  // Allowed roles for full view: admin, principal, academic_director
  const FullAccessRoles = ['owner', 'principal', 'academic_director', 'ict_admin', 'bursar'];
  const isRestrictedView = user && !FullAccessRoles.includes(user.role);

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  // Review State
  const [reviewIncidentId, setReviewIncidentId] = useState<number | null>(null)
  const [reviewForm, setReviewForm] = useState({ status: '', action_taken: '', comment: '', assigned_to: '' })
  const [isUpdating, setIsUpdating] = useState(false)
  const [assignees, setAssignees] = useState<{ id: number, name: string }[]>([])

  const fetchIncidents = async () => {
    try {
      const response = await api.get('/incidents');
      setIncidents(response.data);
    } catch (error) {
      console.error("Failed to fetch incidents", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignees = async () => {
    try {
      const data = await getAssignees();
      setAssignees(data);
    } catch (error) {
      console.error("Failed to fetch assignees", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchIncidents();
      fetchAssignees();
    }
  }, [user]);

  const handleReviewClick = (incident: Incident) => {
    setReviewIncidentId(incident.id)
    setReviewForm({
      status: incident.status,
      action_taken: '',
      comment: '',
      assigned_to: incident.assigned_to ? incident.assigned_to.toString() : ''
    })
  }

  const submitReview = async () => {
    if (!reviewIncidentId) return;
    setIsUpdating(true)
    try {
      await updateIncident(reviewIncidentId, reviewForm)

      // Refresh local state
      setIncidents(prev => prev.map(inc =>
        inc.id === reviewIncidentId
          ? {
            ...inc,
            ...reviewForm,
            assigned_to: reviewForm.assigned_to ? parseInt(reviewForm.assigned_to) : null
          } as Incident
          : inc
      ))

      setReviewIncidentId(null)
    } catch (error) {
      console.error("Failed to update incident", error)
      alert("Failed to update incident")
    } finally {
      setIsUpdating(false)
    }
  }

  // Derived stats from real data
  const totalIncidents = incidents.length;
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length;
  const pendingCount = incidents.filter(i => i.status === 'pending').length;

  // Calculate resolution rate
  const resolutionRate = totalIncidents > 0 ? Math.round((resolvedCount / totalIncidents) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Report Issue Modal */}
      <ReportIssueModal
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        onSuccess={fetchIncidents}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Discipline Management</h1>
          <p className="text-muted-foreground mt-1">
            {isRestrictedView
              ? "View and manage your reported incidents"
              : "Track behavioral incidents and escalation workflows"}
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsReportModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Log Incident
        </Button>
      </div>

      {/* Review Incident Dialog */}
      <Dialog open={!!reviewIncidentId} onOpenChange={(open) => !open && setReviewIncidentId(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Disciplinary Case</DialogTitle>
          </DialogHeader>

          {(() => {
            const activeIncident = incidents.find(i => i.id === reviewIncidentId);
            if (!activeIncident) return null;

            return (
              <div className="space-y-4 py-4">
                {/* Case Summary */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{activeIncident.student.first_name} {activeIncident.student.last_name}</h3>
                      <p className="text-sm text-muted-foreground">Adm: {activeIncident.student.admission_number}</p>
                    </div>
                    <Badge variant={activeIncident.severity === "high" || activeIncident.severity === "critical" ? "destructive" : "secondary"}>
                      {activeIncident.severity.toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Incident</p>
                    <p className="text-sm">{activeIncident.title}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground bg-background p-2 rounded border">{activeIncident.description || 'No description provided.'}</p>
                  </div>

                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <p>Occurred: {format(new Date(activeIncident.occurred_at), "PPP")}</p>
                    <p>Reported: {format(new Date(activeIncident.created_at), "PPP")}</p>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Reported By: <span className="text-foreground">{activeIncident.reporter?.name || 'Unknown'}</span></p>
                </div>

                <div className="border-t my-4"></div>

                <div className="space-y-2">
                  <Label>Case Status</Label>
                  <Select
                    value={reviewForm.status}
                    onValueChange={(val) => setReviewForm(prev => ({ ...prev, status: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="escalated">Escalated</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>

                    </SelectContent>
                  </Select>
                </div>

                {reviewForm.status === 'escalated' && (
                  <div className="space-y-2">
                    <Label>Escalate To</Label>
                    <Select
                      value={reviewForm.assigned_to}
                      onValueChange={(val) => setReviewForm(prev => ({ ...prev, assigned_to: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignees.map(staff => (
                          <SelectItem key={staff.id} value={staff.id.toString()}>{staff.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Resolution / Review Comment</Label>
                  <Textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Add a comment about this status change..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Action Taken / Resolution Notes</Label>
                  <Textarea
                    value={reviewForm.action_taken}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, action_taken: e.target.value }))}
                    placeholder="Describe the action taken or resolution details..."
                    rows={4}
                  />
                </div>
              </div>
            );
          })()}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setReviewIncidentId(null)}>Cancel</Button>
            <Button onClick={submitReview} disabled={isUpdating}>
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Update Case
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {
        loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Stats - HIDDEN for Teachers */}
            {!isRestrictedView && (
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      Total Incidents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{totalIncidents}</div>
                    <p className="text-xs text-muted-foreground mt-1">All time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Resolved
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-success">{resolvedCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">{resolutionRate}% resolution rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Pending Review
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-warning">
                      {incidents.filter(i => i.status === 'pending' || i.status === 'under_review').length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Requires action</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" />
                      Trend
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-success">-</div>
                    <p className="text-xs text-muted-foreground mt-1">vs. last info</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Pending escalations - HIDDEN for Teachers */}
            {!isRestrictedView && (
              <Card className="border-warning/50 bg-warning/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Pending Action</CardTitle>
                      <CardDescription>Cases requiring review or further action</CardDescription>
                    </div>
                    <Badge variant="outline" className="border-warning text-warning">
                      {incidents.filter(i => ['pending', 'under_review'].includes(i.status)).length} Cases
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {incidents
                    .filter(i => ['pending', 'under_review'].includes(i.status))
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5) // Increased slice to show more given the broader scope
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.student.first_name} {item.student.last_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{format(new Date(item.occurred_at), "MMM d, yyyy")}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={item.severity === "high" || item.severity === "critical" ? "destructive" : "secondary"}>{item.severity}</Badge>
                          <Badge variant="outline" className={
                            item.status === 'escalated' ? "border-orange-500 text-orange-500" :
                              item.status === 'under_review' ? "border-blue-500 text-blue-500" :
                                "border-gray-500 text-gray-500"
                          }>{item.status.replace('_', ' ')}</Badge>
                          <Button size="sm" variant="outline" onClick={() => handleReviewClick(item)}>
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  {incidents.filter(i => ['pending', 'under_review'].includes(i.status)).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center">No pending cases.</p>
                  )}

                </CardContent>
              </Card>
            )}

            {/* Recent Incidents (My Reports for Teachers) */}
            <Card>
              <CardHeader>
                <CardTitle>{isRestrictedView ? "My Reported Incidents" : "All Recent Incidents"}</CardTitle>
                <CardDescription>
                  {isRestrictedView ? "Incidents you have logged" : "System-wide incidents"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search incidents by student name, admission, or title..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    {incidents
                      .filter(incident => {
                        const query = searchQuery.toLowerCase();
                        return (
                          incident.student?.first_name.toLowerCase().includes(query) ||
                          incident.student?.last_name.toLowerCase().includes(query) ||
                          incident.student?.admission_number.toLowerCase().includes(query) ||
                          incident.title.toLowerCase().includes(query)
                        );
                      })
                      .map((incident, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{incident.student?.first_name} {incident.student?.last_name} ({incident.student?.admission_number})</p>
                            <p className="text-xs text-muted-foreground">
                              {incident.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Action: {incident.action_taken || 'None'} · {format(new Date(incident.occurred_at), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge variant={
                            incident.status === "resolved" ? "default" :
                              incident.status === "dismissed" ? "secondary" :
                                incident.status === "escalated" ? "destructive" :
                                  incident.status === "under_review" ? "outline" : "outline" // outline for pending/under_review
                          } className={
                            incident.status === "under_review" ? "border-blue-500 text-blue-500" : ""
                          }>{incident.status.replace('_', ' ')}</Badge>
                        </div>
                      ))}
                    {incidents.filter(incident => {
                      const query = searchQuery.toLowerCase();
                      return (
                        incident.student?.first_name.toLowerCase().includes(query) ||
                        incident.student?.last_name.toLowerCase().includes(query) ||
                        incident.student?.admission_number.toLowerCase().includes(query) ||
                        incident.title.toLowerCase().includes(query)
                      );
                    }).length === 0 && (
                        <p className="text-sm text-muted-foreground p-4 text-center">No incidents found.</p>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Incident types - HIDDEN for Teachers */}
            {!isRestrictedView && (
              <Card>
                <CardHeader>
                  <CardTitle>Incident Categories</CardTitle>
                  <CardDescription>Breakdown by type this term</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Simple dynamic aggregation for demo purposes */}
                    {Object.entries(incidents.reduce((acc, curr) => {
                      acc[curr.title] = (acc[curr.title] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)).slice(0, 5).map(([type, count], idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{type}</span>
                            <span className="text-sm text-muted-foreground">
                              {count} incidents ({Math.round((count / totalIncidents) * 100)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )
      }
    </div >
  )
}
