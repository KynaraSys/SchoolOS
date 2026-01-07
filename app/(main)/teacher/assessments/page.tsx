"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useSearchParams } from "next/navigation";
import { TeacherDashboard } from "@/components/assessment/teacher-dashboard";
import { ClassAssessmentView } from "@/components/assessment/class-assessment-view";
import { assessmentApi, GradingScale } from "@/lib/api-assessment";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function AssessmentPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'dashboard' | 'class'>('dashboard');

    // Data
    const [stats, setStats] = useState({
        pendingObservations: 12,
        completedToday: 5,
        atRiskLearners: 3
    });
    const [classes, setClasses] = useState<any[]>([]); // List of classes
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [classData, setClassData] = useState<any>(null); // Details of selected class

    // Config
    const [pureScales, setPureScales] = useState<GradingScale[]>([]);
    const [hybridScales, setHybridScales] = useState<GradingScale[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    // Check for deep link
    useEffect(() => {
        const classId = searchParams.get('classId');
        if (classId) {
            handleSelectClass(parseInt(classId));
        }
    }, [searchParams]);

    const loadData = async () => {
        try {
            setLoading(true);

            // 1. Load Scales
            const scalesRes = await assessmentApi.getGradingScales();
            setPureScales(scalesRes.pure);
            setHybridScales(scalesRes.hybrid);

            // 2. Load classes (mocking for now, replace with API)
            // Ideally: api.get('/teacher/dashboard-stats')
            setClasses([
                {
                    id: 1,
                    name: "Grade 1 Blue",
                    subject: "Mathematics",
                    schedule: "08:00 AM",
                    studentsCount: 24,
                    pendingCount: 5
                },
                {
                    id: 2,
                    name: "Grade 2 Red",
                    subject: "English Activities",
                    schedule: "10:00 AM",
                    studentsCount: 22,
                    pendingCount: 0
                }
            ]);

            // Mock class data for detail view
            setClassData({
                id: 1,
                name: "Grade 1 Blue",
                students: [
                    { id: 101, name: "Amani Kamau" },
                    { id: 102, name: "Baraka Ochieng" },
                    { id: 103, name: "Chomba Njoroge" },
                    { id: 104, name: "Dalia Wanjiku" },
                    { id: 105, name: "Ezra Kiptoo" },
                ],
                subjects: [
                    { id: 1, name: "Mathematics" },
                    { id: 2, name: "English Activities" },
                    { id: 3, name: "Environmental Activities" },
                ]
            });

        } catch (error) {
            console.error(error);
            toast({ title: "Error loading data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSelectClass = (classId: number) => {
        setSelectedClassId(classId);
        // In real app, fetch class data here if not loaded
        setView('class');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        view === 'dashboard' ? (
            <TeacherDashboard
                stats={stats}
                classes={classes}
                onSelectClass={handleSelectClass}
            />
        ) : (
            <ClassAssessmentView
                classData={classData}
                gradingScales={{ pure: pureScales, hybrid: hybridScales }}
                onBack={() => setView('dashboard')}
            />
        )
    );
}
