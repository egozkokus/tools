import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// נגן האודיו הבסיסי
@customElement('audio-player')
export class AudioPlayer extends LitElement {
  @property({ type: Object }) audioBuffer: AudioBuffer | null = null;
  @state() isPlaying = false;
  @state() currentTime = 0;
  @state() duration = 0;
  
  private audioContext: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private startTime = 0;
  private pausedAt = 0;
  
  static styles = css`
    :host {
      display: block;
    }
    
    .player-container {
      background: white;
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    button {
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      color: rgb(var(--color-primary-500));
      transition: all 0.2s;
    }
    
    button:hover {
      background: rgba(var(--color-primary-50), 0.8);
    }
    
    .progress {
      flex: 1;
      margin: 0 0.5rem;
    }
    
    .progress-bar {
      width: 100%;
      height: 6px;
      background: #eee;
      border-radius: 3px;
      position: relative;
      cursor: pointer;
    }
    
    .progress-fill {
      position: absolute;
      height: 100%;
      background: rgb(var(--color-primary-400));
      border-radius: 3px;
      transition: width 0.1s linear;
    }
    
    .time-display {
      font-size: 0.875rem;
      font-variant-numeric: tabular-nums;
      min-width: 4rem;
      text-align: center;
    }
  `;
  
  connectedCallback() {
    super.connectedCallback();
    this.audioContext = new AudioContext();
    this.setupUpdateLoop();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
  
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('audioBuffer') && this.audioBuffer) {
      this.duration = this.audioBuffer.duration;
      this.currentTime = 0;
      this.pausedAt = 0;
      this.isPlaying = false;
      if (this.sourceNode) {
        this.sourceNode.stop();
        this.sourceNode = null;
      }
    }
  }
  
  setupUpdateLoop() {
    const updateTime = () => {
      if (this.isPlaying && this.audioContext) {
        this.currentTime = this.pausedAt + (this.audioContext.currentTime - this.startTime);
        if (this.currentTime >= this.duration) {
          this.currentTime = this.duration;
          this.pauseAudio();
        }
      }
      requestAnimationFrame(updateTime);
    };
    
    requestAnimationFrame(updateTime);
  }
  
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  playAudio() {
    if (!this.audioBuffer || !this.audioContext) return;
    
    // If already playing, stop previous playback
    if (this.sourceNode) {
      this.sourceNode.stop();
    }
    
    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    this.sourceNode.connect(this.audioContext.destination);
    
    this.startTime = this.audioContext.currentTime;
    this.sourceNode.start(0, this.pausedAt);
    this.isPlaying = true;
    
    this.sourceNode.onended = () => {
      if (this.currentTime >= this.duration) {
        this.pauseAudio();
        this.currentTime = 0;
        this.pausedAt = 0;
      }
    };
  }
  
  pauseAudio() {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode = null;
    }
    
    this.pausedAt = this.currentTime;
    this.isPlaying = false;
  }
  
  togglePlayPause() {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }
  
  seek(e: MouseEvent) {
    if (!this.audioBuffer) return;
    
    const progressBar = e.currentTarget as HTMLDivElement;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    
    this.currentTime = percentage * this.duration;
    this.pausedAt = this.currentTime;
    
    if (this.isPlaying) {
      this.pauseAudio();
      this.playAudio();
    }
  }

  render() {
    const progressPercentage = (this.currentTime / (this.duration || 1)) * 100;
    
    return html`
      <div class="player-container">
        <div class="controls">
          <button @click=${this.togglePlayPause}>
            ${this.isPlaying ? 
              html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>` : 
              html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`}
          </button>
          
          <div class="time-display">
            ${this.formatTime(this.currentTime)}
          </div>
          
          <div class="progress">
            <div class="progress-bar" @click=${this.seek}>
              <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
          </div>
          
          <div class="time-display">
            ${this.formatTime(this.duration)}
          </div>
        </div>
      </div>
    `;
  }
}