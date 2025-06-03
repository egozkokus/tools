import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// תצוגת התמונה
@customElement('image-preview')
export class ImagePreview extends LitElement {
  @property({ type: String }) imageUrl: string | null = null;
  
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    
    .preview-container {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1rem;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .image-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: auto;
      background: #f5f5f5;
      border-radius: 0.25rem;
    }
    
    .image-wrapper {
      position: relative;
      max-width: 100%;
      max-height: 100%;
    }
    
    img {
      max-width: 100%;
      max-height: 100%;
      display: block;
      object-fit: contain;
    }
    
    .image-info {
      margin-top: 1rem;
      font-size: 0.875rem;
      display: flex;
      gap: 1rem;
      color: #666;
    }
  `;
  
  render() {
    return html`
      <div class="preview-container">
        <div class="image-container">
          ${this.imageUrl ? html`
            <div class="image-wrapper">
              <img src=${this.imageUrl} alt="Preview" @load=${this.handleImageLoad} />
            </div>
          ` : html`
            <div>No image to preview</div>
          `}
        </div>
        
        <div class="image-info">
          <div id="dimensions"></div>
          <div id="file-size"></div>
          <div id="file-type"></div>
        </div>
      </div>
    `;
  }
  
  handleImageLoad(e: Event) {
    const img = e.target as HTMLImageElement;
    const dimensions = this.renderRoot.querySelector('#dimensions');
    if (dimensions) {
      dimensions.textContent = `${img.naturalWidth} × ${img.naturalHeight}px`;
    }
    
    // Fetch file info using the URL
    if (this.imageUrl) {
      fetch(this.imageUrl)
        .then(response => {
          const fileSize = this.renderRoot.querySelector('#file-size');
          if (fileSize && response.headers.get('content-length')) {
            const size = parseInt(response.headers.get('content-length') || '0', 10);
            fileSize.textContent = this.formatFileSize(size);
          }
          
          const fileType = this.renderRoot.querySelector('#file-type');
          if (fileType && response.headers.get('content-type')) {
            fileType.textContent = response.headers.get('content-type') || '';
          }
        });
    }
  }
  
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}