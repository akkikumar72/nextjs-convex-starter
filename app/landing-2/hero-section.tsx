'use client'

import { useState } from 'react'
import Image from 'next/image'
import { GrainGradient } from '@paper-design/shaders-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, FileText, Database, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

const extractionTypes = [
  {
    id: 'ai',
    label: 'AI',
    icon: Sparkles,
    description: 'Smart AI prompting with flexible template system',
    gradient: 'from-blue-500 via-indigo-500 to-purple-500',
    image: '/hero-ai-extraction.png',
  },
  {
    id: 'content',
    label: 'Content',
    icon: FileText,
    description: 'Clean, readable text extraction',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    image: '/hero-content-extraction.png',
  },
  {
    id: 'metadata',
    label: 'Metadata',
    icon: Database,
    description: 'Structured JSON with comprehensive data',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    image: '/hero-metadata-extraction.png',
  },
  {
    id: 'screenshot',
    label: 'Screenshot',
    icon: Camera,
    description: 'High-quality visual capture',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    image: '/hero-screenshot-extraction.png',
  },
]

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('ai')

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
        {/* Hero Content */}
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center p-6">
          <Badge className="flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-1 text-xs uppercase tracking-wide text-slate-600 backdrop-blur">
            <span className="inline-flex size-1.5 rounded-full bg-emerald-400" />
            Interactive Web Extraction Platform
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Transform any website into AI-ready data instantly
          </h1>
          <p className="text-pretty text-base text-slate-600 sm:text-lg">
            Turn any URL into AI-ready context instantly. The most advanced web extraction platform
            with live playground and transparent pricing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button className="group rounded-full px-6 py-2 text-sm font-medium">
              Try live extraction
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700"
            >
              View playground
            </Button>
          </div>
        </div>

        {/* Image Display */}
        <div className="mx-auto w-full max-w-6xl px-6 mt-12">
          <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-lg">
            <div className="absolute -left-20 top-10 h-40 w-40 rounded-full bg-indigo-200 opacity-40 blur-3xl" />
            <div className="absolute -right-16 bottom-6 h-32 w-32 rounded-full bg-emerald-200 opacity-30 blur-3xl" />

            <div className="relative overflow-hidden rounded-xl border border-white/60 bg-white">
              <div className="relative h-[500px] w-full overflow-hidden">
                {extractionTypes.map((type) => (
                  <div
                    key={type.id}
                    className={cn(
                      'absolute inset-0 transition-all duration-500 ease-in-out',
                      activeTab === type.id
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-full opacity-0'
                    )}
                  >
                    <Image
                      src={type.image}
                      alt={`${type.label} extraction interface`}
                      fill
                      className="object-cover"
                      priority={activeTab === type.id}
                    />
                  </div>
                ))}
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <div className="text-xs uppercase tracking-wide text-white/70">Live preview</div>
                <p className="mt-1 text-sm font-semibold text-white">
                  {extractionTypes.find((t) => t.id === activeTab)?.label} extraction in action
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto w-full max-w-6xl px-6 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {extractionTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={cn(
                  'group flex flex-col items-start gap-3 rounded-2xl border p-4 transition-all duration-300 text-left',
                  activeTab === type.id
                    ? 'border-blue-600 bg-white shadow-lg'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                )}
              >
                <div
                  className={cn(
                    'flex size-12 items-center justify-center rounded-xl transition-all duration-300',
                    activeTab === type.id
                      ? 'bg-gradient-to-br text-white'
                      : 'bg-gray-200 text-gray-600',
                    activeTab === type.id ? type.gradient : '',
                    activeTab === type.id ? 'scale-110' : 'group-hover:scale-105'
                  )}
                >
                  <type.icon className="size-6" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900 mb-1">{type.label}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{type.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
