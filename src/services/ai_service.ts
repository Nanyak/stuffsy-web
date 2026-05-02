const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:9808'

export type SourceChunk = {
  file_id: string
  file_name: string
  page?: number
  chunk_index: number
  text: string
}

type QueryOptions = {
  question: string
  scope: string          // 'all' or a folder path
  onToken:  (token: string) => void
  onSource: (source: SourceChunk) => void
  onDone:   () => void
  onError:  (err: Error) => void
}

/** Opens an SSE stream to the RAG query endpoint.
 *  Returns a cleanup function that closes the connection. */
export function queryAI(opts: QueryOptions): () => void {
  const params = new URLSearchParams({ q: opts.question, scope: opts.scope })
  const url = `${BASE}/v1/api/ai/query?${params}`

  const es = new EventSource(url, { withCredentials: true })

  es.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data) as { token?: string; source?: SourceChunk; done?: boolean }
      if (data.done) {
        opts.onDone()
        es.close()
      } else if (data.token) {
        opts.onToken(data.token)
      } else if (data.source) {
        opts.onSource(data.source)
      }
    } catch {
      opts.onError(new Error('Unexpected response from AI service'))
      es.close()
    }
  }

  es.onerror = () => {
    opts.onError(new Error('AI service is not available yet. Backend coming soon.'))
    es.close()
  }

  return () => es.close()
}
