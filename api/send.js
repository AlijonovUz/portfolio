export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Faqat POST so‘rovi qabul qilinadi' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY topilmadi' })
  }

  const { name, email, message } = req.body || {}

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Ismingizni kiriting' })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'To‘g‘ri email manzilini kiriting' })
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Xabar matnini kiriting' })
  }

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
        subject: `[alijonov.uz] Yangi xabar: ${name.trim()}`,
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
    return res.status(500).json({ error: 'Server xatoligi: ' + err.message })
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
