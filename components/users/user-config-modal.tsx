"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { UserForm } from "./user-form"
import { User } from "@/lib/types/user"

interface UserConfigModalProps {
    isOpen: boolean
    onClose: () => void
    user?: User
    onSuccess: () => void
}

export function UserConfigModal({ isOpen, onClose, user, onSuccess }: UserConfigModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
                    <DialogDescription>
                        {user ? "Modify the details for this user." : "Add a new user to the system."}
                    </DialogDescription>
                </DialogHeader>
                <UserForm initialData={user} onSuccess={() => {
                    onSuccess();
                    onClose();
                }} />
            </DialogContent>
        </Dialog>
    )
}
