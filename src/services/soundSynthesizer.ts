// Procedural Sound Synthesizer using Web Audio API for Calming Focus & Sanctuary Sounds

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private currentTrack: string | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private chimeTimer: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    if (this.chimeTimer) {
      clearInterval(this.chimeTimer);
      this.chimeTimer = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // ignore
      }
    });
    this.activeNodes = [];
    this.currentTrack = null;
  }

  public play(track: 'rain' | 'wind' | 'chimes' | 'stream' | 'bowl') {
    this.initContext();
    this.stop();
    if (!this.ctx || !this.masterGain) return;

    this.currentTrack = track;

    if (track === 'rain') {
      this.playRain();
    } else if (track === 'wind') {
      this.playWind();
    } else if (track === 'chimes') {
      this.playWindChimes();
    } else if (track === 'stream') {
      this.playStream();
    } else if (track === 'bowl') {
      this.playSingingBowl();
    }
  }

  public getCurrentTrack(): string | null {
    return this.currentTrack;
  }

  // Generates pink-ish noise for soothing rain
  private playRain() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.masterGain);
    noiseSource.start();

    this.activeNodes.push(noiseSource, filter);
  }

  // Generates gentle breeze
  private playWind() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    // LFO to slowly modulate wind frequency
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, filter, lfo, lfoGain);
  }

  // Pentatonic Zen Wind Chimes
  private playWindChimes() {
    if (!this.ctx || !this.masterGain) return;

    const notes = [587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66]; // D5, E5, G5, A5, C6, D6

    const triggerChime = () => {
      if (!this.ctx || !this.masterGain || this.currentTrack !== 'chimes') return;
      const freq = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 3.0);
    };

    triggerChime();
    this.chimeTimer = setInterval(() => {
      if (Math.random() > 0.3) {
        triggerChime();
        if (Math.random() > 0.6) {
          setTimeout(triggerChime, 300);
        }
      }
    }, 1400);
  }

  // Flowing Water Stream
  private playStream() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.12;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(650, this.ctx.currentTime);
    filter1.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(1400, this.ctx.currentTime);

    noise.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, filter1, filter2);
  }

  // Tibetan Singing Bowl resonant tone
  private playSingingBowl() {
    if (!this.ctx || !this.masterGain) return;

    const triggerBowl = () => {
      if (!this.ctx || !this.masterGain || this.currentTrack !== 'bowl') return;
      const baseFreq = 261.63; // C4
      const harmonics = [1, 2.01, 3.02, 4.04];
      const gains = [0.15, 0.08, 0.04, 0.02];

      harmonics.forEach((h, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * h, this.ctx.currentTime);

        g.gain.setValueAtTime(0, this.ctx.currentTime);
        g.gain.linearRampToValueAtTime(gains[idx], this.ctx.currentTime + 0.1);
        g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 5.5);

        osc.connect(g);
        g.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 6.0);
      });
    };

    triggerBowl();
    this.chimeTimer = setInterval(triggerBowl, 6500);
  }

  // Gentle chime sound for completing a focus session or water drop
  public playWaterSplash() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  public playSuccessFanfare() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const chords = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    chords.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = this.ctx!.currentTime + idx * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime);
      osc.stop(startTime + 1.3);
    });
  }
}

export const soundSynth = new SoundSynthesizer();
