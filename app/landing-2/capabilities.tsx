import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, FileText, Database, Sparkles, Image } from 'lucide-react'
import { GradientBackground } from './gradient-background'
import { cn } from '@/lib/utils'

const capabilities = [
  {
    title: 'Smart AI Prompting',
    description:
      'Flexible template system with {{content}} placeholders for custom prompt engineering and specific use cases.',
    icon: Sparkles,
    accent: 'from-blue-200 via-indigo-200 to-purple-200',
  },
  {
    title: 'Intelligent Content Processing',
    description:
      'Remove boilerplate, navigation, and ads automatically to get readable article text and main content.',
    icon: FileText,
    accent: 'from-green-200 via-emerald-200 to-teal-200',
  },
  {
    title: 'Rich Metadata Extraction',
    description:
      'JSON output with comprehensive page data including titles, descriptions, headings, and OpenGraph.',
    icon: Database,
    accent: 'from-orange-200 via-amber-200 to-yellow-200',
  },
  {
    title: 'High-Quality Visual Capture',
    description:
      'Full-page screenshots with high quality, perfect for design analysis and visual AI training.',
    icon: Image,
    accent: 'from-pink-200 via-rose-200 to-red-200',
  },
]

const extractionFormats = [
  'Content',
  'Metadata',
  'AI Prompt',
  'Screenshot',
  'HTML',
  'JSON',
  'Markdown',
  'CSV',
]

const extractionStatuses = [
  { format: 'Content extraction', status: 'Complete' },
  { format: 'Metadata JSON', status: 'Processing' },
  { format: 'AI prompt ready', status: 'Queued' },
  { format: 'Screenshot capture', status: 'Complete' },
]

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative overflow-hidden py-24">
      <GradientBackground className="bg-[radial-gradient(circle_at_bottom,_rgba(255,240,199,0.7),_transparent_70%)]" />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6">
        <div className="mx-auto max-w-xl text-center">
          <Badge className="mx-auto w-fit rounded-full border border-amber-200 bg-amber-100/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
            Everything you need
          </Badge>
          <h2 className="mt-4 text-balance text-3xl font-semibold text-slate-900 md:text-4xl">
            Your all-in-one web extraction toolkit.
          </h2>
          <p className="mt-4 text-pretty text-sm text-slate-600 sm:text-base">
            Clean, structured data for your AI models and agents - with real-time testing and
            complete API access.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {capabilities.map((capability) => (
            <div
              key={capability.title}
              className="flex h-full flex-col rounded-3xl border border-white/50 bg-white/80 p-6 shadow-[0_18px_50px_rgba(255,186,81,0.15)]"
            >
              <span
                className={cn(
                  'mb-4 inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br text-slate-900',
                  capability.accent
                )}
              >
                <capability.icon className="size-5" />
              </span>
              <h3 className="text-lg font-semibold text-slate-900">{capability.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{capability.description}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-6 rounded-[32px] border border-white/60 bg-white/70 p-6 text-sm text-slate-600 shadow-[0_18px_50px_rgba(71,123,255,0.12)] lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-slate-900">
              Multiple output formats for every need
            </h3>
            <p>
              Get clean, structured data in formats perfect for AI training, content analysis, or
              data processing workflows.
            </p>
            <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              {extractionFormats.map((format) => (
                <li key={format} className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500" />
                  {format}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-[1px]">
            <div className="flex h-full flex-col gap-4 rounded-[28px] bg-white/95 p-6">
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
                <span>Extraction queue</span>
                <span>Live sync</span>
              </div>
              <div className="grid gap-3 text-sm text-slate-700">
                {extractionStatuses.map((row) => (
                  <div
                    key={row.format}
                    className="flex items-center justify-between rounded-2xl bg-slate-100/80 px-4 py-3"
                  >
                    <span className="font-medium">{row.format}</span>
                    <span className="text-xs text-emerald-600">{row.status}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-auto w-full rounded-full text-sm font-medium">
                Try format switching
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
