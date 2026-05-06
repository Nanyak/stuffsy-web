const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:9808'

export type SourceChunk = {
  file_id: string
  file_name: string
  page?: number
  chunk_index: number
  text: string
}

type AIEvent =
  | { type: 'source'; data: SourceChunk }
  | { type: 'token';  data: string }
  | { type: 'done' }

export async function* streamAI(opts: {
  question: string
  scope: string
  token: string
  signal?: AbortSignal
}): AsyncGenerator<AIEvent> {
  const params = new URLSearchParams({ q: opts.question, scope: opts.scope })
  const resp = await fetch(`${BASE}/v1/api/ai/query?${params}`, {
    headers: { Authorization: `Bearer ${opts.token}`, Accept: 'text/event-stream' },
    signal: opts.signal,
  })

  if (!resp.ok) throw new Error('AI service is not available yet. Backend coming soon.')

  const reader = resp.body!.getReader()
  const decoder = new TextDecoder()
  let buf = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buf += decoder.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const raw = line.slice(6).trim()
      if (!raw) continue
      try {
        const data = JSON.parse(raw) as { token?: string; source?: SourceChunk; done?: boolean }
        if (data.done)        { yield { type: 'done' }; return }
        else if (data.token)  yield { type: 'token',  data: data.token }
        else if (data.source) yield { type: 'source', data: data.source }
      } catch { /* ignore malformed lines */ }
    }
  }
}
