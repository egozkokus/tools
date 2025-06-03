import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// פקדים לעריכת האודיו (נפח, מהירות, טרימינג)
@customElement('audio-controls')
export class AudioControls extends LitElement {
  @property({ type: Object }) audioBuffer: AudioBuffer | null = null;
  @state() volume = 100;
  @state() speed = 100;
  @state() trimStart = 0;
  @state() trimEnd = 100;
  
  static styles = css`
    :host {
      display: block;
    }
    
    .controls-container {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .control-group {
      margin-bottom: 1.5rem;
    }
    
    .control-group:last-child {
      margin-bottom: 0;
    }
    
    h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #333;
    }
    
    .slider-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .slider {
      flex: 1;
    }
    
    .value-display {
      min-width: 3.5rem;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    
    input[type="range"] {
      -webkit-appearance: none;
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #eee;
      outline: none;
    }
    
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: rgb(var(--color-primary-500));
      cursor: pointer;
      border: none;
    }
    
    input[type="range"]::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: rgb(var(--color-primary-500));
      cursor: pointer;
      border: none;
    }
    
    .trim-container {
      display: flex;
      gap: 1rem;
    }
    
    .trim-input {
      flex: 1;
    }
    
    .trim-input label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #666;
    }
    
    .btn-apply {
      margin-top: 1rem;
      width: 100%;
    }
  `;
  
  handleVolumeChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.volume = parseInt(input.value, 10);
    this.dispatchEvent(new CustomEvent('volume-change', {
      detail: { volume: this.volume / 100 },
      bubbles: true,
      composed: true
    }));
  }
  
  handleSpeedChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.speed = parseInt(input.value, 10);
    this.dispatchEvent(new CustomEvent('speed-change', {
      detail: { speed: this.speed / 100 },
      bubbles: true,
      composed: true
    }));
  }
  
  handleTrimStartChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.trimStart = parseInt(input.value, 10);
    if (this.trimStart >= this.trimEnd) {
      this.trimStart = this.trimEnd - 1;
    }
  }
  
  handleTrimEndChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.trimEnd = parseInt(input.value, 10);
    if (this.trimEnd <= this.trimStart) {
      this.trimEnd = this.trimStart + 1;
    }
  }
  
  applyChanges() {
    if (!this.audioBuffer) return;
    
    this.dispatchEvent(new CustomEvent('apply-changes', {
      detail: {
        volume: this.volume / 100,
        speed: this.speed / 100,
        trimStart: this.trimStart / 100 * this.audioBuffer.duration,
        trimEnd: this.trimEnd / 100 * this.audioBuffer.duration
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="controls-container">
        <div class="control-group">
          <h3>Volume</h3>
          <div class="slider-container">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              ${this.volume > 0 ? html`
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                ${this.volume > 60 ? html`<path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>` : ''}
              ` : ''}
            </svg>
            
            <div class="slider">
              <input 
                type="range" 
                min="0" 
                max="200" 
                .value=${this.volume} 
                @input=${this.handleVolumeChange}
              />
            </div>
            
            <div class="value-display">${this.volume}%</div>
          </div>
        </div>
        
        <div class="control-group">
          <h3>Playback Speed</h3>
          <div class="slider-container">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 19 22 12 13 5 13 19"></polygon>
              <polygon points="2 19 11 12 2 5 2 19"></polygon>
            </svg>
            
            <div class="slider">
              <input 
                type="range" 
                min="50" 
                max="200" 
                .value=${this.speed} 
                @input=${this.handleSpeedChange}
              />
            </div>
            
            <div class="value-display">${this.speed}%</div>
          </div>
        </div>
        
        <div class="control-group">
          <h3>Trim Audio</h3>
          <div class="trim-container">
            <div class="trim-input">
              <label>Start</label>
              <input 
                type="range" 
                min="0" 
                max="99" 
                .value=${this.trimStart} 
                @input=${this.handleTrimStartChange}
              />
            </div>
            
            <div class="trim-input">
              <label>End</label>
              <input 
                type="range" 
                min="1" 
                max="100" 
                .value=${this.trimEnd} 
                @input=${this.handleTrimEndChange}
              />
            </div>
          </div>
          
          <button class="btn btn-primary btn-apply" @click=${this.applyChanges}>
            Apply Changes
          </button>
        </div>
      </div>
    `;
  }
}