// Sound Service for Mindfulness Tools
// Using Web Audio API for ambient sounds

class SoundService {
  private audioContext: AudioContext | null = null
  private currentSource: AudioBufferSourceNode | null = null
  private currentSound: string = 'none'
  private gainNode: GainNode | null = null

  // Initialize Audio Context (must be triggered by user interaction)
  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
      this.gainNode.connect(this.audioContext.destination)
      this.gainNode.gain.value = 0.3 // 30% volume
    }
    return this.audioContext
  }

  // Generate ambient sound using Web Audio API
  private async generateRainSound() {
    const context = this.initAudioContext()
    if (!context) return null

    const duration = 30 // seconds
    const sampleRate = context.sampleRate
    const samples = duration * sampleRate
    const buffer = context.createBuffer(1, samples, sampleRate)
    const data = buffer.getChannelData(0)

    // Generate rain-like noise
    for (let i = 0; i < samples; i++) {
      // Random noise with occasional spikes for raindrops
      let noise = (Math.random() - 0.5) * 0.3
      // Add occasional raindrop effect
      if (Math.random() < 0.05) {
        noise += (Math.random() - 0.5) * 0.5
      }
      data[i] = noise
    }

    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(this.gainNode!)
    return source
  }

  private async generateWaveSound() {
    const context = this.initAudioContext()
    if (!context) return null

    const duration = 30
    const sampleRate = context.sampleRate
    const samples = duration * sampleRate
    const buffer = context.createBuffer(1, samples, sampleRate)
    const data = buffer.getChannelData(0)

    // Generate wave-like sound (oscillating noise)
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate
      // Low frequency oscillation for wave effect
      const wave = Math.sin(t * 0.5) * 0.3
      const noise = (Math.random() - 0.5) * 0.2
      data[i] = wave + noise
    }

    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(this.gainNode!)
    return source
  }

  private async generateForestSound() {
    const context = this.initAudioContext()
    if (!context) return null

    const duration = 30
    const sampleRate = context.sampleRate
    const samples = duration * sampleRate
    const buffer = context.createBuffer(1, samples, sampleRate)
    const data = buffer.getChannelData(0)

    // Generate forest-like ambient sound (soft noise with bird-like chirps)
    for (let i = 0; i < samples; i++) {
      let noise = (Math.random() - 0.5) * 0.2
      // Add occasional bird-like sounds
      if (Math.random() < 0.02) {
        const chirp = Math.sin(i * 0.02) * 0.4
        noise += chirp
      }
      data[i] = noise
    }

    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(this.gainNode!)
    return source
  }

  async playSound(type: string) {
    // Resume AudioContext if suspended (browsers require user interaction)
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume()
    }

    // Stop current sound if playing
    if (this.currentSource) {
      this.currentSource.stop()
      this.currentSource = null
    }

    if (type === 'none') {
      this.currentSound = 'none'
      return
    }

    let source: AudioBufferSourceNode | null = null

    switch (type) {
      case 'rain':
        source = await this.generateRainSound()
        break
      case 'waves':
        source = await this.generateWaveSound()
        break
      case 'forest':
        source = await this.generateForestSound()
        break
    }

    if (source) {
      source.start()
      this.currentSource = source
      this.currentSound = type
    }
  }

  stopSound() {
    if (this.currentSource) {
      this.currentSource.stop()
      this.currentSource = null
    }
    this.currentSound = 'none'
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  async resume() {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume()
    }
  }
}

export const soundService = new SoundService()
