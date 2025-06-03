import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import JSZip from 'jszip';

// דחיסת קבצים לפורמט ZIP
@customElement('file-compressor')
export class FileCompressor extends LitElement {
  @property({ type: Array }) files: File[] = [];
  @state() isCompressing = false;
  @state() compressionProgress = 0;
  @state() zipFileName = 'archive.zip';
  
  static styles = css`
    :host {
      display: block;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }
    
    input[type="text"] {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }
    
    .compression-options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .compression-level {
      flex: 1;
      min-width: 100px;
      padding: 0.75rem;
      text-align: center;
      border: 1px solid #eee;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .compression-level:hover {
      background: #f9f9f9;
    }
    
    .compression-level.active {
      background: rgb(var(--color-primary-50));
      border-color: rgb(var(--color-primary-200));
    }
    
    .compress-button {
      width: 100%;
    }
    
    .progress-container {
      margin-top: 1rem;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #eee;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 0.5rem;
    }
    
    .progress-fill {
      height: 100%;
      background: rgb(var(--color-primary-500));
      transition: width 0.3s;
    }
  `;
  
  async compressFiles() {
    if (this.files.length === 0 || this.isCompressing) return;
    
    this.isCompressing = true;
    this.compressionProgress = 0;
    
    try {
      const zip = new JSZip();
      
      // Add files to the zip
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        zip.file(file.name, file);
        
        // Update progress
        this.compressionProgress = Math.round((i + 1) / this.files.length * 80);
      }
      
      // Generate the zip file
      const blob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      }, (metadata) => {
        // Update progress during generation
        this.compressionProgress = 80 + Math.round(metadata.percent * 0.2);
      });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.zipFileName.endsWith('.zip') ? this.zipFileName : `${this.zipFileName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      this.compressionProgress = 100;
      setTimeout(() => {
        this.isCompressing = false;
        this.compressionProgress = 0;
      }, 1000);
    } catch (error) {
      console.error('Error compressing files:', error);
      this.isCompressing = false;
      this.compressionProgress = 0;
      alert('Error compressing files');
    }
  }
  
  handleFileNameChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.zipFileName = input.value;
  }

  render() {
    return html`
      <div class="form-group">
        <label for="zip-name">Archive Name</label>
        <input 
          type="text" 
          id="zip-name"
          .value=${this.zipFileName}
          @input=${this.handleFileNameChange}
          placeholder="Enter archive name"
        />
      </div>
      
      <button 
        class="btn btn-primary compress-button"
        @click=${this.compressFiles}
        ?disabled=${this.isCompressing || this.files.length === 0}
      >
        ${this.isCompressing ? 'Compressing...' : 'Compress Files to ZIP'}
      </button>
      
      ${this.isCompressing ? html`
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${this.compressionProgress}%"></div>
          </div>
        </div>
      ` : ''}
    `;
  }
}