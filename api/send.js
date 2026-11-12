const MAX = { name: 80, email: 120, message: 2000 }
const WINDOW_MS = 10 * 60 * 1000 
const PER_IP = 3 
const HOUR_MS = 60 * 60 * 1000
const GLOBAL_PER_HOUR = 30 
const ipHits = new Map()
const recent = new Map()
let globalHits = []

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  return (fwd ? String(fwd).split(',')[0].trim() : req.socket?.remoteAddress) || 'unknown'
}

function tooMany(ip) {
  const now = Date.now()
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  globalHits = globalHits.filter((t) => now - t < HOUR_MS)
  if (hits.length >= PER_IP || globalHits.length >= GLOBAL_PER_HOUR) return true
  hits.push(now)
  ipHits.set(ip, hits)
  globalHits.push(now)
  if (ipHits.size > 1000) {
    for (const [k, v] of ipHits) if (!v.some((t) => now - t < WINDOW_MS)) ipHits.delete(k)
  }
  return false
}

function dupKey(ip, message) {
  return ip + '|' + message.trim().toLowerCase()
}

function isDuplicate(ip, message) {
  const prev = recent.get(dupKey(ip, message))
  return Boolean(prev && Date.now() - prev < HOUR_MS)
}

function markSent(ip, message) {
  const now = Date.now()
  recent.set(dupKey(ip, message), now)
  if (recent.size > 1000) {
    for (const [k, t] of recent) if (now - t >= HOUR_MS) recent.delete(k)
  }
}
// ======================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Faqat POST so‘rovi qabul qilinadi' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY topilmadi' })
  }

  if (!String(req.headers['content-type'] || '').includes('application/json') || req.headers['x-portfolio'] !== 'terminal') {
    return res.status(403).json({ error: 'So‘rov rad etildi' })
  }

  const { name, email, message } = req.body || {}

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Ismingizni kiriting' })
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'To‘g‘ri email manzilini kiriting' })
  }
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Xabar matnini kiriting' })
  }
  if (name.length > MAX.name || email.length > MAX.email || message.length > MAX.message) {
    return res.status(400).json({ error: `Matn juda uzun (ism ${MAX.name}, email ${MAX.email}, xabar ${MAX.message} belgigacha)` })
  }

  const ip = clientIp(req)
  if (isDuplicate(ip, message)) {
    return res.status(429).json({ error: 'Bu xabar allaqachon yuborilgan' })
  }
  if (tooMany(ip)) {
    return res.status(429).json({ error: 'Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring' })
  }
  markSent(ip, message)

  const safeName = name.replace(/[\r\n]+/g, ' ').trim()

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>',
        to: ['alijonov.me@gmail.com'],
        reply_to: email.trim(),
        subject: `[alijonov.uz] Yangi xabar: ${safeName}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
            <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #22c55e; padding-bottom: 8px;">Portfolio orqali yangi xabar</h2>
            <div style="margin: 16px 0;">
              <p style="margin: 6px 0; color: #475569;"><strong>Yuboruvchi:</strong> ${escapeHtml(name)}</p>
              <p style="margin: 6px 0; color: #475569;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color: #2563eb;">${escapeHtml(email)}</a></p>
              <p style="margin: 6px 0; color: #475569;"><strong>Vaqt:</strong> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}</p>
            </div>
            <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-left: 4px solid #22c55e; border-radius: 4px;">
              <p style="margin: 0; color: #1e293b; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${escapeHtml(message)}</p>
            </div>
            <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">Bu xabar alijonov.uz saytidagi terminal orqali yuborildi.</p>
          </div>
        `,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Resend orqali yuborishda xatolik yuz berdi' })
    }

    return res.status(200).json({ success: true, id: data.id })
  } catch (err) {
    return res.status(500).json({ error: 'Server xatoligi. Keyinroq qayta urinib ko‘ring' })
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}