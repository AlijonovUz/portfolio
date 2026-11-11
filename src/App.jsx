import { useEffect, useState } from 'react'

/* ====== MA'LUMOTLARNI SHU YERDA O'ZGARTIRING ====== */
const LINKS = [
  ['email', 'me@alijonov.uz', 'mailto:me@alijonov.uz'],
  ['telegram', '@AlijonovUz', 'https://t.me/AlijonovUz'],
  ['github', 'github.com/AlijonovUz', 'https://github.com/AlijonovUz'],
  ['linkedin', 'linkedin.com/in/alijonovuz', 'https://linkedin.com/in/alijonovuz'],
  ['instagram', 'instagram.com/alijonov.uz_', 'https://instagram.com/alijonov.uz_'],
]
const LOCATION = 'Oltiariq, Farg‘ona viloyati, O‘zbekiston'

// Resume bo'limida: asosiy ko'nikmalar
const MAIN = [
  ['languages', ['Python', 'PHP', 'C#']],
  ['databases', ['PostgreSQL', 'MySQL']],
]
// About bo'limida: to'liq texnologiyalar
const ALL = [
  ['languages', ['Python', 'PHP', 'C#']],
  ['frameworks', ['Django', 'DRF', 'FastAPI', 'Laravel', '.NET']],
  ['web', ['HTML', 'CSS', 'Bootstrap', 'TailwindCSS', 'JavaScript']],
  ['databases', ['PostgreSQL', 'MySQL', 'SQLite']],
  ['tools', ['Git', 'GitHub', 'GitLab', 'Redis', 'Celery', 'WebSockets']],
  ['devops', ['Docker', 'Docker Compose']],
]
const JOBS = [
  ['Backend developer', 'Raqamli Nazorat · 2026-yil aprel — hozir', [
    'Masshtablanuvchi monitoring tizimlari va RESTful API larni loyihalash hamda qo‘llab-quvvatlash.',
    'Tizimdagi murakkab nosozliklarni aniqlash (debugging), so‘rovlarni optimallashtirish va barqarorlikni ta’minlash.',
    'Code review jarayonlarini olib borish va jamoa a’zolariga texnik mentorlik qilish.',
  ]],
  ['Backend mentor', 'Najot Ta’lim · 2025-yil noyabr — 2026-yil avgust', [
    'Talabalarga Python dasturlashda amaliy yordam berish.',
    'Uy vazifalarini tekshirish va kodni tahlil qilib, sifatini oshirish.',
    'Mustaqil ishlash va muammo yechish ko‘nikmalarini rivojlantirish.',
  ]],
  ['Freelance developer', 'Frilans · 2021 — 2025', [
    'Buyurtmachilar uchun Telegram botlar yaratish va ishga tushirish.',
    'Loyihalarni mustaqil olib borib, tayyor holda yetkazib berish.',
  ]],
]
const EDU = {
  title: 'Backend Python (Standard)',
  where: 'Najot Ta’lim · 2024 — 2025',
  lines: ['Texnologiyalar: Python, Django, DRF, Docker, Git, PostgreSQL.', 'Amaliy loyihalar orqali backend ko‘nikmalarini mustahkamlagan.'],
}
const LANGS = [['O‘zbek tili', 'ona tili'], ['Ingliz tili', 'A2'], ['Rus tili', 'A2']]
const RESUME_PDF = '/resume.pdf' // public/resume.pdf
/* ================================================== */

