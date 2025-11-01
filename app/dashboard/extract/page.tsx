'use client'

import { useState } from 'react'
import {
    IconAdjustmentsHorizontal,
    IconCamera,
    IconCode,
    IconDatabase,
    IconFileText,
    IconSparkles,
} from '@tabler/icons-react'
import SmoothTab from '@/components/kokonutui/smooth-tab'

import { BeamsBackground } from '@/components/kokonutui/beams-background'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type ExtractionFormat = 'ai_prompt' | 'content' | 'metadata' | 'screenshot'

interface ExtractionModeConfig {
  id: ExtractionFormat
  label: string
  description: string
  helper: string
  placeholder: string
  ctaLabel: string
  codeLabel: string
  icon: React.ReactNode
  bullets: string[]
}

const extractionModes: ExtractionModeConfig[] = [
    {
        id: 'ai_prompt',
        label: 'AI',
        description: 'Guide the extractor with custom prompts for AI-ready insights.',
        helper: 'Inject page content into your instructions to craft summaries, briefs, or marketing copy tailor-made for your use case.',
        placeholder: 'Summarize the content of this website…',
        ctaLabel: 'Run AI extraction',
        codeLabel: 'Get AI code',
        icon: <IconSparkles className="h-4 w-4" />,
        bullets: [
            'Prompt-aware rewriting with {{content}} placeholders',
            'Great for research notes and content briefs',
            'Caches responses for repeat requests automatically',
        ],
    },
    {
        id: 'content',
        label: 'Content',
        description: 'Pull the core article, keeping hierarchy and structure intact.',
        helper: 'Perfect for knowledge bases, blog ingestion, or anywhere you need clean article output ready to ship.',
        placeholder: 'https://example.com/product-updates',
        ctaLabel: 'Start content fetching',
        codeLabel: 'Get scrape code',
        icon: <IconFileText className="h-4 w-4" />,
        bullets: [
            'Extracts readable markdown with headings preserved',
            'Strips ads, navigation, and noisy UI reliably',
            'Returns deterministic output for downstream tooling',
        ],
    },
    {
        id: 'metadata',
        label: 'Metadata',
        description: 'Collect SEO-ready metadata, canonical URLs, and structured details.',
        helper: 'Ideal for monitoring competitors, powering sitemaps, or syncing landing page attributes.',
        placeholder: 'https://example.com/docs',
        ctaLabel: 'Fetch metadata',
        codeLabel: 'Get metadata code',
        icon: <IconDatabase className="h-4 w-4" />,
        bullets: [
            'Grabs title, description, and Open Graph signals',
            'Surfaces canonical tags and language hints',
            'Outputs predictable JSON for analytics pipelines',
        ],
    },
    {
        id: 'screenshot',
        label: 'Screenshot',
        description: 'Capture pixel-perfect renders for visual QA or sharing.',
        helper: 'Switch between desktop and mobile profiles to preview how pages feel in different contexts.',
        placeholder: 'https://example.com',
        ctaLabel: 'Capture screenshot',
        codeLabel: 'Get capture code',
        icon: <IconCamera className="h-4 w-4" />,
        bullets: [
            'Full-height capture with scroll stitching',
            'Desktop and mobile device presets available',
            'Easy to share or archive visual regressions',
        ],
    },
]

export default function ExtractPage() {
    const [activeTab, setActiveTab] = useState<ExtractionFormat>('content')
    const [url, setUrl] = useState('https://example.com')

    const activeModeConfig =
        extractionModes.find((mode) => mode.id === activeTab) ?? extractionModes[0]

    return (
        <div className="relative mx-auto flex min-h-screen w-full flex-col overflow-hidden">
            <BeamsBackground />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-4 pb-16 pt-12 sm:px-8 lg:px-12 z-10">
                <header className="flex flex-col items-center gap-4 text-center">
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                        Playground
                    </h1>
                    <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
                        API, Docs and Playground - all in one place
                    </p>
                </header>

                <div className="space-y-4">
                    <SmoothTab
                        items={extractionModes.map((mode, index) => ({
                            id: mode.id,
                            title: mode.label,
                            color:
                                index === 0
                                    ? 'bg-blue-500 hover:bg-blue-600'
                                    : index === 1
                                      ? 'bg-purple-500 hover:bg-purple-600'
                                      : index === 2
                                        ? 'bg-emerald-500 hover:bg-emerald-600'
                                        : 'bg-amber-500 hover:bg-amber-600',
                        }))}
                        onChange={(id) => setActiveTab(id as ExtractionFormat)}
                        defaultTabId={activeTab}
                    />

                    <div className="relative rounded-xl shadow-lg">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-xl blur-lg opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <Card className="relative p-6 bg-background/80 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex-grow">
                                    <Input
                                        id="url"
                                        type="url"
                                        value={url}
                                        onChange={(event) => setUrl(event.target.value)}
                                        placeholder={activeModeConfig.placeholder}
                                        className="h-12 text-base"
                                    />
                                </div>
                                <Button variant="ghost" size="icon">
                                    <IconAdjustmentsHorizontal className="h-5 w-5" />
                                </Button>
                                <Select defaultValue="markdown">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="markdown">Markdown</SelectItem>
                                        <SelectItem value="text">Plain Text</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon">
                                    <IconCode className="h-5 w-5" />
                                </Button>
                                <Button className="h-12 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 px-6 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl">
                                    Start scraping
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-semibold tracking-tight">Recent Runs</h2>
                    <Card className="mt-4">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Endpoint</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Started</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {/* Placeholder rows */}
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">grafana.com/about/careers</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">Success</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">Oct 10, 2025</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">daisyui.com</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">Success</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">Oct 9, 2025</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
