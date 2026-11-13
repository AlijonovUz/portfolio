/* ============================================================
   Retro 8-bit Web Audio chiptune tovush effektlari (Rootik)
   Toza brauzer Web Audio API, qo'shimcha faylsiz va yengil.
   ============================================================ */

const SOUND_PREF_KEY = 'portfolio-robot-sound'

export const getSoundPref = () => {
  try {
    return localStorage.getItem(SOUND_PREF_KEY) !== '0'
  } catch {
    return true
  }
}

export const setSoundPref = (val) => {
  try {
    localStorage.setItem(SOUND_PREF_KEY, val ? '1' : '0')
  } catch { /* ruxsat yo'q */ }
  window.dispatchEvent(new CustomEvent('robot-sound-pref', { detail: val }))
}

let audioCtx = null

function getContext() {
  if (typeof window === 'undefined') return null
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (Ctx) audioCtx = new Ctx()
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
  } catch {
    return null
  }
  return audioCtx
}

function tone(freq, type = 'triangle', duration = 0.08, gain = 0.04, startOffset = 0, slideToFreq = null) {
  if (!getSoundPref()) return
  const ctx = getContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime + startOffset
    const osc = ctx.createOscillator()
    const g = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, now)
    if (slideToFreq !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideToFreq), now + duration)
    }

    g.gain.setValueAtTime(gain, now)
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    osc.connect(g)
    g.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + duration)
  } catch {
    /* audio xatolari e'tiborsiz qoldiriladi */
  }
}

export const sfx = {
  // Gapirganda (R2-D2 uslubidagi 3 ta mikro-elektron ohang)
  chatter() {
    tone(620, 'triangle', 0.035, 0.03, 0)
    tone(880, 'sine', 0.04, 0.035, 0.04)
    tone(740, 'triangle', 0.05, 0.03, 0.085)
  },

  // Sakraganda (8-bit ko'tariluvchi ovoz)
  hop() {
    tone(320, 'triangle', 0.11, 0.045, 0, 780)
  },

  // Uyg'onganda (arpeggio jiringlashi)
  wake() {
    tone(440, 'triangle', 0.05, 0.035, 0)
    tone(554, 'triangle', 0.05, 0.035, 0.06)
    tone(659, 'triangle', 0.06, 0.04, 0.12)
    tone(880, 'sine', 0.12, 0.045, 0.18)
  },

  // Ikkilanish / bosh qashlash (savol ohangi)
  confused() {
    tone(520, 'square', 0.08, 0.025, 0, 360)
    tone(360, 'square', 0.11, 0.025, 0.09, 440)
  },

  // Raqs tushganda (quvnoq 4 notali akkord)
  dance() {
    tone(523, 'triangle', 0.06, 0.04, 0)
    tone(659, 'triangle', 0.06, 0.04, 0.07)
    tone(784, 'triangle', 0.06, 0.04, 0.14)
    tone(1046, 'sine', 0.14, 0.05, 0.21)
  },

  // Oynani taqillatish (perkussiya)
  knock() {
    tone(880, 'triangle', 0.02, 0.05, 0, 300)
    tone(840, 'triangle', 0.02, 0.05, 0.08, 280)
    tone(920, 'triangle', 0.025, 0.06, 0.16, 320)
  },

  // Menyu bosilishi
  click() {
    tone(720, 'sine', 0.02, 0.025)
  }
}
