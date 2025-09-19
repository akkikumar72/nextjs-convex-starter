import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Flame, Headset, Sparkles, Timer } from 'lucide-react'
import { GradientBackground } from './gradient-background'
import { cn } from '@/lib/utils'

const capabilities = [
  {
    title: 'AI Script Writing',
    description: 'Feed your prompt or product page and let MagicUI draft persuasive hooks, CTAs, and localized copy in seconds.',
    icon: Sparkles,
    accent: 'from-pink-200 via-purple-200 to-indigo-200'
  },
  {
    title: 'AI Avatars',
    description: 'Spin up human presenters from a single selfie. Every language, tone, and outfit is just a slider away.',
    icon: Flame,
    accent: 'from-orange-200 via-rose-200 to-pink-200'
  },
  {
    title: 'Video Editor',
    description: 'Drag, drop, and restructure scenes with timeline precision. Auto-resize to vertical, square, or widescreen.',
    icon: Timer,
    accent: 'from-blue-200 via-sky-200 to-cyan-200'
  },
  {
    title: 'Global Localization',
    description: 'Auto-translate subtitles, voiceover, and on-screen text into 30+ languages with one-click compliance checks.',
    icon: Headset,
    accent: 'from-green-200 via-emerald-200 to-teal-200'
  }
]

const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Arabic', 'Hindi', 'Japanese']

const localizationStatuses = [
  { locale: 'EN → ES', status: 'Approved' },
  { locale: 'EN → FR', status: 'In review' },
  { locale: 'EN → JP', status: 'Rendering' },
  { locale: 'EN → PT-BR', status: 'Approved' }
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
            Your end-to-end production studio, automated.
          </h2>
          <p className="mt-4 text-pretty text-sm text-slate-600 sm:text-base">
            Swap tool hopping for a single MagicUI workspace crafted for high-volume creative teams.
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
            <h3 className="text-2xl font-semibold text-slate-900">30 languages supported out of the box</h3>
            <p>
              Translate captions, voiceovers, legal text, and on-screen graphics with neural precision. Every export is packaged for the ad networks you rely on most.
            </p>
            <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              {languages.map((language) => (
                <li key={language} className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500" />
                  {language}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 p-[1px]">
            <div className="flex h-full flex-col gap-4 rounded-[28px] bg-white/95 p-6">
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
                <span>Localization board</span>
                <span>Live sync</span>
              </div>
              <div className="grid gap-3 text-sm text-slate-700">
                {localizationStatuses.map((row) => (
                  <div
                    key={row.locale}
                    className="flex items-center justify-between rounded-2xl bg-slate-100/80 px-4 py-3"
                  >
                    <span className="font-medium">{row.locale}</span>
                    <span className="text-xs text-emerald-600">{row.status}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-auto w-full rounded-full text-sm font-medium">
                Open localization tools
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
