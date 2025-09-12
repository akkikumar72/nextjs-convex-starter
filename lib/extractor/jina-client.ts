import { JinaApiOptions, JinaWrapper, JinaUsage, JinaExtractionData } from './types'

const BASE_URL = 'https://r.jina.ai'

const getApiKey = (apiKey?: string): string => process.env.JINA_AI_KEY || ''

const fetchFromJina = async <Data = unknown>(
  url: string,
  opts: JinaApiOptions,
  apiKey?: string
): Promise<{
  data: Data
  usage?: JinaUsage
}> => {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(url)}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${getApiKey(apiKey)}`,
      'X-Engine': 'browser',
      'X-Return-Format': opts.returnFormat,
    },
    signal: AbortSignal.timeout(30000),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`)
  }

  const json = (await response.json()) as JinaWrapper<Data>
  console.log({ json })

  return {
    data: json.data,
    usage: json.data.usage || json.meta?.usage,
  }
}

export const extractContent = async (
  url: string,
  apiKey?: string
): Promise<{ data: string; usage?: JinaUsage }> => {
  const result = await fetchFromJina<{ content: string }>(url, { returnFormat: 'content' }, apiKey)
  return {
    data: result.data.content,
    usage: result.usage,
  }
}

export const extractMetadata = async (
  url: string,
  apiKey?: string
): Promise<{ data: JinaExtractionData; usage?: JinaUsage }> =>
  fetchFromJina<JinaExtractionData>(url, { returnFormat: 'json' }, apiKey)

export const extractScreenshot = async (
  url: string,
  apiKey?: string
): Promise<{ data: string; usage?: JinaUsage }> => {
  const result = await fetchFromJina<{ screenshotUrl: string }>(
    url,
    { returnFormat: 'screenshot' },
    apiKey
  )
  return {
    data: result.data.screenshotUrl,
    usage: result.usage,
  }
}

export const extractMarkdown = async (
  url: string,
  apiKey?: string
): Promise<{ data: string; usage?: JinaUsage }> => {
  const result = await fetchFromJina<{ content: string }>(url, { returnFormat: 'markdown' }, apiKey)
  return {
    data: result.data.content,
    usage: result.usage,
  }
}

export const extractHtml = async (
  url: string,
  apiKey?: string
): Promise<{ data: string; usage?: JinaUsage }> => {
  const result = await fetchFromJina<{ html: string }>(url, { returnFormat: 'html' }, apiKey)
  return {
    data: result.data.html,
    usage: result.usage,
  }
}

export const extractWithAI = async (
  url: string,
  apiKey?: string
): Promise<{ data: string; usage?: JinaUsage }> => {
  const result = await fetchFromJina<JinaExtractionData>(url, { returnFormat: 'json' }, apiKey)
  return {
    data: result.data.content || result.data.text || JSON.stringify(result.data),
    usage: result.usage,
  }
}
