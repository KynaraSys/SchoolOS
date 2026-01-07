import { useState, useMemo } from 'react';
import { GradingScale } from '@/lib/api-assessment'; // Fixed import path
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface WrittenTestGridProps {
    students: any[]; // Replace with Student type
    gradingScales: GradingScale[];
    onScoreChange: (studentId: number, score: number | string) => void;
    scores: Record<number, number | string>;
}

export function WrittenTestGrid({ students, gradingScales, onScoreChange, scores }: WrittenTestGridProps) {

    const getIndicator = (score: number) => {
        if (isNaN(score) || score === null) return null;
        return gradingScales.find(s =>
            s.min_score !== undefined &&
            s.max_score !== undefined &&
            score >= s.min_score &&
            score <= s.max_score
        );
    };

    return (
        <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                        <th className="px-4 py-3 font-medium">Student</th>
                        <th className="px-4 py-3 font-medium w-32">Score (0-100)</th>
                        <th className="px-4 py-3 font-medium w-32">Indicator</th>
                        <th className="px-4 py-3 font-medium">Descriptor</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {students.map(student => {
                        const score = parseFloat(scores[student.id] as string);
                        const indicator = getIndicator(score);

                        return (
                            <tr key={student.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-4 py-2 font-medium">{student.name}</td>
                                <td className="px-4 py-2">
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100" // Restrict input
                                        className="w-24 font-mono"
                                        placeholder="-"
                                        value={scores[student.id] || ''}
                                        onChange={(e) => onScoreChange(student.id, e.target.value)}
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    {indicator ? (
                                        <Badge
                                            style={{ backgroundColor: indicator.color_hex }}
                                            className="text-white hover:opacity-90 transition-opacity"
                                        >
                                            {indicator.indicator}
                                        </Badge>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 text-xs text-muted-foreground">
                                    {indicator?.descriptor}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
