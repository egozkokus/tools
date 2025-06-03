import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './components/editor-input';
import './components/preview-pane';
import './components/export-options';

// מודול עורך המרקדאון
@customElement('markdown-editor-module')
export class MarkdownEditorModule extends LitElement {
  @state() markdownText = '# Welcome to Markdown Editor\n\nStart typing to see the preview.\n\n## Features\n\n- Real-time preview\n- HTML export\n- PDF export\n\n```js\n// Example code block\nfunction hello() {\n  console.log("Hello, world!");\n}\n```';
  @state() viewMode = 'split'; // 'edit', 'preview', or 'split'
  
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    
    .container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .view-toggles {
      display: flex;
      gap: 0.5rem;
    }
    
    .toggle-btn {
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid #eee;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    
    .toggle-btn.active {
      background: rgb(var(--color-primary-500));
      color: white;
      border-color: rgb(var(--color-primary-600));
    }
    
    .editor-container {
      display: flex;
      height: calc(100% - 7rem);
      gap: 1rem;
      overflow: hidden;
    }
    
    .pane {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .pane-header {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      background: #f5f5f5;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      font-weight: 500;
    }
    
    .pane-content {
      flex: 1;
      overflow: auto;
      border-radius: 0 0 0.5rem 0.5rem;
    }
    
    /* Mode-specific layouts */
    .editor-container.edit-only .preview-pane,
    .editor-container.preview-only .editor-pane {
      display: none;
    }
  `;
  
  handleMarkdownChange(e: CustomEvent) {
    this.markdownText = e.detail.markdown;
  }
  
  setViewMode(mode: string) {
    this.viewMode = mode;
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h2>Markdown Editor</h2>
          
          <div class="view-toggles">
            <button 
              class="toggle-btn ${this.viewMode === 'edit' ? 'active' : ''}"
              @click=${() => this.setViewMode('edit')}
            >
              Editor
            </button>
            <button 
              class="toggle-btn ${this.viewMode === 'split' ? 'active' : ''}"
              @click=${() => this.setViewMode('split')}
            >
              Split
            </button>
            <button 
              class="toggle-btn ${this.viewMode === 'preview' ? 'active' : ''}"
              @click=${() => this.setViewMode('preview')}
            >
              Preview
            </button>
          </div>
        </div>
        
        <div class="editor-container ${this.viewMode === 'edit' ? 'edit-only' : this.viewMode === 'preview' ? 'preview-only' : ''}">
          <div class="pane editor-pane">
            <div class="pane-header">Editor</div>
            <div class="pane-content">
              <editor-input 
                .markdown=${this.markdownText}
                @markdown-change=${this.handleMarkdownChange}
              ></editor-input>
            </div>
          </div>
          
          <div class="pane preview-pane">
            <div class="pane-header">Preview</div>
            <div class="pane-content">
              <preview-pane .markdown=${this.markdownText}></preview-pane>
            </div>
          </div>
        </div>
        
        <export-options .markdown=${this.markdownText}></export-options>
      </div>
    `;
  }
}