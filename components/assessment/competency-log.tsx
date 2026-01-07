"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Brain,
    MessageCircle,
    Lightbulb,
    HeartHandshake,
    Wifi,
    BookOpen,
    Smile,
    History,
    ChevronDown
} from "lucide-react";
import { useState } from "react";

// Mock Data for Competencies
const COMPETENCIES = [
    { id: 'comm', name: "Communication & Collaboration", icon: MessageCircle, color: "text-blue-400", bg: "bg-blue-400/10" },
    { id: 'crit', name: "Critical Thinking & Problem Solving", icon: Brain, color: "text-purple-400", bg: "bg-purple-400/10" },
    { id: 'imag', name: "Imagination & Creativity", icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-400/10" },
    { id: 'citi', name: "Citizenship", icon: HeartHandshake, color: "text-red-400", bg: "bg-red-400/10" },
    { id: 'digi', name: "Digital Literacy", icon: Wifi, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { id: 'learn', name: "Learning to Learn", icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { id: 'self', name: "Self-Efficacy", icon: Smile, color: "text-pink-400", bg: "bg-pink-400/10" },
];

const HISTORY = [
    {
        id: 1,
        competencyId: 'comm',
        date: '2025-05-15',
        level: 'EE',
        indicator: 'Exceeding Expectation',
        note: 'Led the group discussion effectively during the project planning phase.',
        teacher: 'Mr. Kamau',
        color: '#10b981' // Green
    },
    {
        id: 2,
        competencyId: 'comm',
        date: '2025-04-10',
        level: 'ME',
        indicator: 'Meeting Expectation',
        note: 'Participated actively but needed some prompting to listen to others.',
        teacher: 'Mr. Kamau',
        color: '#3b82f6' // Blue
    },
    {
        id: 3,
        competencyId: 'comm',
        date: '2025-03-01',
        level: 'AE',
        indicator: 'Approaching Expectation',
        note: 'Struggled to express ideas clearly to the group.',
        teacher: 'Mrs. Wanjiku',
        color: '#f59e0b' // Amber
    }
];

export function CompetencyLog() {
    const [selectedCompetency, setSelectedCompetency] = useState(COMPETENCIES[0]);

    return (
        <div className="flex gap-6 h-[600px]">
            {/* Competency Selector (Left) */}
            <div className="w-1/3 space-y-2">
                <h3 className="text-sm font-semibold text-white/50 mb-4 px-2 tracking-wider uppercase">Core Competencies</h3>
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-2">
                        {COMPETENCIES.map((comp) => (
                            <button
                                key={comp.id}
                                onClick={() => setSelectedCompetency(comp)}
                                className={`
                                    w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left
                                    border border-transparent
                                    ${selectedCompetency.id === comp.id
                                        ? `bg-white/10 ${comp.color} border-white/10 shadow-lg`
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }
                                `}
                            >
                                <div className={`p-2 rounded-lg ${comp.bg}`}>
                                    <comp.icon className={`h-5 w-5 ${comp.color}`} />
                                </div>
                                <span className="font-medium text-sm">{comp.name}</span>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Timeline View (Right) */}
            <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col relative overflow-hidden">
                {/* Background decoration */}
                <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none ${selectedCompetency.bg.replace('/10', '/30')}`} />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${selectedCompetency.bg}`}>
                            <selectedCompetency.icon className={`h-6 w-6 ${selectedCompetency.color}`} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{selectedCompetency.name}</h2>
                            <p className="text-white/50 text-sm">Growth Timeline</p>
                        </div>
                    </div>
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 gap-2">
                        <History className="h-4 w-4" /> View Full History
                    </Button>
                </div>

                <ScrollArea className="flex-1 pr-6 -mr-6">
                    <div className="space-y-8 relative pl-6 z-10">
                        {/* Vertical Line */}
                        <div className="absolute left-[29px] top-4 bottom-0 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />

                        {HISTORY.map((entry, index) => (
                            <div key={entry.id} className="relative group animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                                {/* Timeline Dot */}
                                <div className={`
                                    absolute left-0 top-6 w-4 h-4 rounded-full border-2 border-background z-10
                                    transition-transform duration-300 group-hover:scale-125
                                `} style={{ backgroundColor: entry.color }} />

                                <Card className="ml-10 bg-black/20 border-white/10 backdrop-blur-sm group-hover:bg-white/5 transition-colors">
                                    <div className="p-4 flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge
                                                    variant="outline"
                                                    className="font-bold border-0"
                                                    style={{ backgroundColor: `${entry.color}20`, color: entry.color }}
                                                >
                                                    {entry.level}
                                                </Badge>
                                                <span className="text-sm font-medium text-white/90">{entry.indicator}</span>
                                            </div>
                                            <p className="text-sm text-white/70 italic">"{entry.note}"</p>
                                        </div>
                                        <div className="sm:text-right flex flex-col sm:items-end justify-center min-w-[100px]">
                                            <div className="text-xs text-white/40">{entry.date}</div>
                                            <div className="text-xs text-white/30">{entry.teacher}</div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}

                        {/* Start placeholder */}
                        <div className="relative">
                            <div className="absolute left-[5px] top-6 w-1.5 h-1.5 rounded-full bg-white/20 z-10" />
                            <div className="ml-10 py-6 text-sm text-white/20">
                                Tracking started for {selectedCompetency.name}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
