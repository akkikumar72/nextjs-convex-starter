import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { CirclePlay } from 'lucide-react'
import { GradientBackground } from './gradient-background'

const testimonials = {
  headline: 'Case Study',
  title: 'How one startup extracted 1,000+ competitor pages for AI training',
  description:
    'Watch how AI developers use our extraction platform to build competitor analysis agents and automated market intelligence systems.',
  name: 'Sarah Chen',
  role: 'CTO, MarketAI',
}

export default function CaseStudy() {
  return (
    <section className="relative overflow-hidden py-24">
      <GradientBackground className="bg-[radial-gradient(circle_at_center,_rgba(222,222,255,0.65),_transparent_70%)]" />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 text-center">
        <Badge className="mx-auto w-fit rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {testimonials.headline}
        </Badge>
        <div className="space-y-4">
          <h2 className="text-balance text-3xl font-semibold text-slate-900 md:text-4xl">
            {testimonials.title}
          </h2>
          <p className="text-pretty text-sm text-slate-600 sm:text-base">
            {testimonials.description}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-black via-slate-900 to-indigo-900 p-6 text-left shadow-[0_18px_55px_rgba(32,41,86,0.45)]">
          <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-black/40">
            <Image
              src="/web-extraction-hero.png"
              alt="Web extraction case study"
              width={960}
              height={540}
              className="h-full w-full object-cover opacity-90"
            />
            <button className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-wide text-white">
              <CirclePlay className="size-4" /> Watch demo
            </button>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              <div className="text-sm uppercase tracking-wide text-white/70">Featured customer</div>
              <p className="mt-1 text-lg font-semibold text-white">{testimonials.name}</p>
              <p className="text-sm text-white/70">{testimonials.role}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
