import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href: string;
    active?: boolean;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    children?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, children }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1.5">
                {breadcrumbs && (
                    <nav className="flex items-center text-sm text-muted-foreground mb-2">
                        {breadcrumbs.map((item, index) => (
                            <div key={index} className="flex items-center">
                                {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                                {item.active ? (
                                    <span className="font-medium text-foreground">{item.label}</span>
                                ) : (
                                    <Link href={item.href} className="hover:text-primary hover:underline transition-colors">
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                )}
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    );
}
