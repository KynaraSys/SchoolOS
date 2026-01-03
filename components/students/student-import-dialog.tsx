import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react"
import { importStudents } from "@/lib/api-users"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function StudentImportDialog({ onSuccess }: { onSuccess?: () => void }) {
    const { toast } = useToast()
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [importResult, setImportResult] = useState<{ imported: number, errors: string[] } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setImportResult(null)
        }
    }

    const downloadTemplate = () => {
        const headers = ["Admission No,Name,Email,Phone,Gender,Class,Stream,Parent Email"]
        const example = "2024/0001,John Doe,john.doe@example.com,0712345678,Male,Form 1,North,parent@example.com"
        const csvContent = "data:text/csv;charset=utf-8," + headers.join("\n") + "\n" + example
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "student_bulk_update_template.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleImport = async () => {
        if (!file) return

        setIsLoading(true)
        setImportResult(null)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const result = await importStudents(formData)
            setImportResult({
                imported: result.updated_count,
                errors: result.errors || []
            })

            // Show skipped count in toast if available
            const skippedMsg = result.skipped_count ? ` (${result.skipped_count} skipped)` : '';

            if (result.updated_count >= 0) {
                toast({
                    title: "Update Processed",
                    description: `Successfully updated ${result.updated_count} students${skippedMsg}.`,
                })
                if (onSuccess) onSuccess()
            }
        } catch (error: any) {
            console.error(error)
            toast({
                title: "Import Failed",
                description: error.response?.data?.message || "Failed to process import file.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const reset = () => {
        setFile(null)
        setImportResult(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) reset()
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Bulk Update
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Bulk Update Students</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file to update multiple students at once.
                        <strong> New students are NOT created.</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="flex flex-col gap-2 p-4 border rounded-md bg-muted/30">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">1. Download Template</span>
                            <Button variant="ghost" size="sm" onClick={downloadTemplate} className="h-8 gap-2">
                                <Download className="h-3.5 w-3.5" />
                                Template.csv
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Includes columns: Admission No, Name, Email, Phone, Gender, Class, Stream, Parent Email
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="file">2. Upload CSV File</Label>
                        <div className="flex gap-2">
                            <Input
                                ref={fileInputRef}
                                id="file"
                                type="file"
                                accept=".csv,.txt"
                                onChange={handleFileChange}
                                disabled={isLoading}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>

                    {importResult && (
                        <div className="space-y-4">
                            {importResult.imported > 0 && (
                                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/10">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertTitle className="text-green-600">Success</AlertTitle>
                                    <AlertDescription className="text-green-700 dark:text-green-400">
                                        Updated {importResult.imported} students successfully.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {importResult.errors.length > 0 && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Issues Found ({importResult.errors.length})</AlertTitle>
                                    <AlertDescription className="max-h-[100px] overflow-y-auto mt-2">
                                        <ul className="list-disc pl-4 text-xs space-y-1">
                                            {importResult.errors.map((err, i) => (
                                                <li key={i}>{err}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleImport} disabled={!file || isLoading}>
                        {isLoading ? "Importing..." : "Run Import"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
