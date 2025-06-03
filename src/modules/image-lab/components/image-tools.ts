import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import * as pica from 'pica';

// כלים לעריכת תמונות
@customElement('image-tools')
export class ImageTools extends LitElement {
  @property({ type: String }) imageUrl: string | null = null;
  @state() resizeWidth = 0;
  @state() resizeHeight = 0;
  @state() cropX = 0;
  @state() cropY = 0;
  @state() cropWidth = 0;
  @state() cropHeight = 0;
  @state() activeTab = 'resize';
  
  private originalImage: HTMLImageElement | null = null;
  private picaInstance = pica();
  
  static styles = css`
    :host {
      display: block;
    }
    
    .tools-container {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1rem;
      margin-bottom: 1rem;
    }
    
    .tabs {
      display: flex;
      gap: 0.25rem;
      margin-bottom: 1rem;
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
    }
    
    .tab-content.active {
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
    
    input[type="number"] {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }
    
    .dimension-inputs {
      display: flex;
      gap: 0.5rem;
    }
    
    .dimension-input {
      flex: 1;
    }
    
    .action-buttons {
      display: flex;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }
    
    .btn-apply {
      flex: 1;
    }
    
    .maintain-aspect {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      font-size: 0.875rem;
    }
    
    .format-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }
    
    .format-option {
      padding: 0.75rem;
      border: 1px solid #eee;
      border-radius: 0.25rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .format-option:hover {
      border-color: #ccc;
      background: #f9f9f9;
    }
    
    .format-name {
      font-weight: 500;
      font-size: 0.875rem;
    }
    
    .format-info {
      font-size: 0.75rem;
      color: #666;
      margin-top: 0.25rem;
    }
  `;
  
  updated(changedProps: Map<string, any>) {
    if (changedProps.has('imageUrl') && this.imageUrl) {
      // Load image to get dimensions
      const img = new Image();
      img.onload = () => {
        this.originalImage = img;
        this.resizeWidth = img.width;
        this.resizeHeight = img.height;
        this.cropWidth = img.width;
        this.cropHeight = img.height;
      };
      img.src = this.imageUrl;
    }
  }
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  
  async applyResize() {
    if (!this.originalImage || !this.imageUrl) return;
    
    this.dispatchEvent(new CustomEvent('processing-start', {
      bubbles: true,
      composed: true
    }));
    
    try {
      // Create source canvas
      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = this.originalImage.width;
      sourceCanvas.height = this.originalImage.height;
      const sourceCtx = sourceCanvas.getContext('2d');
      sourceCtx?.drawImage(this.originalImage, 0, 0);
      
      // Create destination canvas
      const destCanvas = document.createElement('canvas');
      destCanvas.width = this.resizeWidth;
      destCanvas.height = this.resizeHeight;
      
      // Resize using pica (high quality resize)
      await this.picaInstance.resize(sourceCanvas, destCanvas);
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        destCanvas.toBlob(blob => {
          if (blob) resolve(blob);
          else resolve(new Blob([]));
        }, 'image/png');
      });
      
      // Create URL for the blob
      const url = URL.createObjectURL(blob);
      
