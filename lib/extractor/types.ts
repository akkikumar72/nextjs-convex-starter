export type JinaReturnFormat =
  | 'markdown'
  | 'content'
  | 'html'
  | 'text'
  | 'pageshot'
  | 'screenshot'
  | 'vlm'
  | 'readerlm-v2'

export interface JinaApiOptions {
  returnFormat: JinaReturnFormat | 'json'
}

export interface JinaUsage {
  tokens: number
}

export interface JinaWrapper<Data = unknown> {
  code: number
  status: number
  data: Data & {
    usage?: JinaUsage
  }
  meta?: {
    usage?: JinaUsage
  }
}

export interface ExtractionRequest {
  url: string
  type: 'content' | 'metadata' | 'screenshot' | 'ai_prompt' | 'markdown' | 'html'
  prompt?: string
}

export interface JinaExtractionData {
  text?: string
  title?: string
  description?: string
  url?: string
  publishedTime?: string
  content?: string
  metadata?: Record<string, unknown>
  external?: Record<string, unknown>
  usage?: JinaUsage
  [key: string]: unknown
}

export interface ExtractionResponse {
  success: boolean
  data?: string | JinaExtractionData
  processingTime?: number
  usage?: JinaUsage
  error?: string
}