const TUX = ['    .--.', '   |o_o |', '   |:_/ |', '  //   \\ \\', ' (|     | )', "/'\\_   _/'\\", '\\___)=(___/'].join('\n')
const CMD = { neofetch: 'neofetch', about: 'cat about.md', resume: 'cat resume.md', contact: 'cat contact.txt' }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const Prompt = () => (
  <>
    <span className="u">root@alijonov</span><span className="d">:</span><span className="h">~</span><span className="d"># </span>
  </>
)
const Groups = ({ data }) => (
  <div>
    {data.map(([k, list]) => (
      <div className="grp" key={k}>
        <span className="h">{k}</span>
        <div>{list.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
      </div>
    ))}
  </div>
)

function outputs(go) {
  return {
    neofetch: [
      <div className="nf">
        <pre>{TUX}</pre>
        <div style={{ whiteSpace: 'normal' }}>
          <div className="row"><span className="u">root</span><span className="d">@</span><span className="u">alijonov.uz</span></div>
          <div className="d">─────────────────</div>
          {[['Role', 'Backend developer'], ['OS', 'Ubuntu'], ['Stack', 'Python · Django · FastAPI'], ['DB', 'PostgreSQL · MySQL'], ['Tools', 'Docker · Git · Celery'], ['From', 'Fergana, Uzbekistan'], ['Uptime', '2021-yildan beri']].map(([a, b]) => (
            <div className="row" key={a}><span className="h" style={{ display: 'inline-block', width: '8ch' }}>{a}</span>: {b}</div>
          ))}
        </div>
      </div>,
      <div className="cta">
        <button onClick={() => go('about')}>./about</button>
        <button onClick={() => go('resume')}>./resume</button>
        <button onClick={() => go('contact')}>./contact</button>
      </div>,
    ],
    about: [
      <div className="k"># Abdulbosit Alijonov</div>,
      <div className="d">## kim ekanim</div>,
      <div>Farg‘onalik backend dasturchiman. Dasturlashni 2021-yilda boshlaganman, shundan beri Telegram botlardan tortib katta tizimlargacha ishlab keldim. Toza kod va oddiy yechimlarni yoqtiraman.</div>,
      <div className="hr" />,
      <div className="d">## nima bilan shug‘ullanaman</div>,
      <div>• Yuqori yuklamaga chidamli backend tizimlari va RESTful API ishlab chiqish<br />• Murakkab xatolarni chuqur tahlil qilish (debugging) va tizim barqarorligini ta’minlash<br />• Docker yordamida loyihalarni konteynerlashtirish va serverga sozlash (deploy)<br />• Agile/Scrum muhitida jamoa bilan hamkorlikda toza arxitektura qurish</div>,
      <div className="hr" />,
      <div className="d">## texnologiyalar</div>,
      <Groups data={ALL} />,
    ],
    resume: [
      <div className="k"># Resume</div>,
      <div className="d">## asosiy ko‘nikmalar</div>,
      <Groups data={MAIN} />,
      <div className="hr" />,
      <div className="d">## tajriba</div>,
      ...JOBS.map(([t, w, items]) => (
        <div className="job"><span className="h">{t}</span><br /><span className="d">{w}</span>{items.map((x) => <div key={x}>• {x}</div>)}</div>
      )),
      <div className="hr" />,
      <div className="d">## ta’lim</div>,
      <div className="job"><span className="h">{EDU.title}</span><br /><span className="d">{EDU.where}</span>{EDU.lines.map((x) => <div key={x}>• {x}</div>)}</div>,
      <div className="hr" />,
      <div className="d">## tillar</div>,
      <div>{LANGS.map(([a, b]) => <div className="row" key={a}>• {a} <span className="d">— {b}</span></div>)}</div>,
      <div className="cta">
        <button onClick={() => window.open(RESUME_PDF, '_blank')}>⬇ resume.pdf</button>
        <button onClick={() => go('contact')}>./contact</button>
      </div>,
    ],
    contact: [
      <div className="k"># Aloqa</div>,
      ...LINKS.map(([k, label, url]) => (
        <div className="grp" key={k}><span className="h">{k}</span><span>→ <a href={url} target="_blank" rel="noreferrer">{label}</a></span></div>
      )),
      <div className="grp"><span className="h">manzil</span><span>→ {LOCATION}</span></div>,
      <div className="d" style={{ marginTop: 10 }}>Loyiha yoki hamkorlik bo‘lsa, yozing — javob beraman.</div>,
    ],
  }
}

export default function App() {
  const [cur, setCur] = useState('neofetch')
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)
  const [clock, setClock] = useState('')

  useEffect(() => {
    let live = true
    setTyped(''); setDone(false)
    ;(async () => {
      const cmd = CMD[cur]
      for (let i = 1; i <= cmd.length; i++) {
        await sleep(45 + Math.random() * 50)
        if (!live) return
        setTyped(cmd.slice(0, i))
      }
      await sleep(250)
      if (live) setDone(true)
    })()
    return () => { live = false }
  }, [cur])

  useEffect(() => {
    if (window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/')
    }
    const tick = () => setClock(new Date().toLocaleString('uz', { weekday: 'short', hour: '2-digit', minute: '2-digit' }))
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  const items = outputs(setCur)[cur]

  return (
    <>
      <div className="blob b1" /><div className="blob b2" />
      <div className="panel">
        <span className="l">⌘ alijonov.uz</span>
        <nav>
          {[['neofetch', '~'], ['about', 'about'], ['resume', 'resume'], ['contact', 'contact']].map(([k, l]) => (
            <button key={k} className={cur === k ? 'on' : ''} onClick={() => setCur(k)}>{l}</button>
          ))}
        </nav>
        <span id="clk">{clock}</span>
      </div>
      <main>
        <div className="win">
          <div className="bar">
            <i style={{ background: '#ff5f57' }} /><i style={{ background: '#febc2e' }} /><i style={{ background: '#28c840' }} />
            <span>root@alijonov: ~</span>
          </div>
          <div className="term" key={cur}>
            <div><Prompt />{typed}{!done && <span className="cur" />}</div>
            {done && (
              <>
                <div className="o">
                  {items.map((el, i) => <div key={i} style={{ animationDelay: i * 0.12 + 's' }}>{el}</div>)}
                </div>
                <div style={{ marginTop: 16, opacity: 0, animation: 'ln .4s forwards', animationDelay: items.length * 0.12 + 0.2 + 's' }}>
                  <Prompt /><span className="cur" />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <div className="st"><span>-- NORMAL -- main</span><span>© {new Date().getFullYear()} alijonov.uz</span></div>
    </>
  )
}
