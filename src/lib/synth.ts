/**
 * Karplus–Strong: syntéza brnknuté struny bez samplů.
 * Šumový impuls se posílá zpožděnou smyčkou s jemným dolnopropustným filtrem,
 * délka smyčky = perioda tónu. Výsledek zní jako drnknutí na kovovou strunu.
 */
export class StringSynth {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null

  private ensure() {
    if (this.ctx) return this.ctx
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new Ctx()
    const comp = this.ctx.createDynamicsCompressor()
    comp.threshold.value = -18
    comp.ratio.value = 6
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.7
    this.master.connect(comp).connect(this.ctx.destination)
    return this.ctx
  }

  async resume() {
    const ctx = this.ensure()
    if (ctx.state === 'suspended') await ctx.resume()
  }

  pluck(freq: number, delay = 0, velocity = 1) {
    const ctx = this.ensure()
    if (ctx.state === 'suspended') void ctx.resume()
    const sr = ctx.sampleRate
    // průměrovací filtr přidává půl vzorku zpoždění, proto -0.5 (jinak hraje mírně vysoko)
    const n = Math.max(2, Math.round(sr / freq - 0.5))
    const seconds = 2.2
    const buffer = ctx.createBuffer(1, Math.round(sr * seconds), sr)
    const out = buffer.getChannelData(0)
    const ring = new Float32Array(n)
    for (let i = 0; i < n; i++) ring[i] = Math.random() * 2 - 1
    // 0.999: struna doznívá cca 2 s, vyšší tóny přirozeně dřív (tlumí je průměrovací filtr)
    const decay = 0.999
    let idx = 0
    for (let i = 0; i < out.length; i++) {
      const cur = ring[idx]
      const next = ring[(idx + 1) % n]
      out[i] = cur
      ring[idx] = (cur + next) * 0.5 * decay
      idx = (idx + 1) % n
    }
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 3200
    const gain = ctx.createGain()
    gain.gain.value = 0.55 * velocity
    src.connect(lp).connect(gain).connect(this.master!)
    src.start(ctx.currentTime + delay)
    src.stop(ctx.currentTime + delay + seconds)
  }
}

/** Standardní ladění E A D G H E (Hz) */
export const OPEN_STRINGS = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63]

/** Táborákové akordy: pražec na každé struně, null = struna se nehraje */
export const CHORDS: Record<string, (number | null)[]> = {
  Em: [0, 2, 2, 0, 0, 0],
  G: [3, 2, 0, 0, 0, 3],
  C: [null, 3, 2, 0, 1, 0],
  D: [null, null, 0, 2, 3, 2],
  Am: [null, 0, 2, 2, 1, 0],
  E: [0, 2, 2, 1, 0, 0],
}

export const stringFreq = (index: number, fret: number) => OPEN_STRINGS[index] * Math.pow(2, fret / 12)
