'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  IconSparkles,
  IconFileText,
  IconDatabase,
  IconCamera,
  IconCopy,
  IconCheck,
  IconArrowUpRight,
} from '@tabler/icons-react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { useAction } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ExtractionResult {
  success: boolean
  data?: string | Record<string, unknown>
  processingTime?: number
  error?: string
  usage?: {
    tokens?: number
    model?: string
  }
}

export default function ExtractPage() {
  const [url, setUrl] = useState('https://handinger.com')
  const [prompt, setPrompt] = useState('Summarize the content of this website:\n\n{{content}}')
  const [activeTab, setActiveTab] = useState('ai_prompt')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ExtractionResult | null>(null)
  const [curlCopied, setCurlCopied] = useState(false)
  const [resultCopied, setResultCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [resultFormat, setResultFormat] = useState('ai_prompt')
  const [resultUrl, setResultUrl] = useState('')
  const extract = useAction(api.extract.extract)

  const extractionModes = useMemo(
    () => [
      {
        value: 'ai_prompt',
        label: 'AI prompt',
        description:
          'Bring your own instruction and let our agent work on the live page copy. Use the {{content}} placeholder anywhere in your prompt to inject the fetched text.',
        icon: IconSparkles,
        accent: 'from-fuchsia-500/30 via-transparent to-sky-500/20',
        highlights: [
          'Interactive Q&A or summarisation',
          'Perfect for research briefs and customer support',
          'Stream responses straight into agents or RAG',
        ],
        badge: 'Most popular',
      },
      {
        value: 'content',
        label: 'Clean content',
        description:
          'Capture a polished Markdown export that mirrors the reading experience. We maintain headings, lists, tables, and outbound links in a tidy format.',
        icon: IconFileText,
        accent: 'from-amber-500/25 via-transparent to-rose-500/20',
        highlights: [
          'Great for knowledge bases or fine-tuning',
          'Preserves structure and hierarchy',
          'Ready for downstream indexing',
        ],
      },
      {
        value: 'metadata',
        label: 'Structured metadata',
        description:
          'Extract Open Graph, schema.org, and on-page entities into a single JSON payload so you can enrich products, articles, or CRM entries instantly.',
        icon: IconDatabase,
        accent: 'from-emerald-500/25 via-transparent to-cyan-500/20',
        highlights: [
          'Ideal for enrichment pipelines',
          'Surface canonical URLs and SEO data',
          'Pairs well with classification tasks',
        ],
      },
      {
        value: 'screenshot',
        label: 'Visual snapshot',
        description:
          'Generate a pixel-perfect full-page screenshot for QA, visual datasets, or change tracking. Works with both desktop and responsive layouts.',
        icon: IconCamera,
        accent: 'from-purple-500/25 via-transparent to-blue-500/20',
        highlights: [
          'Track visual regressions and layout changes',
          'Create thumbnail archives automatically',
          'Train multi-modal models with real context',
        ],
      },
    ],
    []
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleExtract = async () => {
    if (!url) {
      toast.error('Please enter a URL')
      return
    }

    setIsLoading(true)
    setResult(null)
    setResultFormat(activeTab)
    setResultUrl(url)

    try {
      const data = await extract({
        url,
        format: activeTab as 'ai_prompt' | 'content' | 'metadata' | 'screenshot',
      })
      setResult(data)

      if (data.success) {
        const tokenInfo = data.usage?.tokens ? ` (${data.usage.tokens} tokens)` : ''
        toast.success(`Extraction completed!${tokenInfo}`)
      } else {
        toast.error(data.error || 'Extraction failed')
      }
    } catch {
      toast.error('Failed to extract content')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, onStateChange: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard')
      onStateChange(true)
      setTimeout(() => onStateChange(false), 2000)
    } catch {
      toast.error('Failed to copy to clipboard')
    }
  }

  const generateCurl = () =>
    `curl -X POST ${window.location.origin}/api/extract \\n  -H 'Content-Type: application/json' \\n  -d '{"url":"${url}","type":"${activeTab}"${activeTab === 'ai_prompt' ? `,"prompt":"${prompt}"` : ''}}'`

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'ai_prompt':
        return <IconSparkles className="h-4 w-4" />
      case 'content':
        return <IconFileText className="h-4 w-4" />
      case 'metadata':
        return <IconDatabase className="h-4 w-4" />
      case 'screenshot':
        return <IconCamera className="h-4 w-4" />
      default:
        return null
    }
  }

  const activeMode =
    extractionModes.find((mode) => mode.value === activeTab) ?? extractionModes[0]
  const resultMode = extractionModes.find((mode) => mode.value === resultFormat)

  const getResultString = () => {
    if (!result) return ''

    if (!result.success) {
      return `Error: ${result.error ?? 'Unknown error'}`
    }

    if (resultFormat === 'screenshot') {
      return typeof result.data === 'string'
        ? result.data
        : JSON.stringify(result.data, null, 2)
    }

    return typeof result.data === 'string'
      ? result.data
      : JSON.stringify(result.data, null, 2)
  }

  const suggestionUrls = [
    'https://openai.com',
    'https://www.nytimes.com',
    'https://vercel.com/templates',
    'https://www.apple.com/newsroom/',
  ]

  const statHighlights = [
    {
      label: 'Avg processing time',
      value: '~5s',
    },
    {
      label: 'Supported outputs',
      value: 'Markdown, JSON, PNG',
    },
    {
      label: 'Uptime (90d)',
      value: '99.9%',
    },
  ]

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(88,80,236,0.12),_transparent_55%)]" />

      <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
        <section className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-background/80 p-8 shadow-xl shadow-primary/5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Badge variant="secondary" className="w-fit">
              Extract website content for AI without coding
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                The new extract dashboard
              </h1>
              <p className="max-w-2xl text-muted-foreground">
                Drop in any public URL, compare extraction styles in real time, and copy production-ready payloads into your automations.
              </p>
            </div>
          </div>
          <div className="grid w-full max-w-sm grid-cols-3 gap-3 text-sm text-muted-foreground">
            {statHighlights.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-muted/40 p-4 text-center shadow-sm"
              >
                <p className="text-xs uppercase tracking-wide">{stat.label}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-6">
              <Card className="relative overflow-hidden border bg-background/80 shadow-lg shadow-primary/10 backdrop-blur">
                <span className="pointer-events-none absolute -top-32 right-0 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
                <CardHeader className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-2xl">Configure extraction</CardTitle>
                      <CardDescription>
                        Paste a URL and preview how each mode transforms the page.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="gap-2 text-xs">
                      {getTabIcon(activeTab)}
                      {activeMode.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-sm font-medium">
                      Website URL
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/article"
                      className="h-12 text-base"
                    />
                    <div className="flex flex-wrap gap-2 pt-2">
                      {suggestionUrls.map((suggestion) => (
                        <Button
                          key={suggestion}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-full border-dashed px-3 text-xs"
                          onClick={() => setUrl(suggestion)}
                        >
                          {suggestion.replace('https://', '')}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {activeTab === 'ai_prompt' ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="prompt" className="text-sm font-medium">
                          AI prompt
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          Use {'{content}'} to inject the page copy
                        </span>
                      </div>
                      <Textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Summarise this article into three bullet points with key actions."
                        className="min-h-[120px] resize-y"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-primary/20 bg-muted/30 p-4 text-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-medium">Mode insight</span>
                      {getTabIcon(activeTab)}
                    </div>
                    <p className="text-muted-foreground">{activeMode.description}</p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1">
                        <IconSparkles className="h-4 w-4 text-primary" />
                        AI assisted
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1">
                        <IconDatabase className="h-4 w-4 text-primary" />
                        Structured output
                      </div>
                    </div>
                    <Button
                      onClick={handleExtract}
                      disabled={isLoading || !url}
                      className="h-12 w-full text-base sm:w-auto"
                    >
                      {isLoading ? 'Extracting…' : 'Run extraction'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {result ? (
                <Card className="border bg-background/90 shadow-xl shadow-primary/10 backdrop-blur">
                  <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl">
                        {result.success ? 'Extraction ready' : 'Extraction failed'}
                      </CardTitle>
                      <CardDescription>
                        {result.success
                          ? 'Inspect the payload below, then copy it into your workflow.'
                          : 'We could not complete the request. Review the error for next steps.'}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {resultMode ? (
                        <Badge variant="outline" className="gap-1">
                          {getTabIcon(resultFormat)} {resultMode.label}
                        </Badge>
                      ) : null}
                      {resultUrl ? (
                        <span className="inline-flex max-w-[200px] items-center gap-2 truncate rounded-full border bg-muted/40 px-3 py-1">
                          <IconArrowUpRight className="h-3.5 w-3.5 text-primary" />
                          {resultUrl}
                        </span>
                      ) : null}
                      {result.usage?.tokens ? (
                        <span className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1">
                          <IconDatabase className="h-3.5 w-3.5 text-primary" />
                          {result.usage.tokens} tokens
                        </span>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {result.success ? (
                      <div className="space-y-6">
                        {resultFormat !== 'screenshot' ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Preview</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => copyToClipboard(getResultString(), setResultCopied)}
                              >
                                {resultCopied ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
                                {resultCopied ? 'Copied' : 'Copy payload'}
                              </Button>
                            </div>
                            <div className="max-h-72 overflow-y-auto rounded-2xl border bg-muted/40 p-4">
                              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                                {getResultString()}
                              </pre>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <span className="text-sm font-medium text-muted-foreground">Screenshot preview</span>
                            <div className="overflow-hidden rounded-2xl border">
                              <img
                                src={String(result.data)}
                                alt="Website screenshot"
                                className="h-auto w-full"
                              />
                            </div>
                          </div>
                        )}

                        <Separator />

                        <div className="grid gap-4 text-sm sm:grid-cols-3">
                          {result.processingTime ? (
                            <div className="rounded-2xl border border-dashed bg-muted/40 p-3">
                              <p className="text-xs uppercase text-muted-foreground">Processing time</p>
                              <p className="mt-1 font-medium">{result.processingTime} ms</p>
                            </div>
                          ) : null}
                          {result.usage?.model ? (
                            <div className="rounded-2xl border border-dashed bg-muted/40 p-3">
                              <p className="text-xs uppercase text-muted-foreground">Model</p>
                              <p className="mt-1 font-medium">{result.usage.model}</p>
                            </div>
                          ) : null}
                          <div className="rounded-2xl border border-dashed bg-muted/40 p-3">
                            <p className="text-xs uppercase text-muted-foreground">Format</p>
                            <p className="mt-1 font-medium">{resultMode?.label ?? 'Custom'}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                        <p className="font-medium">{result.error ?? 'Unknown error'}</p>
                        <p className="mt-1 text-muted-foreground">
                          Check the URL is publicly accessible and try again.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : null}
            </div>

            <div className="space-y-6">
              <Card className="border bg-background/80 shadow-lg shadow-primary/10 backdrop-blur">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Choose your extraction mode</CardTitle>
                  <CardDescription>
                    Explore the differences and select the format that fits your workflow.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <TabsList className="flex w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                    {extractionModes.map((mode) => {
                      const Icon = mode.icon
                      const isActive = activeTab === mode.value

                      return (
                        <TabsTrigger
                          key={mode.value}
                          value={mode.value}
                          className={cn(
                            'flex-none rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-wide transition',
                            isActive
                              ? 'border-primary bg-primary/10 text-primary shadow-sm'
                              : 'border-transparent bg-muted/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {mode.label}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>

                  {extractionModes.map((mode) => {
                    const Icon = mode.icon

                    return (
                      <TabsContent key={mode.value} value={mode.value} className="space-y-5">
                        <div className="relative overflow-hidden rounded-3xl border bg-muted/30 p-5">
                          <span
                            className={cn(
                              'pointer-events-none absolute inset-0 rounded-3xl opacity-60 blur-3xl',
                              `bg-gradient-to-br ${mode.accent}`
                            )}
                            aria-hidden
                          />
                          <div className="relative z-10 space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                              <Icon className="h-4 w-4 text-primary" />
                              {mode.label}
                            </div>
                            <p className="text-sm text-muted-foreground">{mode.description}</p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {mode.highlights.map((highlight) => (
                                <li key={highlight} className="flex items-start gap-2">
                                  <IconCheck className="mt-0.5 h-3.5 w-3.5 text-primary" />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                    )
                  })}
                </CardContent>
              </Card>

              <Card className="border bg-background/80 shadow-lg shadow-primary/10 backdrop-blur">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">Plug into your workflow</CardTitle>
                  <CardDescription>
                    Start fast with a reusable CURL command or copy/paste into your SDK of choice.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Example CURL</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateCurl(), setCurlCopied)}
                      disabled={!mounted}
                      className="gap-2"
                    >
                      {curlCopied ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
                      {curlCopied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <div className="rounded-2xl border bg-muted/40 p-4 font-mono text-xs">
                    {mounted ? generateCurl() : 'Loading...'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
