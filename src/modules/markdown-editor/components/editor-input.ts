import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// שדה הקלט לעריכת מרקדאון
@customElement('editor-input')
export class EditorInput extends LitElement {
  @property({ type: String }) markdown = '';
  
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    
    .editor {
      width: 100%;
      height: 100%;
      padding: 1rem;
      border: none;
      background: white;
      font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.5;
      resize: none;
      outline: none;
    }
  `;
  
  handleInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement;
    this.markdown = textarea.value;
    
    this.dispatchEvent(new CustomEvent('markdown-change', {
      detail: { markdown: this.markdown },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <textarea 
        class="editor" 
        .value=${this.markdown}
        @input=${this.handleInput}
        spellcheck="false"
        autocomplete="off"
      ></textarea>
    `;
  }
}