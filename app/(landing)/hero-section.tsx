'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { HeroHeader } from './header'
import { Sparkle, FileText } from 'lucide-react'
import BeamsBackground from '@/components/kokonutui/beams-background'
import AnimatedContent from '@/components/react-bits/AnimatedContent'

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main>
        <BeamsBackground>
          <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <span>Introducing Rizar - AI Platform</span>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="mx-auto mb-6 max-w-4xl text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Smart{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AI
              </span>{' '}
              Code Editor
            </h1>
          </div>
          <div className="relative">
            <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
              <AnimatedContent
                distance={150}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="bounce"
                initialOpacity={0.2}
                animateOpacity
                scale={1.1}
                threshold={0.2}
                delay={0.3}
              >
                <div className="mt-10">
                  <div className="bg-background p-10 rounded-lg shadow-lg border border-gray-200">
                    <Image
                      src="/hero-section-main-app-dark.png"
                      alt="Hero Section"
                      width={1000}
                      height={1000}
                    />
                  </div>
                </div>

                {/* <div>Content to Animate</div> */}
              </AnimatedContent>
            </div>
          </div>
        </BeamsBackground>
      </main>
    </>
  )
}
