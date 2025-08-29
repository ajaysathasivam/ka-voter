'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between py-5 px-8 bg-transparent">
            <div className="flex items-center gap-3">
                <span className="font-bold text-lg text-white">🛡️</span>
            </div>
            <ul className="flex gap-8 ">
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/how-it-works">How it works</Link>
                </li>
                <li>
                    <Link href="/about">About us</Link>
                </li>
            </ul>
            <Link href="/login">
                <Button variant="outline">Login</Button>
            </Link>
        </nav>
    )
}
