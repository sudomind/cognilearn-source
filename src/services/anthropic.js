/**
 * Anthropic API service
 *
 * Calls are proxied through the backend at VITE_API_URL to keep
 * the API key server-side. If a direct key is provided as
 * VITE_ANTHROPIC_API_KEY the requests go straight to Anthropic
 * (useful for local dev / demo mode).
 */

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://cognilearn-backend.onrender.com'
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

/**
 * Core completion helper — tries the backend proxy first,
 * falls back to a direct Anthropic call if a key is set.
 */
async function complete(system, userMessage) {
  const body = {
    model: MODEL,
    max_tokens: 1500,
    system,
    messages: [{ role: 'user', content: userMessage }],
  }

  // Try backend proxy first
  try {
    const token = localStorage.getItem('cognilearn_token')
    const res = await fetch(`${BACKEND_URL}/ai/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const data = await res.json()
      return data.content?.map((b) => b.text || '').join('') || ''
    }
  } catch {
    // Backend unavailable — try direct if key is present
  }

  // Direct call (demo / dev only)
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('No AI endpoint available. Set VITE_ANTHROPIC_API_KEY or ensure backend is running.')

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error(`Anthropic error: ${res.status}`)
  const data = await res.json()
  return data.content?.map((b) => b.text || '').join('') || ''
}

/**
 * Multi-turn chat completion
 */
async function chatComplete(system, messages) {
  const body = {
    model: MODEL,
    max_tokens: 1500,
    system,
    messages,
  }

  try {
    const token = localStorage.getItem('cognilearn_token')
    const res = await fetch(`${BACKEND_URL}/ai/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const data = await res.json()
      return data.content?.map((b) => b.text || '').join('') || ''
    }
  } catch { /* fall through */ }

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('No AI endpoint available.')

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error(`Anthropic error: ${res.status}`)
  const data = await res.json()
  return data.content?.map((b) => b.text || '').join('') || ''
}

// ─── Exported AI feature functions ────────────────────

export async function generateSummary(content, docName) {
  return complete(
    `You are an expert educational AI tutor. Create concise, well-structured summaries. 
Use **bold** for key terms. Organise into 3-4 clear paragraphs: main topic, key concepts, important details, takeaways.`,
    `Summarise this document titled "${docName}" for a student:\n\n${content.slice(0, 3000)}\n\nProvide a 3-4 paragraph educational summary using **bold** for important terms.`
  )
}

export async function explainConcept(concept, content) {
  return complete(
    `You are an expert educator who explains complex concepts clearly. 
Use analogies, examples, and structured explanations. Format with markdown.`,
    `Based on this document, explain "${concept}" in detail:\n\nContext: ${content.slice(0, 2000)}\n\nProvide:\n1. Definition and core idea\n2. Key components\n3. Real-world examples\n4. Why it matters`
  )
}

export async function generateFlashcards(content, count = 8) {
  const raw = await complete(
    `You are an expert at creating educational flashcards. Always respond with ONLY valid JSON — no markdown, no explanation.`,
    `Create exactly ${count} educational flashcards from this content.\n\nContent: ${content.slice(0, 2500)}\n\nRespond with ONLY a JSON array:\n[{"front": "Question?", "back": "Answer..."}, ...]\n\nCreate ${count} flashcards covering the most important concepts.`
  )

  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)
    return Array.isArray(parsed) ? parsed.slice(0, count) : []
  } catch {
    const match = raw.match(/\[[\s\S]*\]/)
    if (match) {
      try { return JSON.parse(match[0]).slice(0, count) } catch { return [] }
    }
    return []
  }
}

export async function generateQuiz(content, count = 5) {
  const raw = await complete(
    `You are an expert at creating educational multiple-choice quizzes. Always respond with ONLY valid JSON — no markdown, no extra text.`,
    `Create exactly ${count} multiple-choice questions from this content.\n\nContent: ${content.slice(0, 2500)}\n\nRespond with ONLY a JSON array:\n[{\n  "question": "Question text?",\n  "options": ["A", "B", "C", "D"],\n  "correct": 0,\n  "explanation": "Why this is correct..."\n}]\n\nRules: 4 options each, "correct" is 0-indexed, explanations should be educational.`
  )

  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned).slice(0, count)
  } catch {
    const match = raw.match(/\[[\s\S]*\]/)
    if (match) {
      try { return JSON.parse(match[0]).slice(0, count) } catch { return [] }
    }
    return []
  }
}

export async function sendChatMessage(userMessage, content, docName, history = []) {
  const system = `You are an intelligent AI tutor helping students understand "${docName}". 
Answer questions based on the document content provided. Be clear, educational, and helpful. 
Use markdown formatting where appropriate.\n\nDocument Content:\n${content.slice(0, 3000)}`

  const messages = [
    ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  return chatComplete(system, messages)
}
