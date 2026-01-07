import { useState } from 'react';
import { GradingScale } from '@/lib/api-assessment';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Upload } from 'lucide-react';

interface ObservationCardProps {
    student: any;
    gradingScales: GradingScale[];
    onSave: (data: any) => Promise<void>;
}

export function ObservationCard({ student, gradingScales, onSave }: ObservationCardProps) {
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [remarks, setRemarks] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedLevel) return;
        setIsSubmitting(true);
        try {
            await onSave({
                student_id: student.id,
                performance_level: selectedLevel,
                teacher_remarks: remarks,
                evidence_files: files
            });
            // Reset or show success
            setSelectedLevel(null);
            setRemarks('');
            setFiles([]);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Make an Observation</h3>
                    <p className="text-white/50 text-sm">Select the performance level that best matches the learner's demonstration.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {gradingScales.map((scale) => (
                    <button
                        key={scale.id}
                        onClick={() => setSelectedLevel(scale.indicator)}
                        className={`
                            relative h-32 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 group
                            ${selectedLevel === scale.indicator
                                ? 'scale-[1.02] shadow-2xl ring-2 ring-white/50'
                                : 'hover:scale-[1.01] hover:bg-white/5 opacity-80 hover:opacity-100'
                            }
                        `}
                        style={{
                            backgroundColor: selectedLevel === scale.indicator ? scale.color_hex : 'rgba(255,255,255,0.03)',
                            borderColor: selectedLevel === scale.indicator ? 'transparent' : 'rgba(255,255,255,0.1)',
                        }}
                    >
                        {selectedLevel === scale.indicator && (
                            <div className="absolute top-3 right-3 bg-white/20 p-1 rounded-full backdrop-blur-sm">
                                <Check className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <span className={`text-4xl font-black tracking-tighter ${selectedLevel === scale.indicator ? 'text-white' : 'text-white/40'}`}
                            style={{ color: selectedLevel !== scale.indicator ? scale.color_hex : undefined }}
                        >
                            {scale.indicator}
                        </span>
                        <span className={`text-sm font-medium ${selectedLevel === scale.indicator ? 'text-white/90' : 'text-white/40'}`}>
                            {scale.descriptor}
                        </span>
                    </button>
                ))}
            </div>

            <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 mt-2">
                <div className="space-y-2">
                    <Label htmlFor={`remarks-${student.id}`} className="text-white/80">Teacher's Remarks</Label>
                    <Textarea
                        id={`remarks-${student.id}`}
                        placeholder="Describe the learner's performance (e.g., 'Demonstrated confidence in...') "
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="resize-none h-24 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus:border-white/30 rounded-xl"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-white/80">Evidence (Optional)</Label>
                    <div className="flex items-center gap-3">
                        <label className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10">
                            <Upload className="w-5 h-5 text-white/70" />
                            <input type="file" multiple accept="image/*,video/*,application/pdf" onChange={handleFileChange} className="hidden" />
                        </label>
                        {files.length > 0 ? (
                            <div className="flex gap-2">
                                {files.map((file, i) => (
                                    <div key={i} className="h-12 px-3 flex items-center bg-primary/20 text-primary border border-primary/30 rounded-xl text-xs font-medium">
                                        {file.name.substring(0, 15)}...
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span className="text-xs text-white/30 italic">No files attached</span>
                        )}
                    </div>
                </div>

                <Button
                    className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 mt-2"
                    onClick={handleSubmit}
                    disabled={!selectedLevel || isSubmitting}
                >
                    {isSubmitting ? 'Saving Observation...' : 'Save Observation'}
                </Button>
            </div>
        </div>
    );
}
