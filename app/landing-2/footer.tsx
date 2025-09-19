import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white py-12 text-sm text-slate-500">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 text-slate-600">
          <Logo className="h-5 text-slate-900" />
          <span>© {new Date().getFullYear()} MagicUI. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link href="#" className="transition hover:text-slate-900">
            Privacy
          </Link>
          <Link href="#" className="transition hover:text-slate-900">
            Terms
          </Link>
          <Link href="#" className="transition hover:text-slate-900">
            Security
          </Link>
          <Link href="#" className="transition hover:text-slate-900">
            Support
          </Link>
        </div>
        <p className="text-xs text-slate-400 md:text-right">
          Built with MagicUI components and crafted for modern performance teams.
        </p>
      </div>
    </footer>
  )
}
