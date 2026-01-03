"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2, Plus, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getGuardians } from "@/lib/api-users"
import { Badge } from "@/components/ui/badge"

interface Guardian {
    id: number
    first_name: string
    last_name: string
    phone_number: string
    email?: string
}

interface GuardianSelectorProps {
    onSelect: (guardian: Guardian) => void
    selectedGuardians?: Guardian[] // To exclude already selected
}

export function GuardianSelector({ onSelect, selectedGuardians = [] }: GuardianSelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [guardians, setGuardians] = React.useState<Guardian[]>([])
    const [loading, setLoading] = React.useState(false)
    const [search, setSearch] = React.useState("")

    React.useEffect(() => {
        const fetchGuardians = async () => {
            if (search.length < 2) {
                setGuardians([])
                return
            }
            setLoading(true)
            try {
                const data = await getGuardians(search)
                setGuardians(data)
            } catch (error) {
                console.error("Failed to search guardians", error)
            } finally {
                setLoading(false)
            }
        }

        const debounce = setTimeout(fetchGuardians, 500)
        return () => clearTimeout(debounce)
    }, [search])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <span className="text-muted-foreground">Search to add guardian...</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput placeholder="Search guardian by name or phone..." onValueChange={setSearch} />
                    <CommandList>
                        <CommandEmpty>
                            {loading ? (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Searching...
                                </div>
                            ) : search.length < 2 ? (
                                "Type at least 2 characters"
                            ) : (
                                "No guardian found."
                            )}
                        </CommandEmpty>
                        <CommandGroup heading="Results">
                            {guardians.map((guardian) => {
                                const isSelected = selectedGuardians.some(g => g.id === guardian.id)
                                return (
                                    <CommandItem
                                        key={guardian.id}
                                        value={String(guardian.id)}
                                        onSelect={() => {
                                            if (!isSelected) {
                                                onSelect(guardian)
                                                setOpen(false)
                                                setSearch("") // Reset search
                                            }
                                        }}
                                        disabled={isSelected}
                                        className="flex flex-col items-start gap-1 p-2"
                                    >
                                        <div className="flex items-center w-full justify-between">
                                            <span className="font-medium">{guardian.first_name} {guardian.last_name}</span>
                                            {isSelected && <Badge variant="secondary">Added</Badge>}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{guardian.phone_number} • {guardian.email || 'No Email'}</span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
