
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar Skeleton */}
            <Skeleton className="hidden lg:block fixed inset-y-4 left-4 z-50 w-64 rounded-2xl bg-white/5" />

            {/* Main Content Area - with margin to offset fixed sidebar */}
            <div className="flex flex-1 flex-col overflow-hidden relative lg:ml-72">
                {/* Header Skeleton */}
                <div className="absolute top-4 left-0 right-4 lg:left-0 z-40 mx-4 lg:mx-0 px-4 h-20 flex items-center justify-between">
                    <Skeleton className="h-8 w-48 bg-white/5" /> {/* Breadcrumb area */}
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-48 bg-white/5 hidden md:block rounded-xl" /> {/* Search */}
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
                            <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
                            <Skeleton className="h-8 w-24 rounded-full bg-white/5 hidden sm:block" /> {/* User Profile Pill */}
                        </div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <main className="flex-1 overflow-y-auto pt-28 px-4 pb-4 lg:px-6 scrollbar-hide space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64 bg-white/5" />
                        <Skeleton className="h-4 w-96 bg-white/5" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-xl bg-white/5" />
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Skeleton className="h-96 w-full rounded-xl bg-white/5 col-span-4" />
                        <Skeleton className="h-96 w-full rounded-xl bg-white/5 col-span-3" />
                    </div>
                </main>
            </div>
        </div>
    )
}
