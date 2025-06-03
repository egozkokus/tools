import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// בודק תקינות של קבצים
@customElement('file-validator')
export class FileValidator extends LitElement {
  @property({ type: Array }) files: File[] = [];
  @state() validationResults: { file: File, valid: boolean, error?: string }[] = [];
  @state() isValidating = false;
  
  static styles = css`
    :host {
      display: block;
    }
    
    .validate-button {
      width: 100%;
      margin-bottom: 1.5rem;
    }
    
    .validation-results {
      margin-top: 1rem;
    }
    
    .result-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border-radius: 0.25rem;
      margin-bottom: 0.5rem;
    }
    
    .result-valid {
      background: rgba(var(--color-success-500), 0.1);
      border: 1px solid rgba(var(--color-success-500), 0.2);
    }
    
    .result-invalid {
      background: rgba(var(--color-error-500), 0.1);
      border: 1px solid rgba(var(--color-error-500), 0.2);
    }
    
    .status-icon {
      flex-shrink: 0;
    }
    
    .status-valid {
      color: rgb(var(--color-success-500));
    }
    
    .status-invalid {
      color: rgb(var(--color-error-500));
    }
    
    .file-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .error-message {
      font-size: 0.875rem;
      color: rgb(var(--color-error-500));
      margin-top: 0.25rem;
    }
    
    .no-results {
      text-align: center;
      padding: 1rem;
      color: #666;
    }
  `;
  
  async validateFiles() {
    if (this.files.length === 0 || this.isValidating) return;
    
    this.isValidating = true;
    this.validationResults = [];
    
    try {
      for (const file of this.files) {
        await new Promise(resolve => setTimeout(resolve, 200)); // Simulate validation time
        
        let valid = true;
        let error = undefined;
        
        // Perform basic validation
        if (file.size === 0) {
          valid = false;
          error = 'File is empty';
        } else if (file.name.endsWith('.zip')) {
          // For ZIP files, check if it's a valid ZIP
          try {
            const arrayBuffer = await file.arrayBuffer();
            // Check for ZIP file signature
            const signature = new Uint8Array(arrayBuffer.slice(0, 4));
            if (!(signature[0] === 0x50 && signature[1] === 0x4B && 
                (signature[2] === 0x03 || signature[2] === 0x05 || signature[2] === 0x07) &&
                (signature[3] === 0x04 || signature[3] === 0x06 || signature[3] === 0x08))) {
              valid = false;
              error = 'Invalid ZIP file signature';
            }
          } catch (err) {
            valid = false;
            error = 'Error reading file';
          }
        } else if (file.type.startsWith('image/')) {
          // For images, check if the image can be loaded
          try {
            await new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = reject;
              img.src = URL.createObjectURL(file);
            });
          } catch (err) {
            valid = false;
            error = 'Invalid image file';
          }
        }
        
        this.validationResults = [...this.validationResults, { file, valid, error }];
      }
    } catch (error) {
      console.error('Error validating files:', error);
    } finally {
      this.isValidating = false;
    }
  }

  render() {
    return html`
      <button 
        class="btn btn-primary validate-button"
        @click=${this.validateFiles}
        ?disabled=${this.isValidating || this.files.length === 0}
      >
        ${this.isValidating ? 'Validating...' : 'Validate Files'}
      </button>
      
      <div class="validation-results">
        ${this.validationResults.length > 0 ? html`
          ${this.validationResults.map(result => html`
            <div class="result-item ${result.valid ? 'result-valid' : 'result-invalid'}">
              <div class="status-icon ${result.valid ? 'status-valid' : 'status-invalid'}">
                ${result.valid ? html`
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ` : html`
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                `}
              </div>
              <div>
                <div class="file-name">${result.file.name}</div>
                ${!result.valid && result.error ? html`
                  <div class="error-message">${result.error}</div>
                ` : ''}
              </div>
            </div>
          `)}
        ` : html`
          <div class="no-results">
            ${this.isValidating ? 'Validating files...' : 'No validation results yet'}
          </div>
        `}
      </div>
    `;
  }
}