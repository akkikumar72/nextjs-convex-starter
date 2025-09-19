import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame } from 'lucide-react'
import { GradientBackground } from './gradient-background'

const painPoints = [
  {
    title: 'Scaling Headaches',
    description: 'Managing thousands of variations is painful without automated workflows to build, tag, and deploy creative.'
  },
  {
    title: 'Missed Deadlines',
    description: 'Turnaround time balloons when script, design, and export live in different tools and handoffs.'
  },
  {
    title: 'Revision Chaos',
    description: 'Feedback loops gridlock production and leave teams guessing which version is actually approved.'
  },
  {
    title: 'Inconsistent Quality',
    description: 'Brand guidelines fall through the cracks when every freelancer uses a different toolkit and brief.'
  },
  {
    title: 'Exploding Costs',
    description: 'Hiring editors, voice actors, and translators for each campaign drains the budget before launch.'
  },
  {
    title: 'Platform Rejections',
    description: 'Compliance issues and aspect ratio mistakes trigger costly re-uploads and lost performance data.'
  }
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
            Video ad creation is a nightmare.
          </h2>
          <p className="text-pretty text-sm text-slate-600 sm:text-base">
            Every campaign slips further behind when scriptwriting, design, voice, and compliance live in disconnected tools.
          </p>
        </div>
        <div className="grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((point) => (
            <Card key={point.title} className="h-full border-none bg-white/80 shadow-[0_12px_35px_rgba(255,149,163,0.15)]">
              <CardHeader className="gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  <Flame className="size-4" />
                </span>
                <CardTitle className="text-base text-slate-900">{point.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <CardDescription className="text-sm text-slate-600">{point.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