      this.dispatchEvent(new CustomEvent('image-processed', {
        detail: { url },
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      console.error('Error resizing image:', error);
      alert('Error resizing image');
    } finally {
      this.dispatchEvent(new CustomEvent('processing-end', {
        bubbles: true,
        composed: true
      }));
    }
  }
  
  async applyCrop() {
    if (!this.originalImage || !this.imageUrl) return;
    
    this.dispatchEvent(new CustomEvent('processing-start', {
      bubbles: true,
      composed: true
    }));
    
    try {
      // Create a canvas to draw the cropped image
      const canvas = document.createElement('canvas');
      canvas.width = this.cropWidth;
      canvas.height = this.cropHeight;
      const ctx = canvas.getContext('2d');
      
      // Draw the cropped portion
      ctx?.drawImage(
        this.originalImage, 
        this.cropX, this.cropY, this.cropWidth, this.cropHeight,
        0, 0, this.cropWidth, this.cropHeight
      );
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else resolve(new Blob([]));
        }, 'image/png');
      });
      
      // Create URL for the blob
      const url = URL.createObjectURL(blob);
      
      this.dispatchEvent(new CustomEvent('image-processed', {
        detail: { url },
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Error cropping image');
    } finally {
      this.dispatchEvent(new CustomEvent('processing-end', {
        bubbles: true,
        composed: true
      }));
    }
  }
  
  async convertFormat(format: string) {
    if (!this.originalImage || !this.imageUrl) return;
    
    this.dispatchEvent(new CustomEvent('processing-start', {
      bubbles: true,
      composed: true
    }));
    
    try {
      // Create a canvas from the original image
      const canvas = document.createElement('canvas');
      canvas.width = this.originalImage.width;
      canvas.height = this.originalImage.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(this.originalImage, 0, 0);
      
      // Determine MIME type
      let mimeType: string;
      let quality = 0.92;
      
      switch (format) {
        case 'png':
          mimeType = 'image/png';
          break;
        case 'jpg':
          mimeType = 'image/jpeg';
          quality = 0.9;
          break;
        case 'webp':
          mimeType = 'image/webp';
          quality = 0.9;
          break;
        default:
          mimeType = 'image/png';
      }
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          blob => {
            if (blob) resolve(blob);
            else resolve(new Blob([]));
          },
          mimeType,
          quality
        );
      });
      
      // Create URL for the blob
      const url = URL.createObjectURL(blob);
      
      this.dispatchEvent(new CustomEvent('image-processed', {
        detail: { url },
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      console.error('Error converting image format:', error);
      alert('Error converting image format');
    } finally {
      this.dispatchEvent(new CustomEvent('processing-end', {
        bubbles: true,
        composed: true
      }));
    }
  }
  
  updateAspectRatio(e: Event) {
    const input = e.target as HTMLInputElement;
    const aspectRatio = this.originalImage ? this.originalImage.width / this.originalImage.height : 1;
    
    if (input.name === 'width') {
      this.resizeWidth = parseInt(input.value, 10) || 0;
      const maintainAspect = this.renderRoot.querySelector('input[name="maintain-aspect"]') as HTMLInputElement;
      
      if (maintainAspect && maintainAspect.checked) {
        this.resizeHeight = Math.round(this.resizeWidth / aspectRatio);
      }
    } else if (input.name === 'height') {
      this.resizeHeight = parseInt(input.value, 10) || 0;
      const maintainAspect = this.renderRoot.querySelector('input[name="maintain-aspect"]') as HTMLInputElement;
      
      if (maintainAspect && maintainAspect.checked) {
        this.resizeWidth = Math.round(this.resizeHeight * aspectRatio);
      }
    }
  }

  render() {
    return html`
      <div class="tools-container">
        <div class="tabs">
          <button 
            class="tab ${this.activeTab === 'resize' ? 'active' : ''}"
            @click=${() => this.setActiveTab('resize')}
          >
            Resize
          </button>
          <button 
            class="tab ${this.activeTab === 'crop' ? 'active' : ''}"
            @click=${() => this.setActiveTab('crop')}
          >
            Crop
          </button>
          <button 
            class="tab ${this.activeTab === 'format' ? 'active' : ''}"
            @click=${() => this.setActiveTab('format')}
          >
            Format
          </button>
        </div>
        
        <div class="tab-content ${this.activeTab === 'resize' ? 'active' : ''}">
          <div class="form-group">
            <label>Dimensions</label>
            <div class="dimension-inputs">
              <div class="dimension-input">
                <input 
                  type="number" 
                  name="width" 
                  placeholder="Width" 
                  .value=${this.resizeWidth}
                  @input=${this.updateAspectRatio}
                />
              </div>
              <div class="dimension-input">
                <input 
                  type="number" 
                  name="height" 
                  placeholder="Height" 
                  .value=${this.resizeHeight}
                  @input=${this.updateAspectRatio}
                />
              </div>
            </div>
            <div class="maintain-aspect">
              <input type="checkbox" name="maintain-aspect" id="maintain-aspect" checked />
              <label for="maintain-aspect">Maintain aspect ratio</label>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="btn btn-primary btn-apply" @click=${this.applyResize}>
              Apply Resize
            </button>
          </div>
        </div>
        
        <div class="tab-content ${this.activeTab === 'crop' ? 'active' : ''}">
          <div class="form-group">
            <label>Crop Position</label>
            <div class="dimension-inputs">
              <div class="dimension-input">
                <input 
                  type="number" 
                  name="crop-x" 
                  placeholder="X" 
                  .value=${this.cropX}
                  @input=${(e: Event) => this.cropX = parseInt((e.target as HTMLInputElement).value, 10) || 0}
                />
              </div>
              <div class="dimension-input">
                <input 
                  type="number" 
                  name="crop-y" 
                  placeholder="Y" 
                  .value=${this.cropY}
                  @input=${(e: Event) => this.cropY = parseInt((e.target as HTMLInputElement).value, 10) || 0}
                />
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Crop Size</label>
            <div class="dimension-inputs">
              <div class="dimension-input">
                <input 
                  type="number" 
                  name="crop-width" 
                  placeholder="Width" 
                  .value=${this.cropWidth}
                  @input=${(e: Event) => this.cropWidth = parseInt((e.target as HTMLInputElement).value, 10) || 0}
                />
              </div>
              <div class="dimension-input">
                <input 
                  type="number" 
                  name="crop-height" 
                  placeholder="Height" 
                  .value=${this.cropHeight}
                  @input=${(e: Event) => this.cropHeight = parseInt((e.target as HTMLInputElement).value, 10) || 0}
                />
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="btn btn-primary btn-apply" @click=${this.applyCrop}>
              Apply Crop
            </button>
          </div>
        </div>
        
        <div class="tab-content ${this.activeTab === 'format' ? 'active' : ''}">
          <div class="form-group">
            <label>Convert To</label>
            <div class="format-options">
              <div class="format-option" @click=${() => this.convertFormat('png')}>
                <div class="format-name">PNG</div>
                <div class="format-info">Lossless transparency</div>
              </div>
              <div class="format-option" @click=${() => this.convertFormat('jpg')}>
                <div class="format-name">JPG</div>
                <div class="format-info">Smaller file size</div>
              </div>
              <div class="format-option" @click=${() => this.convertFormat('webp')}>
                <div class="format-name">WebP</div>
                <div class="format-info">Modern format</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}