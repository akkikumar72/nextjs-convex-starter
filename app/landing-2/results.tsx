import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GradientBackground } from './gradient-background'

const results = [
  {
    label: 'Processing speed',
    metric: '< 1 sec',
    detail: 'Lightning-fast extraction for most websites',
  },
  {
    label: 'Format variety',
    metric: '4 formats',
    detail: 'Specialized output types for different AI needs',
  },
  {
    label: 'JavaScript support',
    metric: '100%',
    detail: 'Full React/SPA compatibility',
  },
  {
    label: 'Success rate',
    metric: '99%+',
    detail: 'Enterprise-grade extraction reliability',
  },
]

export default function Results() {
  return (
    <section id="results" className="relative overflow-hidden py-24">
      <GradientBackground className="bg-[radial-gradient(circle_at_center,_rgba(209,255,221,0.7),_transparent_70%)]" />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 text-center">
        <div className="mx-auto max-w-xl space-y-4">
          <Badge className="mx-auto w-fit rounded-full border border-emerald-200 bg-emerald-100/80 px-4 py-1 text-xs font-medium uppercase tracking-wide text-emerald-600">
            Results
          </Badge>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Lightning-fast extraction with 99%+ accuracy.
          </h2>
          <p className="text-pretty text-sm text-slate-600 sm:text-base">
            Advanced processing engine delivers clean, structured data in seconds - perfect for AI
            training and content workflows.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {results.map((item) => (
            <Card
              key={item.label}
              className="h-full border-none bg-white/90 shadow-[0_12px_35px_rgba(71,194,138,0.2)]"
            >
              <CardHeader className="items-center gap-2 text-center">
                <CardTitle className="text-3xl font-semibold text-slate-900">
                  {item.metric}
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-wide text-emerald-600">
                  {item.label}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <CardDescription className="text-sm text-slate-600">{item.detail}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
