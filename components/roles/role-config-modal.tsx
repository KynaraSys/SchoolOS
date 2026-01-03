"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { RoleForm } from "./role-form"
import { Role } from "@/lib/api-roles"

interface RoleConfigModalProps {
    isOpen: boolean
    onClose: () => void
    role?: Role
    onSuccess: () => void
}

export function RoleConfigModal({ isOpen, onClose, role, onSuccess }: RoleConfigModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>
                    <DialogDescription>
                        {role ? "Modify the permissions for this role." : "Define a new role and assign permissions."}
                    </DialogDescription>
                </DialogHeader>
                <RoleForm role={role} onSuccess={() => {
                    onSuccess();
                    onClose();
                }} />
            </DialogContent>
        </Dialog>
    )
}
