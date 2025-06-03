import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

// מעלה קבצים
@customElement('file-uploader')
export class FileUploader extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    
    .drop-zone {
      padding: 2rem;
      border: 2px dashed #ccc;
      border-radius: 0.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .drop-zone:hover, .drop-zone.drag-over {
      border-color: rgb(var(--color-primary-400));
      background: rgba(var(--color-primary-50), 0.5);
    }
    
    .drop-zone svg {
      width: 48px;
      height: 48px;
      color: #999;
      margin-bottom: 1rem;
    }
    
    .drop-zone:hover svg, .drop-zone.drag-over svg {
      color: rgb(var(--color-primary-500));
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
      this.processFiles(e.dataTransfer.files);
    }
  }
  
  handleFileInput(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFiles(input.files);
    }
  }
  
  processFiles(fileList: FileList) {
    const files = Array.from(fileList);
    
    this.dispatchEvent(new CustomEvent('file-upload', {
      detail: { files },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <label class="drop-zone">
        <input type="file" multiple @change=${this.handleFileInput} />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 14V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6"></path>
          <path d="M3 16l9 6 9-6"></path>
        </svg>
        <div class="main-text">Drop files here or click to browse</div>
        <div class="sub-text">Upload any file type</div>
      </label>
    `;
  }
}