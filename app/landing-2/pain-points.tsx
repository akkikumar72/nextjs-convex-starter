import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame } from 'lucide-react'
import { GradientBackground } from './gradient-background'

const painPoints = [
  {
    title: 'Hidden Costs',
    description:
      "Services that don't show usage until you get billed, leaving you with surprise charges and budget overruns.",
  },
  {
    title: 'Poor User Experience',
    description:
      'Basic interfaces without live testing capabilities make it impossible to experiment before committing.',
  },
  {
    title: 'Limited API Documentation',
    description:
      'Inadequate examples and integration guides make it difficult for developers to implement workflows.',
  },
  {
    title: 'No Real-time Feedback',
    description:
      "Can't see results until after processing, making it hard to iterate and optimize extraction strategies.",
  },
  {
    title: 'Format Rigidity',
    description:
      'Limited options for different extraction needs, forcing you to use multiple tools for different formats.',
  },
  {
    title: 'Transparency Issues',
    description:
      'Unclear pricing and usage tracking makes it impossible to predict costs or optimize your workflow.',
  },
]

export default function PainPoints() {
  return (
    <section id="pain-points" className="relative overflow-hidden py-24">
      <GradientBackground className="bg-[radial-gradient(circle_at_top,_rgba(255,214,227,0.65),_transparent_70%)]" />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 text-center">
        <div className="mx-auto max-w-xl space-y-4">
          <Badge className="mx-auto w-fit rounded-full border border-rose-200 bg-rose-100/80 px-4 py-1 text-xs font-medium uppercase tracking-wide text-rose-600">
            Problem
          </Badge>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Website data extraction is broken.
          </h2>
          <p className="text-pretty text-sm text-slate-600 sm:text-base">
            Every extraction workflow gets bogged down by hidden costs, poor interfaces, and lack of
            transparency in existing tools.
          </p>
        </div>
        <div className="grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((point) => (
            <Card
              key={point.title}
              className="h-full border-none bg-white/80 shadow-[0_12px_35px_rgba(255,149,163,0.15)]"
            >
              <CardHeader className="gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  <Flame className="size-4" />
                </span>
                <CardTitle className="text-base text-slate-900">{point.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <CardDescription className="text-sm text-slate-600">
                  {point.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
