'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useAction } from 'convex/react'
import { api } from '@/convex/_generated/api'

interface ExtractionResult {
  success: boolean
  data?: string | Record<string, unknown>
  processingTime?: number
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
  const extract = useAction(api.extract.extract)

  useEffect(() => {
    setMounted(true)
  }, [])

  // const handleClick = () => {
  //   extract({
  //     url,
  //     format: activeTab as 'content' | 'markdown' | 'html' | 'json' | 'text',
  // });

  const handleExtract = async () => {
    if (!url) {
      toast.error('Please enter a URL')
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const data = await extract({
        url,
        format: activeTab as 'ai_prompt' | 'content' | 'metadata' | 'screenshot',
      })
      setResult(data)
      // const response = await fetch('/api/extract', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     url,
      //     type: activeTab,
      //     prompt: activeTab === 'ai_prompt' ? prompt : undefined,
      //   }),
      // })

      // const data = await response.json()
      // setResult(data)

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

  const generateCurl = () =>
    `curl -X POST ${window.location.origin}/api/extract \
  -H 'Content-Type: application/json' \
  -d '{"url":"${url}","type":"${activeTab}"${activeTab === 'ai_prompt' ? `,"prompt":"${prompt}"` : ''}}'`

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
  console.log({ result })
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
                    <span className="text-sm font-medium">Example CURL</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateCurl())}
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
                      {mounted ? generateCurl() : 'Loading...'}
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
                  {result.success ? 'Extraction completed' : 'Extraction failed'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.success ? (
                  <div className="space-y-4">
                    {activeTab !== 'screenshot' ? (
                      <div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md max-h-60 overflow-y-auto">
                          <pre className="text-sm whitespace-pre-wrap">
                            {typeof result.data === 'string'
                              ? result.data
                              : JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={String(result.data)}
                        alt="Website screenshot"
                        className="max-w-full h-auto rounded-md border"
                      />
                    )}

                    <Separator />

                    {result.processingTime && (
                      <div className="text-sm text-muted-foreground">
                        Processing time: {result.processingTime}ms
                      </div>
                    )}
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
