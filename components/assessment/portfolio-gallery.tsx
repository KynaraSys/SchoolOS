"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play, FileText, Image as ImageIcon, Download, Calendar, Maximize2 } from "lucide-react";
import Image from "next/image";

// Mock Evidence Data
const EVIDENCE_ITEMS = [
    { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b', title: 'Group Counting', date: '2025-05-10', subject: 'Mathematics' },
    { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902', title: 'Clay Modeling', date: '2025-05-08', subject: 'Art & Craft' },
    { id: 3, type: 'video', url: '#', title: 'Poem Recitation', date: '2025-05-05', subject: 'English Activities' }, // Placeholder for video
    { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7', title: 'Sorting Colors', date: '2025-04-20', subject: 'Mathematics' },
    { id: 5, type: 'pdf', url: '#', title: 'Writing Worksheet', date: '2025-04-15', subject: 'Language Activities' },
];

export function PortfolioGallery() {
    const [selectedItem, setSelectedItem] = useState<typeof EVIDENCE_ITEMS[0] | null>(null);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Evidence Gallery</h2>
                    <p className="text-white/50 text-sm">Photos, videos, and documents collected during assessments.</p>
                </div>
            </div>

            <ScrollArea className="flex-1 -mr-6 pr-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {EVIDENCE_ITEMS.map((item) => (
                        <div
                            key={item.id}
                            className="group relative rounded-xl overflow-hidden bg-black/20 border border-white/10 cursor-pointer transition-all hover:ring-2 hover:ring-primary/50"
                            onClick={() => setSelectedItem(item)}
                        >
                            <AspectRatio ratio={1}>
                                {item.type === 'image' ? (
                                    <Image
                                        src={item.url}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        {item.type === 'video' ? <Play className="h-12 w-12 text-white/50" /> : <FileText className="h-12 w-12 text-white/50" />}
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                    <p className="text-white font-medium text-sm truncate">{item.title}</p>
                                    <p className="text-white/60 text-xs flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> {item.date}
                                    </p>
                                    <div className="absolute top-2 right-2 p-1.5 bg-black/40 rounded-full backdrop-blur-md">
                                        <Maximize2 className="h-3 w-3 text-white" />
                                    </div>
                                </div>
                            </AspectRatio>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Lightbox Dialog */}
            <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
                <DialogContent className="max-w-4xl bg-black/90 border-white/10 p-0 overflow-hidden">
                    {selectedItem && (
                        <div className="flex flex-col md:flex-row h-[80vh]">
                            {/* Media View */}
                            <div className="flex-1 bg-black flex items-center justify-center relative">
                                {selectedItem.type === 'image' && (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={selectedItem.url}
                                            alt={selectedItem.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                                {selectedItem.type !== 'image' && (
                                    <div className="text-white/50 flex flex-col items-center gap-4">
                                        {selectedItem.type === 'video' ? <Play className="h-16 w-16" /> : <FileText className="h-16 w-16" />}
                                        <span className="text-lg">Preview not available for this file type</span>
                                    </div>
                                )}
                            </div>

                            {/* Details Panel */}
                            <div className="w-full md:w-80 border-l border-white/10 p-6 flex flex-col bg-card/10 backdrop-blur-xl text-white">
                                <h3 className="text-xl font-bold mb-2">{selectedItem.title}</h3>

                                <div className="space-y-4 flex-1">
                                    <div className="space-y-1">
                                        <span className="text-xs text-white/40 uppercase tracking-wider">Date</span>
                                        <p className="text-sm">{selectedItem.date}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-white/40 uppercase tracking-wider">Subject</span>
                                        <p className="text-sm">{selectedItem.subject}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-white/40 uppercase tracking-wider">Type</span>
                                        <p className="text-sm capitalize">{selectedItem.type}</p>
                                    </div>
                                </div>

                                <button className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                                    <Download className="h-4 w-4" /> Download
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
