import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './components/file-uploader';
import './components/file-compressor';
import './components/file-validator';
import './components/file-checksum';

// מודול ניהול הקבצים
@customElement('file-hub-module')
export class FileHubModule extends LitElement {
  @state() files: File[] = [];
  @state() activeTab = 'compress';
  
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
    
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .file-area {
      background: white;
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .no-files {
      padding: 2rem;
      text-align: center;
      color: #666;
    }
    
    .files-list {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 200px;
      overflow-y: auto;
    }
    
    .file-item {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .file-item:last-child {
      border-bottom: none;
    }
    
    .file-icon {
      color: #666;
    }
    
    .file-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .file-size {
      font-size: 0.875rem;
      color: #666;
      white-space: nowrap;
    }
    
    .remove-file {
      background: transparent;
      border: none;
      color: rgb(var(--color-error-500));
      cursor: pointer;
      padding: 0.25rem;
    }
    
    .tabs {
      display: flex;
      gap: 0.25rem;
      margin-top: 1.5rem;
      border-bottom: 1px solid #eee;
    }
    
    .tab {
      padding: 0.5rem 1rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 0.875rem;
      border-bottom: 2px solid transparent;
    }
    
    .tab.active {
      border-bottom-color: rgb(var(--color-primary-500));
      color: rgb(var(--color-primary-500));
      font-weight: 500;
    }
    
    .tab-content {
      display: none;
      padding: 1rem 0;
    }
    
    .tab-content.active {
      display: block;
    }
  `;
  
  handleFileUpload(e: CustomEvent) {
    this.files = [...this.files, ...e.detail.files];
  }
  
  removeFile(index: number) {
    this.files = this.files.filter((_, i) => i !== index);
  }
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
  
  getFileIcon(file: File): string {
    if (file.type.startsWith('image/')) {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
    } else if (file.type.startsWith('audio/')) {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
    } else if (file.type.startsWith('video/')) {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>';
    } else if (file.type === 'application/pdf') {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
    } else if (file.name.endsWith('.zip') || file.type === 'application/zip') {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"></path><path d="M1 3h22v5H1z"></path><path d="M10 12h4"></path></svg>';
    }
    
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h2>File Hub</h2>
        </div>
        
        <div class="content">
          <div class="file-area">
            ${this.files.length === 0 ? html`
              <file-uploader
                @file-upload=${this.handleFileUpload}
              ></file-uploader>
            ` : html`
              <ul class="files-list">
                ${this.files.map((file, index) => html`
                  <li class="file-item">
                    <div class="file-icon">
                      <div .innerHTML=${this.getFileIcon(file)}></div>
                    </div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                    <button class="remove-file" @click=${() => this.removeFile(index)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </li>
                `)}
              </ul>
              
              <div style="text-align: center; margin-top: 1rem;">
                <button 
                  class="btn btn-secondary"
                  @click=${() => {
                    const fileUploader = document.createElement('file-uploader');
                    fileUploader.addEventListener('file-upload', ((e: CustomEvent) => {
                      this.handleFileUpload(e);
                      document.body.removeChild(fileUploader);
                    }) as EventListener);
                    document.body.appendChild(fileUploader);
                    const input = fileUploader.shadowRoot?.querySelector('input');
                    input?.click();
                  }}
                >
                  Add More Files
                </button>
              </div>
              
              <div class="tabs">
                <button 
                  class="tab ${this.activeTab === 'compress' ? 'active' : ''}"
                  @click=${() => this.setActiveTab('compress')}
                >
                  Compress
                </button>
                <button 
                  class="tab ${this.activeTab === 'validate' ? 'active' : ''}"
                  @click=${() => this.setActiveTab('validate')}
                >
                  Validate
                </button>
                <button 
                  class="tab ${this.activeTab === 'checksum' ? 'active' : ''}"
                  @click=${() => this.setActiveTab('checksum')}
                >
                  Checksum
                </button>
              </div>
              
              <div class="tab-content ${this.activeTab === 'compress' ? 'active' : ''}">
                <file-compressor .files=${this.files}></file-compressor>
              </div>
              
              <div class="tab-content ${this.activeTab === 'validate' ? 'active' : ''}">
                <file-validator .files=${this.files}></file-validator>
              </div>
              
              <div class="tab-content ${this.activeTab === 'checksum' ? 'active' : ''}">
                <file-checksum .files=${this.files}></file-checksum>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }
}