import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: '/',
    plugins: [
      react(),
      {
        name: 'api-dev-server',
        configureServer(server) {
          server.middlewares.use('/api/send', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Faqat POST so‘rovi qabul qilinadi' }))
              return
            }
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body || '{}')
                const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY
                if (!apiKey) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'RESEND_API_KEY topilmadi (.env.local da tekshiring)' }))
                  return
                }

                const { name, email, message } = parsed
                if (!name || !name.trim()) {
                  res.statusCode = 400
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'Ismingizni kiriting' }))
                  return
                }
                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  res.statusCode = 400
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'To‘g‘ri email manzilini kiriting' }))
                  return
                }
                if (!message || !message.trim()) {
                  res.statusCode = 400
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'Xabar matnini kiriting' }))
                  return
                }

                const apiRes = await fetch('https://api.resend.com/emails', {
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
                          <p style="margin: 6px 0; color: #475569;"><strong>Yuboruvchi:</strong> ${name}</p>
                          <p style="margin: 6px 0; color: #475569;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
                          <p style="margin: 6px 0; color: #475569;"><strong>Vaqt:</strong> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}</p>
                        </div>
                        <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-left: 4px solid #22c55e; border-radius: 4px;">
                          <p style="margin: 0; color: #1e293b; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${message}</p>
                        </div>
                        <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">Bu xabar alijonov.uz saytidagi terminal orqali yuborildi.</p>
                      </div>
                    `,
                  }),
                })

                const data = await apiRes.json()
                res.statusCode = apiRes.status
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data.id ? { success: true, id: data.id } : data))
              } catch (e) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: e.message }))
              }
            })
          })
        }
      }
    ]
  }
})
