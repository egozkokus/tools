import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// יצוא הקובץ לפורמטים שונים
@customElement('audio-export')
export class AudioExport extends LitElement {
  @property({ type: Object }) audioBuffer: AudioBuffer | null = null;
  @property({ type: String }) fileName = 'audio-file';
  
  static styles = css`
    :host {
      display: block;
      margin-top: 1rem;
    }
    
    .export-container {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #333;
    }
    
    .export-options {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .export-option {
      flex: 1;
      min-width: 150px;
    }
    
    .export-button {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      background: #f9f9f9;
      border: 1px solid #eee;
      border-radius: 0.5rem;
      transition: all 0.2s;
      cursor: pointer;
    }
    
    .export-button:hover {
      background: #f0f0f0;
      border-color: #ddd;
    }
    
    .export-button svg {
      margin-bottom: 0.5rem;
      color: rgb(var(--color-primary-500));
    }
    
    .format-name {
      font-weight: 500;
    }
    
    .format-info {
      font-size: 0.75rem;
      color: #666;
      margin-top: 0.25rem;
    }
  `;
  
  getFileNameWithoutExtension() {
    return this.fileName.replace(/\.[^/.]+$/, '');
  }
  
  async exportWAV() {
    if (!this.audioBuffer) return;
    
    const offlineCtx = new OfflineAudioContext(
      this.audioBuffer.numberOfChannels,
      this.audioBuffer.length,
      this.audioBuffer.sampleRate
    );
    
    const source = offlineCtx.createBufferSource();
    source.buffer = this.audioBuffer;
    source.connect(offlineCtx.destination);
    source.start();
    
    const renderedBuffer = await offlineCtx.startRendering();
    
    // Convert to WAV
    const wavBlob = this.bufferToWav(renderedBuffer);
    this.downloadFile(wavBlob, `${this.getFileNameWithoutExtension()}.wav`);
  }
  
  async exportMP3() {
    // In a real implementation, we would use a WebAssembly-based MP3 encoder
    alert('MP3 export would require a WebAssembly encoder module. This is a placeholder for the feature.');
  }
  
  bufferToWav(buffer: AudioBuffer): Blob {
    const numOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numOfChannels * 2;
    const sampleRate = buffer.sampleRate;
    
    const wav = new ArrayBuffer(44 + length);
    const view = new DataView(wav);
    
    // Write WAV header
    // "RIFF" chunk descriptor
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    this.writeString(view, 8, 'WAVE');
    
    // "fmt " sub-chunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numOfChannels * 2, true); // Byte rate
    view.setUint16(32, numOfChannels * 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample
    
    // "data" sub-chunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, length, true);
    
    // Write audio data
    const offset = 44;
    let index = 0;
    
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset + index, value, true);
        index += 2;
      }
    }
    
    return new Blob([wav], { type: 'audio/wav' });
  }
  
  writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
  
  downloadFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  render() {
    return html`
      <div class="export-container">
        <h3>Export Audio</h3>
        <div class="export-options">
          <div class="export-option">
            <button class="export-button" @click=${this.exportWAV} ?disabled=${!this.audioBuffer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span class="format-name">WAV</span>
              <span class="format-info">Lossless quality</span>
            </button>
          </div>
          
          <div class="export-option">
            <button class="export-button" @click=${this.exportMP3} ?disabled=${!this.audioBuffer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span class="format-name">MP3</span>
              <span class="format-info">Smaller file size</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}