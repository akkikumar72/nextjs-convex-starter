'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  IconSparkles,
  IconFileText,
  IconDatabase,
  IconCamera,
  IconCopy,
  IconCheck,
} from '@tabler/icons-react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

interface ExtractionResult {
  success: boolean
  requestId: string
  cached: boolean
  credits: {
    cost: number
    remaining: number
    complexity: 'failed' | 'cached' | 'normal' | 'advanced'
  }
  result: {
    content?: string
    aiResponse?: string
    screenshotUrl?: string
    metadata?: Record<string, unknown>
    processingTime: number
  }
  error?: string
}

export default function ExtractPage() {
  const [url, setUrl] = useState('https://handinger.com')
  const [prompt, setPrompt] = useState('Summarize the content of this website:\n\n{{content}}')
  const [activeTab, setActiveTab] = useState('ai_prompt')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ExtractionResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

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

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          type: activeTab,
          prompt: activeTab === 'ai_prompt' ? prompt : undefined,
        }),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        toast.success(`Extraction completed! Used ${data.credits.cost} credits`)
      } else {
        toast.error(data.error || 'Extraction failed')
      }
    } catch {
      toast.error('Failed to extract content')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy to clipboard')
    }
  }

  const generateApiUrl = () => {
    if (!mounted) return ''
    const baseUrl = window.location.origin
    const encodedUrl = encodeURIComponent(url)
    return `${baseUrl}/api/extract?url=${encodedUrl}&type=${activeTab}`
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'ai_prompt':
        return <IconSparkles className="w-4 h-4" />
      case 'content':
        return <IconFileText className="w-4 h-4" />
      case 'metadata':
        return <IconDatabase className="w-4 h-4" />
      case 'screenshot':
        return <IconCamera className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Try it out</h1>
        <p className="text-muted-foreground">
          Extract website content for AI without coding. Test our extraction capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Website URL</CardTitle>
              <CardDescription>Enter the URL you want to extract content from</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="mt-1"
                />
              </div>

              {activeTab === 'ai_prompt' && (
                <div>
                  <Label htmlFor="prompt">AI Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your AI prompt here..."
                    className="mt-1 min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Use {'{content}'} to specify where to insert the content of the page. Otherwise,
                    we will add it at the end.
                  </p>
                </div>
              )}

              <Button onClick={handleExtract} disabled={isLoading || !url} className="w-full">
                {isLoading ? 'Extracting...' : 'Extract Content'}
              </Button>
            </CardContent>
          </Card>

          {/* Credits Display */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Credits</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {result?.credits.remaining || 1000} remaining
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Extraction Types</CardTitle>
              <CardDescription>Choose what type of content to extract</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="ai_prompt" className="flex items-center gap-2">
                    {getTabIcon('ai_prompt')}
                    <span className="hidden sm:inline">AI</span>
                  </TabsTrigger>
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    {getTabIcon('content')}
                    <span className="hidden sm:inline">Content</span>
                  </TabsTrigger>
                  <TabsTrigger value="metadata" className="flex items-center gap-2">
                    {getTabIcon('metadata')}
                    <span className="hidden sm:inline">Metadata</span>
                  </TabsTrigger>
                  <TabsTrigger value="screenshot" className="flex items-center gap-2">
                    {getTabIcon('screenshot')}
                    <span className="hidden sm:inline">Screenshot</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">API Call</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateApiUrl())}
                      disabled={!mounted}
                    >
                      {copied ? (
                        <IconCheck className="w-4 h-4" />
                      ) : (
                        <IconCopy className="w-4 h-4" />
                      )}
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <code className="text-sm break-all">
                      {mounted ? generateApiUrl() : 'Loading API URL...'}
                    </code>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  {result.success ? 'Extraction completed successfully' : 'Extraction failed'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.success ? (
                  <div className="space-y-4">
                    {result.result.content && (
                      <div>
                        <h4 className="font-medium mb-2">Content (Markdown)</h4>
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md max-h-60 overflow-y-auto">
                          <pre className="text-sm whitespace-pre-wrap">{result.result.content}</pre>
                        </div>
                      </div>
                    )}

                    {result.result.aiResponse && (
                      <div>
                        <h4 className="font-medium mb-2">AI Response</h4>
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md max-h-60 overflow-y-auto">
                          <pre className="text-sm whitespace-pre-wrap">
                            {result.result.aiResponse}
                          </pre>
                        </div>
                      </div>
                    )}

                    {result.result.metadata && (
                      <div>
                        <h4 className="font-medium mb-2">Metadata</h4>
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md max-h-60 overflow-y-auto">
                          <pre className="text-sm whitespace-pre-wrap">
                            {JSON.stringify(result.result.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {result.result.screenshotUrl && (
                      <div>
                        <h4 className="font-medium mb-2">Screenshot</h4>
                        <img
                          src={result.result.screenshotUrl}
                          alt="Website screenshot"
                          className="max-w-full h-auto rounded-md border"
                        />
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Processing time: {result.result.processingTime}ms</span>
                      <span>Credits used: {result.credits.cost}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600">
                    <p>Error: {result.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
