import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './components/audio-player';
import './components/audio-controls';
import './components/audio-waveform';
import './components/audio-export';

// מודול האודיו סטודיו
@customElement('audio-studio-module')
export class AudioStudioModule extends LitElement {
  @state() audioFile: File | null = null;
  @state() audioBuffer: AudioBuffer | null = null;
  @state() isProcessing = false;
  @state() processingProgress = 0;
  @state() audioContext: AudioContext | null = null;
  
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    
    .container {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .file-input-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      border: 2px dashed #ccc;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .file-input-container:hover {
      border-color: rgb(var(--color-primary-400));
      background: rgba(var(--color-primary-50), 0.5);
    }
    
    .file-input-container p {
      margin-top: 1rem;
      color: #666;
    }
    
    input[type="file"] {
      display: none;
    }
    
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .audio-workspace {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
    }
    
    .processing-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      color: white;
    }
    
    .progress-bar {
      width: 80%;
      max-width: 400px;
      height: 8px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      overflow: hidden;
      margin-top: 1rem;
    }
    
    .progress-fill {
      height: 100%;
      background: rgb(var(--color-primary-500));
      transition: width 0.3s;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.audioContext = new AudioContext();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type.startsWith('audio/')) {
        this.audioFile = file;
        this.loadAudioFile(file);
      } else {
        alert('Please select an audio file');
      }
    }
  }

  async loadAudioFile(file: File) {
    this.isProcessing = true;
    this.processingProgress = 0;
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Simulate progress updates
      const interval = setInterval(() => {
        this.processingProgress += 10;
        if (this.processingProgress >= 90) {
          clearInterval(interval);
        }
      }, 100);
      
      if (this.audioContext) {
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      }
      
      this.processingProgress = 100;
      setTimeout(() => {
        this.isProcessing = false;
        this.processingProgress = 0;
      }, 500);
    } catch (error) {
      console.error('Error loading audio file:', error);
      this.isProcessing = false;
      this.processingProgress = 0;
      alert('Error loading audio file');
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h2>Audio Studio</h2>
          ${this.audioFile ? html`
            <button 
              class="btn btn-secondary"
              @click=${() => {
                this.audioFile = null;
                this.audioBuffer = null;
              }}
            >
              New Audio
            </button>
          ` : ''}
        </div>
        
        <div class="content">
          ${this.audioFile && this.audioBuffer ? html`
            <div class="audio-workspace">
              <audio-player .audioBuffer=${this.audioBuffer}></audio-player>
              <audio-waveform .audioBuffer=${this.audioBuffer}></audio-waveform>
              <audio-controls .audioBuffer=${this.audioBuffer}></audio-controls>
              <audio-export .audioBuffer=${this.audioBuffer} .fileName=${this.audioFile.name}></audio-export>
            </div>
          ` : html`
            <label class="file-input-container">
              <input type="file" accept="audio/*" @change=${this.handleFileSelect} />
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
              <p>Click to upload an audio file or drag & drop</p>
            </label>
          `}
        </div>
      </div>
      
      ${this.isProcessing ? html`
        <div class="processing-overlay">
          <p>Processing audio file...</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${this.processingProgress}%"></div>
          </div>
        </div>
      ` : ''}
    `;
  }
}