import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// מציג ויזואליזציה של הגל הקולי של קובץ האודיו
@customElement('audio-waveform')
export class AudioWaveform extends LitElement {
  @property({ type: Object }) audioBuffer: AudioBuffer | null = null;
  
  static styles = css`
    :host {
      display: block;
    }
    
    .waveform-container {
      background: white;
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      height: 150px;
      position: relative;
    }
    
    canvas {
      width: 100%;
      height: 100%;
    }
  `;
  
  firstUpdated() {
    this.drawWaveform();
  }
  
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('audioBuffer')) {
      this.drawWaveform();
    }
  }
  
  drawWaveform() {
    if (!this.audioBuffer) return;
    
    const canvas = this.renderRoot.querySelector('canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions for proper resolution
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    
    // Set scale for high DPI displays
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    
    // Get the audio data
    const channelData = this.audioBuffer.getChannelData(0);
    const step = Math.ceil(channelData.length / width);
    
    // Set drawing style
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--color-primary-400')})`;
    
    // Start drawing path
    ctx.beginPath();
    
    // Start in the middle
    ctx.moveTo(0, height / 2);
    
    // Draw the waveform
    for (let i = 0; i < width; i++) {
      const startSample = i * step;
      const endSample = (i + 1) * step > channelData.length ? channelData.length : (i + 1) * step;
      
      let min = 1.0;
      let max = -1.0;
      
      for (let j = startSample; j < endSample; j++) {
        const sample = channelData[j];
        if (sample < min) min = sample;
        if (sample > max) max = sample;
      }
      
      // Draw line from min to max
      const y1 = ((min + 1) / 2) * height;
      const y2 = ((max + 1) / 2) * height;
      
      ctx.lineTo(i, y1);
      ctx.lineTo(i, y2);
    }
    
    ctx.stroke();
  }

  render() {
    return html`
      <div class="waveform-container">
        <canvas></canvas>
      </div>
    `;
  }
}