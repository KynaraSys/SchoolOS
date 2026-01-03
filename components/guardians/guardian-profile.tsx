import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Briefcase, User, CheckCircle2, XCircle, MessageSquare, ShieldCheck, Pencil } from "lucide-react"
import EditGuardianDialog from "@/components/guardians/edit-guardian-dialog"

interface StudentPivot {
    is_primary: boolean
    receives_sms: boolean
    receives_email: boolean
}

interface Student {
    id: number
    name: string
    pivot: StudentPivot
}

interface Guardian {
    id: number
    first_name: string
    last_name: string
    phone_number: string
    email: string
    national_id: string
    relationship_type: string
    address: string
    occupation: string
    created_at: string
    is_active: boolean
    students?: Student[]
}

interface GuardianProfileProps {
    guardian: Guardian
    onUpdate?: () => void
}

export default function GuardianProfile({ guardian, onUpdate }: GuardianProfileProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Left: Identity */}
                    <div className="flex items-center gap-4 shrink-0 lg:w-[300px] border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 lg:pr-4">
                        <Avatar className="h-14 w-14 border border-border">
                            <AvatarFallback className="text-lg bg-muted text-muted-foreground font-semibold">
                                {guardian.first_name[0]}{guardian.last_name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5 flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg leading-none">
                                    {guardian.first_name} {guardian.last_name}
                                </h3>
                                <Badge variant={guardian.is_active ? "default" : "destructive"} className={`h-4 text-[9px] px-1 rounded-sm ${guardian.is_active ? "bg-green-600 hover:bg-green-700 text-white border-none" : ""}`}>
                                    {guardian.is_active ? "ACTIVE" : "INACTIVE"}
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 ml-auto lg:ml-2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setIsEditOpen(true)}
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                                <User className="h-3 w-3" />
                                {guardian.relationship_type.toUpperCase()}
                            </p>
                        </div>
                    </div>

                    {/* Right: Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 flex-1 w-full text-sm">
                        <div className="flex items-start gap-2.5">
                            <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="space-y-0.5">
                                <p className="text-xs font-medium text-muted-foreground">Phone</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-foreground">{guardian.phone_number}</span>
                                    <ShieldCheck className="h-3 w-3 text-green-600" aria-label="Verified" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                            <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="space-y-0.5 group">
                                <p className="text-xs font-medium text-muted-foreground">Email</p>
                                <p className="font-medium text-foreground truncate max-w-[180px]" title={guardian.email}>
                                    {guardian.email || "—"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                            <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="space-y-0.5">
                                <p className="text-xs font-medium text-muted-foreground">Occupation</p>
                                <p className="font-medium text-foreground truncate" title={guardian.occupation}>
                                    {guardian.occupation || "—"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="space-y-0.5">
                                <p className="text-xs font-medium text-muted-foreground">Address</p>
                                <p className="font-medium text-foreground truncate max-w-[200px]" title={guardian.address}>
                                    {guardian.address || "—"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                            <ShieldCheck className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="space-y-0.5">
                                <p className="text-xs font-medium text-muted-foreground">National ID</p>
                                <p className="font-medium text-foreground">
                                    {guardian.national_id || "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <EditGuardianDialog
                guardian={guardian}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                onSuccess={() => {
                    if (onUpdate) onUpdate()
                }}
            />
        </Card>
    )
}
