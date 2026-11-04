/**
 * Studio-Grade Audio Synthesizer & Soundscape Engine for CineNest Studio
 * Synthesizes authentic Bengali folk instruments (Bansuri flute, Ektara drone, Courtyard chimes)
 * using the standard browser Web Audio API with zero external dependencies.
 */

class CinematicAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private activeDroneOsc: OscillatorNode | null = null;
  private isAmbientPlaying: boolean = false;
  private ambientInterval: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.25, this.ctx.currentTime);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays Puku's signature magical golden heart glow chord (celestial glockenspiel bell chime)
   */
  public playPukuHeartChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (warm golden major chord)
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  }

  /**
   * Plays a phrase on the acoustic Bengali Bansuri (bamboo flute)
   */
  public playBansuriFluteMelody() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // Pentatonic folk raga notes: Sa, Re, Ga, Pa, Dha (D4, E4, F#4, A4, B4, D5)
    const melody = [
      { f: 587.33, d: 0.35 }, // D5
      { f: 659.25, d: 0.30 }, // E5
      { f: 739.99, d: 0.40 }, // F#5
      { f: 880.00, d: 0.50 }, // A5
      { f: 739.99, d: 0.35 }, // F#5
      { f: 587.33, d: 0.60 }, // D5
    ];

    let t = this.ctx.currentTime;
    melody.forEach((note) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, t);

      // Flute vibrato (5Hz flutter)
      vibrato.frequency.setValueAtTime(5.5, t);
      vibratoGain.gain.setValueAtTime(4.0, t);
      vibrato.connect(osc.frequency);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.06);
      gain.gain.setValueAtTime(0.14, t + note.d - 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.masterGain);

      vibrato.start(t);
      osc.start(t);

      vibrato.stop(t + note.d);
      osc.stop(t + note.d);

      t += note.d * 0.95;
    });
  }

  /**
   * Plays an acoustic string strum (Dotara / Ektara)
   */
  public playEktaraStrum() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const chords = [293.66, 440.0, 587.33]; // D3, A3, D4
    const now = this.ctx.currentTime;

    chords.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.03);

      gain.gain.setValueAtTime(0, now + idx * 0.03);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.03 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.9);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.03);
      osc.stop(now + idx * 0.03 + 1.0);
    });
  }

  /**
   * Toggles courtyard background ambient soundscape (gentle breeze & morning finches)
   */
  public toggleCourtyardAmbience(enable: boolean) {
    if (!enable) {
      this.isAmbientPlaying = false;
      if (this.ambientInterval) clearInterval(this.ambientInterval);
      if (this.activeDroneOsc) {
        try {
          this.activeDroneOsc.stop();
        } catch {}
        this.activeDroneOsc = null;
      }
      return;
    }

    if (this.isAmbientPlaying) return;
    this.isAmbientPlaying = true;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // Gentle deep courtyard drone
    try {
      const drone = this.ctx.createOscillator();
      const droneGain = this.ctx.createGain();
      drone.type = 'sine';
      drone.frequency.setValueAtTime(146.83, this.ctx.currentTime); // D3 fundamental
      droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      drone.connect(droneGain);
      droneGain.connect(this.masterGain);
      drone.start();
      this.activeDroneOsc = drone;
    } catch {}

    // Random gentle bird chimes every few seconds
    this.ambientInterval = setInterval(() => {
      if (!this.isAmbientPlaying || this.isMuted) return;
      if (Math.random() > 0.4) {
        this.playGentleBirdChirp();
      }
    }, 4500);
  }

  private playGentleBirdChirp() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, now);
    osc.frequency.exponentialRampToValueAtTime(2349, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1975, now + 0.2);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.26);
  }
}

export const cinematicAudio = new CinematicAudioEngine();
