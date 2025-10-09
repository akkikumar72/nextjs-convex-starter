import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Check, CirclePlay, Shield } from 'lucide-react'
import { GradientBackground } from './gradient-background'

export default function DemoSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <GradientBackground className="bg-[radial-gradient(circle_at_top,_rgba(222,233,255,0.65),_transparent_70%)]" />
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="space-y-5">
          <Badge className="rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Interactive playground
          </Badge>
          <h2 className="text-balance text-3xl font-semibold text-slate-900 md:text-4xl">
            Experience the interactive difference - test in real-time.
          </h2>
          <p className="text-sm text-slate-600 sm:text-base">
            Paste any URL and see extraction formats switch instantly. Experiment with different
            outputs and copy API calls with one click.
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700">
              <CirclePlay className="size-4 text-indigo-500" /> Real-time extraction
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 font-medium text-emerald-600">
              <Check className="size-3" /> Live format switching
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 font-medium text-indigo-600">
              <Shield className="size-3" /> API transparency
            </span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-white via-indigo-50 to-sky-100 p-6 shadow-[0_18px_60px_rgba(74,110,255,0.22)]">
          <div className="absolute -left-20 top-10 h-40 w-40 rounded-full bg-indigo-200 opacity-40 blur-3xl" />
          <div className="absolute -right-16 bottom-6 h-32 w-32 rounded-full bg-emerald-200 opacity-30 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-slate-900">
            <Image
              src="/extraction-playground.png"
              alt="Interactive extraction playground"
              width={960}
              height={540}
              className="h-full w-full object-cover"
            />
            <button className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-lg backdrop-blur transition hover:bg-white">
              <CirclePlay className="size-7" />
            </button>
          </div>
          <div className="mt-6 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/80 p-4">
              <p className="font-medium text-slate-900">Format switching</p>
              <p className="mt-1 text-xs text-slate-500">
                Content · Metadata · AI Prompt · Screenshot
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4">
              <p className="font-medium text-slate-900">API transparency</p>
              <p className="mt-1 text-xs text-slate-500">Copy cURL commands with one click</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
