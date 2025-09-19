import { GrainGradient,DotGrid } from '@paper-design/shaders-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Shield } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pb-28 pt-24 md:pb-36">
 
      <div className="absolute inset-0">
      
        <GrainGradient
          height={1000}
          colors={['#7300ff', '#eba8ff', '#00bfff', '#2b00ff']}
          colorBack="#ffffff"
          softness={0.8}
          intensity={0.8}
          noise={0.25}
          shape="corners"
          offsetX={0}
          offsetY={0}
          scale={1}
          rotation={0}
          speed={1}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/80" />
      </div>

      <div className="relative">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center p-6">
          <Badge className="flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-1 text-xs uppercase tracking-wide text-slate-600 backdrop-blur">
            <span className="inline-flex size-1.5 rounded-full bg-emerald-400" />
            New: AI Ad Engine 2.0
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Create 100+ video ads for your business in seconds
          </h1>
          <p className="text-pretty text-base text-slate-600 sm:text-lg">
            Launch persuasive campaigns on autopilot. MagicUI handles your scripts, avatars,
            translations, and exports so your team can focus on strategy and results.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button className="group rounded-full px-6 py-2 text-sm font-medium">
              Start free trial
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700"
            >
              Book a live demo
            </Button>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-5xl gap-4 rounded-3xl border border-white/40 bg-white/60 p-6 shadow-[0_20px_70px_rgba(116,90,255,0.15)] backdrop-blur lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex size-1.5 rounded-full bg-emerald-400" />
              Automated workflow
            </div>
            <h2 className="text-left text-2xl font-semibold text-slate-900">
              Watch creative variations generate in real-time
            </h2>
            <p className="text-sm text-slate-500">
              Type a prompt, pick your target audience, and let MagicUI build ready-to-launch ads
              with voiceover, captions, and platform-specific specs.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-600">
                Meta & TikTok ready
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                30+ languages
              </span>
              <span className="rounded-full bg-indigo-100 px-3 py-1 font-medium text-indigo-600">
                Unlimited scenes
              </span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-br from-white via-purple-50 to-rose-50 p-6 shadow-lg">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Render queue</span>
              <span>00:36 remaining</span>
            </div>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3 shadow-sm">
                <span>15s Hook - Founder</span>
                <span className="text-emerald-500">Rendering</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/50 px-4 py-3">
                <span>30s Story - Product demo</span>
                <span className="text-slate-400">Queued</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/50 px-4 py-3">
                <span>UGC Remix - Lifestyle</span>
                <span className="text-slate-400">Queued</span>
              </div>
            </div>
            <Button className="mt-6 w-full rounded-full bg-slate-900 text-sm font-medium text-white hover:bg-slate-800">
              View studio preview
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
