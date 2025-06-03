import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

// מעלה תמונות
@customElement('image-uploader')
export class ImageUploader extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    
    .uploader-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }
    
    .drop-zone {
      width: 100%;
      max-width: 500px;
      padding: 3rem;
      border: 2px dashed #ccc;
      border-radius: 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .drop-zone:hover, .drop-zone.drag-over {
      border-color: rgb(var(--color-primary-400));
      background: rgba(var(--color-primary-50), 0.5);
    }
    
    .icon {
      width: 64px;
      height: 64px;
      margin-bottom: 1rem;
      color: #999;
    }
    
    .drop-zone:hover .icon, .drop-zone.drag-over .icon {
      color: rgb(var(--color-primary-500));
    }
    
    .instructions {
      text-align: center;
    }
    
    .main-text {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    
    .sub-text {
      font-size: 0.875rem;
      color: #666;
    }
    
    input[type="file"] {
      display: none;
    }
  `;
  
  constructor() {
    super();
    this.addEventListener('dragover', this.handleDragOver);
    this.addEventListener('dragleave', this.handleDragLeave);
    this.addEventListener('drop', this.handleDrop);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('dragover', this.handleDragOver);
    this.removeEventListener('dragleave', this.handleDragLeave);
    this.removeEventListener('drop', this.handleDrop);
  }
  
  handleDragOver(e: DragEvent) {
    e.preventDefault();
    const dropZone = this.renderRoot.querySelector('.drop-zone');
    dropZone?.classList.add('drag-over');
  }
  
  handleDragLeave(e: DragEvent) {
    e.preventDefault();
    const dropZone = this.renderRoot.querySelector('.drop-zone');
    dropZone?.classList.remove('drag-over');
  }
  
  handleDrop(e: DragEvent) {
    e.preventDefault();
    const dropZone = this.renderRoot.querySelector('.drop-zone');
    dropZone?.classList.remove('drag-over');
    
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      this.processFile(e.dataTransfer.files[0]);
    }
  }
  
  handleFileInput(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }
  
  processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    const url = URL.createObjectURL(file);
    
    this.dispatchEvent(new CustomEvent('image-upload', {
      detail: { file, url },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="uploader-container">
        <label class="drop-zone">
          <input type="file" accept="image/*" @change=${this.handleFileInput} />
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <div class="instructions">
            <div class="main-text">Drop image here or click to browse</div>
            <div class="sub-text">Supports JPG, PNG, GIF, SVG, WEBP</div>
          </div>
        </label>
      </div>
    `;
  }
}