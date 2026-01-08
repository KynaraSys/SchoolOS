import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50 text-center">
            <h1 className="text-9xl font-extrabold text-gray-900">404</h1>
            <p className="text-xl text-gray-600">Page not found</p>
            <Link href="/">
                <Button>Go back home</Button>
            </Link>
        </div>
    )
}
