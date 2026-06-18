import { createServer } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'

const env = loadEnv('.env.server')
const port = Number(env.COZE_PROXY_PORT || 3001)
const apiBase = env.COZE_API_BASE || 'https://api.coze.cn'
const apiToken = env.COZE_API_TOKEN
const botId = env.COZE_BOT_ID || '7652290005369028635'

function loadEnv(file) {
  if (!existsSync(file)) return {}
  return readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .reduce((result, line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return result
      const index = trimmed.indexOf('=')
      if (index === -1) return result
      const key = trimmed.slice(0, index).trim()
      const value = trimmed.slice(index + 1).trim()
      result[key] = value
      return result
    }, {})
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  })
  res.end(JSON.stringify(data))
}

async function readJson(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

async function cozeFetch(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.msg || data.message || `Coze API failed: ${response.status}`)
  }
  if (data.code && data.code !== 0) {
    throw new Error(data.msg || data.message || `Coze API error: ${data.code}`)
  }
  return data
}

async function waitForAnswer(chatId, conversationId) {
  for (let index = 0; index < 30; index += 1) {
    const detail = await cozeFetch(`/v3/chat/retrieve?chat_id=${chatId}&conversation_id=${conversationId}`)
    const status = detail.data?.status

    if (status === 'completed') {
      const messages = await cozeFetch(`/v3/chat/message/list?chat_id=${chatId}&conversation_id=${conversationId}`)
      const answer = messages.data?.find(item => item.type === 'answer') || messages.data?.find(item => item.role === 'assistant')
      return answer?.content || 'Coze completed the reply, but no text content was returned.'
    }

    if (['failed', 'requires_action', 'canceled'].includes(status)) {
      throw new Error(detail.data?.last_error?.msg || `Coze chat status: ${status}`)
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  throw new Error('Coze response timed out')
}

async function handleChat(req, res) {
  if (!apiToken) {
    sendJson(res, 500, { error: 'Missing COZE_API_TOKEN. Please configure it in .env.server first.' })
    return
  }

  const body = await readJson(req)
  const message = String(body.message || '').trim()
  const userId = String(body.userId || 'memory-site-user')

  if (!message) {
    sendJson(res, 400, { error: 'message is required' })
    return
  }

  const created = await cozeFetch('/v3/chat', {
    method: 'POST',
    body: JSON.stringify({
      bot_id: botId,
      user_id: userId,
      stream: false,
      additional_messages: [
        {
          role: 'user',
          content: message,
          content_type: 'text'
        }
      ]
    })
  })

  const chatId = created.data?.id
  const conversationId = created.data?.conversation_id

  if (!chatId || !conversationId) {
    sendJson(res, 502, {
      error: created.msg || created.message || 'Coze did not return chat_id or conversation_id.',
      raw: created
    })
    return
  }

  const answer = await waitForAnswer(chatId, conversationId)
  sendJson(res, 200, { answer, chatId, conversationId })
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      sendJson(res, 204, {})
      return
    }

    if (req.method === 'POST' && req.url === '/api/coze/chat') {
      await handleChat(req, res)
      return
    }

    sendJson(res, 404, { error: 'Not found' })
  } catch (error) {
    sendJson(res, 500, { error: error.message || 'Coze proxy failed' })
  }
})

server.listen(port, () => {
  console.log(`Coze proxy server running at http://localhost:${port}`)
})
