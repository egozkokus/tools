import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// מחשב צ׳קסאם לקבצים
@customElement('file-checksum')
export class FileChecksum extends LitElement {
  @property({ type: Array }) files: File[] = [];
  @state() checksums: { file: File, algorithm: string, hash: string }[] = [];
  @state() selectedFile: File | null = null;
  @state() selectedAlgorithm = 'SHA-256';
  @state() isCalculating = false;
  
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
    
    select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.5rem center;
      background-size: 1rem;
    }
    
    .hash-button {
      width: 100%;
    }
    
    .checksums-list {
      margin-top: 1rem;
      max-height: 250px;
      overflow-y: auto;
    }
    
    .checksum-item {
      padding: 0.75rem;
      background: #f9f9f9;
      border-radius: 0.25rem;
      margin-bottom: 0.5rem;
    }
    
    .file-name {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    
    .algorithm {
      font-size: 0.75rem;
      color: #666;
      margin-bottom: 0.25rem;
    }
    
    .hash-value {
      font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
      font-size: 0.8rem;
      background: #f0f0f0;
      padding: 0.5rem;
      border-radius: 0.25rem;
      overflow-wrap: break-word;
      user-select: all;
    }
    
    .copy-button {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      background: transparent;
      border: none;
      color: rgb(var(--color-primary-500));
      cursor: pointer;
      padding: 0;
    }
    
    .loading {
      text-align: center;
      padding: 1rem;
      color: #666;
    }
  `;
  
  async calculateChecksum() {
    if (!this.selectedFile || this.isCalculating) return;
    
    this.isCalculating = true;
    
    try {
      // Read the file
      const buffer = await this.selectedFile.arrayBuffer();
      
      // Calculate the hash
      const hashBuffer = await crypto.subtle.digest(
        this.getAlgorithmIdentifier(this.selectedAlgorithm),
        buffer
      );
      
      // Convert the hash to a hexadecimal string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Add the hash to the list
      this.checksums = [...this.checksums, {
        file: this.selectedFile,
        algorithm: this.selectedAlgorithm,
        hash: hashHex
      }];
    } catch (error) {
      console.error('Error calculating checksum:', error);
      alert('Error calculating checksum');
    } finally {
      this.isCalculating = false;
    }
  }
  
  getAlgorithmIdentifier(algorithm: string): AlgorithmIdentifier {
    switch (algorithm) {
      case 'MD5':
        return 'MD5';
      case 'SHA-1':
        return 'SHA-1';
      case 'SHA-256':
        return 'SHA-256';
      case 'SHA-384':
        return 'SHA-384';
      case 'SHA-512':
        return 'SHA-512';
      default:
        return 'SHA-256';
    }
  }
  
  handleFileChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.selectedFile = this.files[parseInt(select.value, 10)];
  }
  
  handleAlgorithmChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.selectedAlgorithm = select.value;
  }
  
  copyToClipboard(hash: string) {
    navigator.clipboard.writeText(hash)
      .then(() => {
        const copyButton = this.renderRoot.querySelector('.copy-button') as HTMLButtonElement;
        if (copyButton) {
          const originalText = copyButton.textContent;
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy to Clipboard
            `;
          }, 2000);
        }
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  }

  render() {
    return html`
      <div class="form-group">
        <label for="file-select">Select File</label>
        <select id="file-select" @change=${this.handleFileChange}>
          <option value="" disabled selected>Choose a file</option>
          ${this.files.map((file, index) => html`
            <option value=${index}>${file.name}</option>
          `)}
        </select>
      </div>
      
      <div class="form-group">
        <label for="algorithm-select">Hash Algorithm</label>
        <select id="algorithm-select" @change=${this.handleAlgorithmChange}>
          <option value="SHA-256" selected>SHA-256</option>
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-384">SHA-384</option>
          <option value="SHA-512">SHA-512</option>
        </select>
      </div>
      
      <button 
        class="btn btn-primary hash-button"
        @click=${this.calculateChecksum}
        ?disabled=${!this.selectedFile || this.isCalculating}
      >
        Calculate Checksum
      </button>
      
      <div class="checksums-list">
        ${this.isCalculating ? html`
          <div class="loading">Calculating checksum...</div>
        ` : ''}
        
        ${this.checksums.map(item => html`
          <div class="checksum-item">
            <div class="file-name">${item.file.name}</div>
            <div class="algorithm">${item.algorithm}</div>
            <div class="hash-value">${item.hash}</div>
            <button class="copy-button" @click=${() => this.copyToClipboard(item.hash)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy to Clipboard
            </button>
          </div>
        `)}
      </div>
    `;
  }
}