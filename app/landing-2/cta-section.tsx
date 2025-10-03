import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GradientBackground } from './gradient-background'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden pb-24">
      <GradientBackground className="bg-[radial-gradient(circle_at_center,_rgba(222,204,255,0.75),_transparent_70%)]" />
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 rounded-[36px] border border-white/70 bg-white/70 px-8 py-12 text-center shadow-[0_20px_65px_rgba(148,97,255,0.22)]">
        <Badge className="rounded-full border border-purple-200 bg-purple-100/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-purple-600">
          Ready to scale
        </Badge>
        <h2 className="text-balance text-3xl font-semibold text-slate-900 md:text-4xl">
          Start scaling your video ads today.
        </h2>
        <p className="text-sm text-slate-600 sm:text-base">
          Get full access to MagicUI with unlimited renders, localization tools, and workspace seats. Cancel anytime.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button className="rounded-full px-6 py-2 text-sm font-medium">Get started</Button>
          <Button
            variant="outline"
            className="rounded-full border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700"
          >
            Talk to sales
          </Button>
        </div>
      </div>
    </section>
  )
}
