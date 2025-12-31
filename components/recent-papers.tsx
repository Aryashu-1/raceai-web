"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Filter, Plus, Star } from "lucide-react"

interface PaperCardProps {
    title: string
    authors: string
    journal: string
    date: string
    status: "completed" | "in-progress" | "saved"
    progress?: number
}

const PaperCard = ({ title, authors, journal, date, status, progress }: PaperCardProps) => (
    <div className="p-4 border border-border hover:border-primary hover:bg-accent/50 transition-all rounded-lg">
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-4">
                <h3 className="font-semibold text-foreground text-sm leading-tight mb-2 line-clamp-2">
                    {title}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">{authors}</p>
                <p className="text-xs text-muted-foreground">
                    {journal} • {date}
                </p>
            </div>
            <div
                className={`px-3 py-1 text-xs font-medium rounded-lg ${status === "completed"
                        ? "bg-success/10 text-success"
                        : status === "in-progress"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                    }`}
            >
                {status}
            </div>
        </div>

        {progress && (
            <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-lg">
                    <div
                        className="bg-primary h-2 rounded-lg transition-normal"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        )}

        <div className="flex gap-3">
            <button className="flex-1 py-2.5 px-4 btn-primary text-sm font-medium">
                Continue Reading
            </button>
            <button className="py-2.5 px-3 btn-ghost">
                <Star size={16} />
            </button>
        </div>
    </div>
)

export function RecentPapers({ projectId }: { projectId?: string }) {
    const router = useRouter()
    // In a real app, use projectId to fetch specific papers

    return (
        <div className="bg-background p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-semibold text-foreground">Recent Papers</h3>
                <div className="flex items-center gap-3">
                    <button className="btn-ghost p-2">
                        <Filter className="w-4 h-4" />
                    </button>
                    <button
                        className="btn-primary px-4 py-2 animate-paper"
                        onClick={() => router.push('/knowledge?action=upload')}
                    >
                        <Plus className="w-4 h-4 inline mr-2" />
                        Add Paper
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <PaperCard
                    title="Neural Architecture Search for Transformer Models in Natural Language Processing"
                    authors="Smith, J. et al."
                    journal="Nature Machine Intelligence"
                    date="2024"
                    status="in-progress"
                    progress={65}
                />
                <PaperCard
                    title="Attention Mechanisms in Computer Vision: A Comprehensive Survey"
                    authors="Johnson, A. & Brown, M."
                    journal="IEEE TPAMI"
                    date="2024"
                    status="completed"
                    progress={100}
                />
                <PaperCard
                    title="Federated Learning with Differential Privacy in Healthcare Applications"
                    authors="Davis, K. et al."
                    journal="JMIR Med Inform"
                    date="2024"
                    status="saved"
                    progress={0}
                />
            </div>
        </div>
    )
}
