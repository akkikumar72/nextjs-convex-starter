import { Badge } from '@/components/ui/badge'
import { GradientBackground } from './gradient-background'

const faqs = [
  {
    question: 'How fast can we launch a campaign?',
    answer:
      'Most teams ship their first fully localized campaign within 48 hours. Templates, scripts, and export profiles are included so you can go live immediately.'
  },
  {
    question: 'Do we keep our brand voice?',
    answer:
      'Yes. Upload your guidelines once and MagicUI enforces fonts, colours, tone, and legal fine print across every new asset.'
  },
  {
    question: 'Can I bring my own footage?',
    answer:
      'Absolutely. Drop your product clips or UGC takes in and the editor will blend them with AI presenters, motion graphics, and captions automatically.'
  },
  {
    question: 'What about compliance reviews?',
    answer:
      'Every render includes automated checks for Meta, TikTok, and Google policies, ensuring each version passes before you publish.'
  }
]

export default function FAQSection() {
  return (
    <section id="faq" className="relative overflow-hidden py-24">
      <GradientBackground className="bg-[radial-gradient(circle_at_top,_rgba(211,255,246,0.65),_transparent_70%)]" />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6">
        <div className="text-center">
          <Badge className="mx-auto w-fit rounded-full border border-cyan-200 bg-cyan-100/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-600">
            FAQ
          </Badge>
          <h2 className="mt-4 text-balance text-3xl font-semibold text-slate-900 md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-pretty text-sm text-slate-600">
            Everything you need to know before you launch your next high-performing campaign with MagicUI.
          </p>
        </div>
        <div className="divide-y divide-slate-200 overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_14px_45px_rgba(76,201,240,0.1)]">
          {faqs.map((item, index) => (
            <details key={item.question} className="group px-6 py-5 text-left transition" open={index === 0}>
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium text-slate-900 marker:hidden">
                {item.question}
                <span className="flex size-6 items-center justify-center rounded-full border border-slate-200 text-xs text-slate-500 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
