"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface ModernTabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
    children: React.ReactNode
}

interface ModernTabsListProps extends React.ComponentPropsWithoutRef<typeof TabsList> {
    children: React.ReactNode
}

interface ModernTabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsTrigger> {
    icon?: React.ComponentType<{ className?: string }>
    children: React.ReactNode
}

interface ModernTabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsContent> {
    children: React.ReactNode
}

export function ModernTabs({ className, ...props }: ModernTabsProps) {
    return (
        <Tabs className={cn("w-full", className)} {...props} />
    )
}

export function ModernTabsList({ className, ...props }: ModernTabsListProps) {
    return (
        <TabsList className={cn(
            "w-full justify-start h-auto p-0 bg-transparent border-b rounded-none space-x-6 overflow-x-auto",
            className
        )} {...props} />
    )
}

export function ModernTabsTrigger({ className, icon: Icon, children, ...props }: ModernTabsTriggerProps) {
    return (
        <TabsTrigger
            className={cn(
                "relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-foreground",
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" />}
                {children}
            </div>
        </TabsTrigger>
    )
}

export function ModernTabsContent({ className, ...props }: ModernTabsContentProps) {
    return (
        <TabsContent className={cn("mt-6", className)} {...props} />
    )
}
