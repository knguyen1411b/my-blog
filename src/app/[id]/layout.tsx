import { Footer, Navbar } from '@/components/layout'

export default function BlogDetailLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar isView={1} />
            <div className="flex-1 pt-14 sm:pt-16">{children}</div>
            <Footer />
        </div>
    )
}
