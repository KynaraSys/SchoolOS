"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Filter, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

// Import other components we'll need
import { ObservationCard } from "./observation-card";
import { WrittenTestGrid } from "./written-test-grid";
import { GradingScale } from "@/lib/api-assessment";

interface ClassAssessmentViewProps {
    classData: {
        id: number;
        name: string;
        students: any[];
    };
    gradingScales: {
        pure: GradingScale[];
        hybrid: GradingScale[];
    };
    onBack: () => void;
}

export function ClassAssessmentView({ classData, gradingScales, onBack }: ClassAssessmentViewProps) {
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(classData.students[0]?.id || null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("observation");

    // Filter students
    const filteredStudents = classData.students.filter(s =>
        s.name.toLowerCase().replace(/\s+/g, "").includes(searchQuery.toLowerCase().replace(/\s+/g, ""))
    );

    const selectedStudent = classData.students.find(s => s.id === selectedStudentId);

    // Placeholder scores state for written test (can lift up later)
    const [scores, setScores] = useState<Record<number, number | string>>({});

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in zoom-in-95 duration-300">
            {/* Toolbar */}
            <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-white/10 text-white">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-xl font-bold text-white">{classData.name}</h2>
                    <p className="text-xs text-white/50">{classData.students.length} Learners</p>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" />
                        <Input
                            placeholder="Find learner..."
                            className="pl-9 w-64 bg-white/5 border-white/10 text-white rounded-full focus:bg-white/10 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Split Content */}
            <div className="flex-1 flex gap-6 overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">

                {/* Left Panel: Student List */}
                <div className="w-72 flex flex-col border-r border-white/10 bg-black/10">
                    <div className="p-4 border-b border-white/10 bg-white/5">
                        <div className="flex items-center justify-between text-xs font-medium text-white/60">
                            <span>LEARNERS</span>
                            <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                                <Filter className="h-3 w-3" />
                                <span>Sort</span>
                            </div>
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {filteredStudents.map(student => (
                                <button
                                    key={student.id}
                                    onClick={() => setSelectedStudentId(student.id)}
                                    className={`
                                        w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left
                                        ${selectedStudentId === student.id
                                            ? 'bg-primary/20 text-white shadow-lg ring-1 ring-primary/40'
                                            : 'text-white/70 hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <Avatar className="h-9 w-9 border border-white/10">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                                        <AvatarFallback className="bg-primary text-white text-xs">
                                            {student.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium truncate">{student.name}</p>
                                        <p className="text-xs text-white/40 truncate">
                                            {/* Could show status here like "Pending" */}
                                            Ready for assessment
                                        </p>
                                    </div>
                                    {selectedStudentId === student.id && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Panel: Assessment Zone */}
                <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        <div className="px-6 pt-6 pb-2 border-b border-white/5">
                            <TabsList className="bg-black/20 text-white/60">
                                <TabsTrigger value="observation" className="data-[state=active]:bg-primary data-[state=active]:text-white">Observation</TabsTrigger>
                                <TabsTrigger value="written" className="data-[state=active]:bg-primary data-[state=active]:text-white">Written Test</TabsTrigger>
                                <TabsTrigger value="competency" className="data-[state=active]:bg-primary data-[state=active]:text-white">Competencies</TabsTrigger>
                                <TabsTrigger value="portfolio" className="data-[state=active]:bg-primary data-[state=active]:text-white">Portfolio</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {activeTab === "observation" && selectedStudent && (
                                <div className="max-w-2xl mx-auto animate-in slide-in-from-right-4 duration-300">
                                    <ObservationCard
                                        student={selectedStudent}
                                        gradingScales={gradingScales.pure}
                                        onSave={async (data) => console.log('Saved', data)} // Placeholder
                                    />
                                </div>
                            )}

                            {activeTab === "written" && (
                                <div className="animate-in slide-in-from-right-4 duration-300">
                                    {/* WrittenTestGrid handles all students, so it might break the split pattern conceptually unless adapted.
                                        For this view, we might want to show just this student's history OR switch to grid view.
                                        Let's just show the grid for the whole class here but highlight the selected row.
                                    */}
                                    <WrittenTestGrid
                                        students={classData.students}
                                        gradingScales={gradingScales.hybrid}
                                        scores={scores}
                                        onScoreChange={(sid, val) => setScores(prev => ({ ...prev, [sid]: val }))}
                                    />
                                </div>
                            )}

                            {activeTab === "competency" && (
                                <div className="flex flex-col items-center justify-center h-full text-white/40">
                                    <p>Select a competency to track progress over time.</p>
                                    <p className="text-xs mt-2">(Module coming soon)</p>
                                </div>
                            )}

                            {activeTab === "portfolio" && (
                                <div className="flex flex-col items-center justify-center h-full text-white/40">
                                    <p>Student Portfolio Gallery</p>
                                    <p className="text-xs mt-2">(Module coming soon)</p>
                                </div>
                            )}
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
