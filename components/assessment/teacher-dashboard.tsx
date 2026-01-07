"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Clock,
    CheckCircle2,
    AlertTriangle,
    ChevronRight,
    Calendar,
    ArrowUpRight
} from "lucide-react";
import { useRouter } from "next/navigation";

interface TeacherDashboardProps {
    stats: {
        pendingObservations: number;
        completedToday: number;
        atRiskLearners: number;
    };
    classes: {
        id: number;
        name: string;
        subject: string;
        schedule: string;
        studentsCount: number;
        pendingCount: number;
    }[];
    onSelectClass: (classId: number) => void;
}

export function TeacherDashboard({ stats, classes, onSelectClass }: TeacherDashboardProps) {
    const router = useRouter();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white/90">Assessment Overview</h1>
                    <p className="text-white/60 mt-1">Good morning! You have <span className="text-primary font-semibold">{stats.pendingObservations}</span> pending observations today.</p>
                </div>
                <Button
                    variant="ghost"
                    className="gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm"
                >
                    <Calendar className="h-4 w-4" />
                    View Schedule
                </Button>
            </div>

            {/* Quick Stats Grid - Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: "Pending Actions",
                        value: stats.pendingObservations,
                        icon: Clock,
                        color: "text-amber-400",
                        bg: "bg-amber-400/10",
                        desc: "Observations needed"
                    },
                    {
                        title: "Completed Today",
                        value: stats.completedToday,
                        icon: CheckCircle2,
                        color: "text-emerald-400",
                        bg: "bg-emerald-400/10",
                        desc: "Assessments recorded"
                    },
                    {
                        title: "Focus Learners",
                        value: stats.atRiskLearners,
                        icon: AlertTriangle,
                        color: "text-rose-400",
                        bg: "bg-rose-400/10",
                        desc: "Need support (BE)"
                    }
                ].map((stat, i) => (
                    <Card key={i} className="border-0 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 shadow-xl overflow-hidden group relative">
                        {/* Decorative glow */}
                        <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${stat.bg.replace('/10', '/30')}`} />

                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-white/70">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <p className="text-xs text-white/50">{stat.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Classes Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white/90">Today's Classes</h2>
                    <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => onSelectClass(cls.id)}
                            className="
                                cursor-pointer group
                                bg-gradient-to-br from-white/10 to-white/5 
                                hover:from-white/15 hover:to-white/10
                                border border-white/10 hover:border-white/20
                                backdrop-blur-md rounded-2xl p-6
                                transition-all duration-300
                                relative overflow-hidden
                            "
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                <ArrowUpRight className="h-5 w-5 text-white/50" />
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                        {cls.name}
                                    </h3>
                                    <p className="text-sm text-white/60 flex items-center gap-2 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-primary/50" />
                                        {cls.subject}
                                    </p>
                                </div>
                                <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0">
                                    {cls.schedule}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-500/20 p-2 rounded-full">
                                        <Users className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-white/50">Students</span>
                                        <span className="text-sm font-medium text-white">{cls.studentsCount}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-full ${cls.pendingCount > 0 ? 'bg-amber-500/20' : 'bg-green-500/20'}`}>
                                        <Clock className={`h-4 w-4 ${cls.pendingCount > 0 ? 'text-amber-400' : 'text-green-400'}`} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-white/50">Pending</span>
                                        <span className="text-sm font-medium text-white">{cls.pendingCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
