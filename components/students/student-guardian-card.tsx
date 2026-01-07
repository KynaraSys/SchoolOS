import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MessageSquare, ShieldCheck, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface Guardian {
    id: number
    user_id?: number | null
    first_name: string
    last_name: string
    relationship_type: string
    phone_number?: string // Optional/Masked
    email?: string // Optional/Hidden
    pivot?: {
        is_primary: boolean
    }
}

interface GuardianCardProps {
    guardian: Guardian
    studentId: string | number
}

export function GuardianCard({ guardian, studentId }: GuardianCardProps) {
    const router = useRouter()

    // Check if phone is masked (starts with *) or missing
    const isPhoneMasked = guardian.phone_number?.startsWith('*')
    const hasPhone = !!guardian.phone_number

    const handleMessage = () => {
        // Navigate to communication page with recipient context
        // Must use the Guardian's LINKED USER ID, not the guardian record ID
        if (guardian.user_id) {
            router.push(`/communication?recipientId=${guardian.user_id}&type=guardian`)
        }
    }

    return (
        <Card className="overflow-hidden border-l-4 border-l-primary/20">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            {guardian.first_name} {guardian.last_name}
                            {guardian.pivot?.is_primary && (
                                <Badge variant="secondary" className="text-[10px] h-5">Primary</Badge>
                            )}
                        </CardTitle>
                        <CardDescription className="capitalize flex items-center gap-1">
                            <User className="h-3 w-3" /> {guardian.relationship_type}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
                {/* Contact Info Section */}
                <div className="space-y-1">
                    {hasPhone ? (
                        <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 p-2 rounded-md">
                            <Phone className="h-3.5 w-3.5" />
                            <span className="font-mono">{guardian.phone_number}</span>
                            {isPhoneMasked && (
                                <span className="text-[10px] text-muted-foreground ml-auto italic">Masked</span>
                            )}
                        </div>
                    ) : (
                        <div className="text-muted-foreground text-xs italic flex items-center gap-1.5 p-1">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Contact details hidden for privacy</span>
                        </div>
                    )}

                    {guardian.email && (
                        <div className="flex items-center gap-2 text-muted-foreground p-2">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{guardian.email}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!guardian.user_id}
                        className="w-full gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
                        onClick={handleMessage}
                    >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Message Parent
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground mt-2">
                        Shown for educational communication only
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
