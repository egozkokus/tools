import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// אפשרויות יצוא של התמונה
@customElement('image-export')
export class ImageExport extends LitElement {
  @property({ type: String }) imageUrl: string | null = null;
  @property({ type: String }) fileName = 'image';
  
  static styles = css`
    :host {
      display: block;
    }
    
    .export-container {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1rem;
    }
    
    h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #333;
    }
    
    .export-button {
      width: 100%;
      margin-top: 0.5rem;
    }
  `;
  
  getFileNameWithoutExtension() {
    return this.fileName.replace(/\.[^/.]+$/, '');
  }
  
  downloadImage() {
    if (!this.imageUrl) return;
    
    const a = document.createElement('a');
    a.href = this.imageUrl;
    a.download = this.getFileNameWithoutExtension() + '.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  render() {
    return html`
      <div class="export-container">
        <h3>Export Image</h3>
        <button 
          class="btn btn-primary export-button"
          @click=${this.downloadImage}
          ?disabled=${!this.imageUrl}
        >
          Download Image
        </button>
      </div>
    `;
  }
}