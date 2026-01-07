"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AdmissionData } from "../admission-wizard";
import { useState } from "react";
import { Search, Plus, Trash2, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api";

interface StepProps {
    data: AdmissionData["guardians"];
    onUpdate: (guardians: AdmissionData["guardians"]) => void;
    onNext: () => void;
    onBack: () => void;
}

export function GuardianLinkingStep({ data, onUpdate, onNext, onBack }: StepProps) {
    // Temporary state for the "Add Guardian" form
    const [idQuery, setIdQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [foundGuardian, setFoundGuardian] = useState<any>(null); // If API finds one
    const [formMode, setFormMode] = useState<"search" | "details">("search");

    // New guardian form state
    const [newGuardian, setNewGuardian] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        national_id: "",
        relationship: "",
        email: "",
    });

    const { toast } = useToast();

    const handleSearch = async () => {
        if (!idQuery.trim()) return;
        setIsSearching(true);
        setFoundGuardian(null);

        try {
            const res = await api.post("/guardians/search-id", {
                national_id: idQuery.trim()
            });

            // API returns { guardian: ... }
            if (res.data.guardian) {
                setFoundGuardian(res.data.guardian);
                setNewGuardian({
                    ...newGuardian,
                    first_name: res.data.guardian.first_name,
                    last_name: res.data.guardian.last_name,
                    phone_number: res.data.guardian.phone_number,
                    national_id: res.data.guardian.national_id || idQuery.trim(),
                    email: res.data.guardian.email || "",
                });
                setFormMode("details"); // Move to details to confirm relationship
                toast({ title: "Guardian Found", description: "Linked existing profile." });
            } else {
                // Not found - show new guardian form
                startNewGuardian();
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                startNewGuardian();
                toast({
                    title: "Guardian Not Found",
                    description: "Please enter guardian details below.",
                    variant: "default"
                });
            } else {
                console.error("Search error", error.response?.status || error.message);
                toast({
                    variant: "destructive",
                    title: "Search Failed",
                    description: "Please try again or enter details manually."
                });
                startNewGuardian();
            }
        } finally {
            setIsSearching(false);
        }
    };

    const startNewGuardian = () => {
        setFoundGuardian(null);
        setNewGuardian({
            first_name: "",
            last_name: "",
            phone_number: "",
            national_id: idQuery.trim(),
            relationship: "",
            email: "",
        });
        setFormMode("details");
    };

    const handleAddToList = () => {
        if (!newGuardian.first_name || !newGuardian.relationship) {
            toast({ variant: "destructive", title: "Missing Fields", description: "Name and Relationship are required." });
            return;
        }

        const entry = {
            guardian_id: foundGuardian?.id,
            first_name: newGuardian.first_name,
            last_name: newGuardian.last_name,
            phone_number: newGuardian.phone_number,
            national_id: newGuardian.national_id,
            relationship: newGuardian.relationship,
            email: newGuardian.email,
        };

        onUpdate([...data, entry]);

        // Reset
        setFormMode("search");
        setIdQuery("");
        setFoundGuardian(null);
        setNewGuardian({ first_name: "", last_name: "", phone_number: "", national_id: "", relationship: "", email: "" });
    };

    const removeGuardian = (index: number) => {
        const updated = [...data];
        updated.splice(index, 1);
        onUpdate(updated);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Guardian Linking</h2>
                <p className="text-muted-foreground text-sm">
                    Who is responsible for this learner? Search by National ID to link existing guardians.
                </p>
            </div>

            {/* List of Added Guardians */}
            {data.length > 0 && (
                <div className="grid gap-4">
                    {data.map((g, idx) => (
                        <Card key={idx} className="p-4 flex justify-between items-center bg-accent/20 border-accent">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <UserCheck className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{g.first_name} {g.last_name}</p>
                                    <p className="text-sm text-muted-foreground">{g.relationship} • {g.phone_number}</p>
                                    {g.guardian_id && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Existing Profile</span>}
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeGuardian(idx)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Form */}
            <Card className="p-6 border-dashed">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Guardian
                </h3>

                {formMode === "search" && (
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label htmlFor="id_search" className="sr-only">National ID</Label>
                            <Input
                                id="id_search"
                                placeholder="Enter Guardian's National ID Number"
                                value={idQuery}
                                onChange={(e) => setIdQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={isSearching}>
                            {isSearching ? "Searching..." : "Search"} <Search className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                )}

                {formMode === "details" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input
                                    value={newGuardian.first_name}
                                    onChange={(e) => setNewGuardian({ ...newGuardian, first_name: e.target.value })}
                                    disabled={!!foundGuardian} // Read-only if found
                                    className={!!foundGuardian ? "bg-muted" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input
                                    value={newGuardian.last_name}
                                    onChange={(e) => setNewGuardian({ ...newGuardian, last_name: e.target.value })}
                                    disabled={!!foundGuardian}
                                    className={!!foundGuardian ? "bg-muted" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>National ID <span className="text-red-500">*</span></Label>
                                <Input
                                    value={newGuardian.national_id}
                                    onChange={(e) => setNewGuardian({ ...newGuardian, national_id: e.target.value })}
                                    disabled={!!foundGuardian}
                                    className={!!foundGuardian ? "bg-muted" : ""}
                                    placeholder="12345678"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    value={newGuardian.phone_number}
                                    onChange={(e) => setNewGuardian({ ...newGuardian, phone_number: e.target.value })}
                                    placeholder="254712345678"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Relationship (to this learner) <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="e.g. Mother, Uncle, Guardian"
                                    value={newGuardian.relationship}
                                    onChange={(e) => setNewGuardian({ ...newGuardian, relationship: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Email (Optional)</Label>
                                <Input
                                    value={newGuardian.email}
                                    onChange={(e) => setNewGuardian({ ...newGuardian, email: e.target.value })}
                                    disabled={!!foundGuardian}
                                    className={!!foundGuardian ? "bg-muted" : ""}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setFormMode("search")}>Cancel</Button>
                            <Button onClick={handleAddToList}>Add Guardian</Button>
                        </div>
                    </div>
                )}
            </Card>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={onNext} disabled={data.length === 0}>
                    Next Step {data.length === 0 && "(Add at least one)"}
                </Button>
            </div>
        </div>
    );
}
