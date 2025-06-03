import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './components/image-uploader';
import './components/image-preview';
import './components/image-tools';
import './components/image-export';

// מודול עריכת התמונות
@customElement('image-lab-module')
export class ImageLabModule extends LitElement {
  @state() imageFile: File | null = null;
  @state() imageUrl: string | null = null;
  @state() processedImageUrl: string | null = null;
  @state() isProcessing = false;
  
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
      overflow: hidden;
    }
    
    .workspace {
      display: flex;
      gap: 1rem;
      height: 100%;
      overflow: hidden;
    }
    
    .preview-area {
      flex: 3;
      min-width: 0;
    }
    
    .tools-area {
      flex: 2;
      min-width: 250px;
    }
    
    @media (max-width: 768px) {
      .workspace {
        flex-direction: column;
      }
      
      .preview-area, .tools-area {
        width: 100%;
      }
    }
    
    .processing-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      color: white;
    }
    
    .progress-bar {
      width: 80%;
      max-width: 400px;
      height: 8px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      overflow: hidden;
      margin-top: 1rem;
    }
    
    .progress-fill {
      height: 100%;
      background: rgb(var(--color-primary-500));
      width: 100%;
      animation: progress 1.5s ease-in-out infinite;
    }
    
    @keyframes progress {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `;
  
  handleImageUpload(e: CustomEvent) {
    this.imageFile = e.detail.file;
    this.imageUrl = e.detail.url;
    this.processedImageUrl = null;
  }
  
  handleImageProcessed(e: CustomEvent) {
    this.processedImageUrl = e.detail.url;
  }
  
  handleProcessingStart() {
    this.isProcessing = true;
  }
  
  handleProcessingEnd() {
    this.isProcessing = false;
  }
  
  resetImage() {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
    if (this.processedImageUrl) {
      URL.revokeObjectURL(this.processedImageUrl);
    }
    
    this.imageFile = null;
    this.imageUrl = null;
    this.processedImageUrl = null;
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h2>Image Lab</h2>
          ${this.imageFile ? html`
            <button 
              class="btn btn-secondary"
              @click=${this.resetImage}
            >
              New Image
            </button>
          ` : ''}
        </div>
        
        <div class="content">
          ${this.imageFile ? html`
            <div class="workspace">
              <div class="preview-area">
                <image-preview 
                  .imageUrl=${this.processedImageUrl || this.imageUrl}
                ></image-preview>
              </div>
              <div class="tools-area">
                <image-tools 
                  .imageUrl=${this.imageUrl}
                  @processing-start=${this.handleProcessingStart}
                  @processing-end=${this.handleProcessingEnd}
                  @image-processed=${this.handleImageProcessed}
                ></image-tools>
                
                <image-export 
                  .imageUrl=${this.processedImageUrl || this.imageUrl}
                  .fileName=${this.imageFile.name}
                ></image-export>
              </div>
            </div>
          ` : html`
            <image-uploader 
              @image-upload=${this.handleImageUpload}
            ></image-uploader>
          `}
        </div>
      </div>
      
      ${this.isProcessing ? html`
        <div class="processing-overlay">
          <p>Processing image...</p>
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>
      ` : ''}
    `;
  }
}