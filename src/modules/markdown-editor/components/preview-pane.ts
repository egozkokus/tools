import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import 'highlight.js/styles/github.css';
import hljs from 'highlight.js';

// תצוגת התוכן המעובד
@customElement('preview-pane')
export class PreviewPane extends LitElement {
  @property({ type: String }) markdown = '';
  
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    
    .preview {
      padding: 1rem;
      background: white;
      height: 100%;
      overflow: auto;
      line-height: 1.6;
    }
    
    /* Markdown styling */
    .preview h1, .preview h2, .preview h3, .preview h4, .preview h5, .preview h6 {
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      font-weight: 600;
      line-height: 1.25;
    }
    
    .preview h1 { font-size: 2rem; border-bottom: 1px solid #eee; padding-bottom: 0.3rem; }
    .preview h2 { font-size: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 0.3rem; }
    .preview h3 { font-size: 1.25rem; }
    .preview h4 { font-size: 1rem; }
    
    .preview p {
      margin-bottom: 1rem;
    }
    
    .preview ul, .preview ol {
      margin-bottom: 1rem;
      padding-left: 2rem;
    }
    
    .preview ul { list-style-type: disc; }
    .preview ol { list-style-type: decimal; }
    
    .preview blockquote {
      margin: 1rem 0;
      padding: 0 1rem;
      color: #6a737d;
      border-left: 0.25rem solid #dfe2e5;
    }
    
    .preview pre {
      margin: 1rem 0;
      padding: 1rem;
      background-color: #f6f8fa;
      border-radius: 0.25rem;
      overflow: auto;
    }
    
    .preview code {
      font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
      padding: 0.2em 0.4em;
      background-color: #f6f8fa;
      border-radius: 0.25rem;
    }
    
    .preview pre code {
      padding: 0;
      background-color: transparent;
    }
    
    .preview table {
      margin: 1rem 0;
      border-collapse: collapse;
      width: 100%;
      overflow: auto;
    }
    
    .preview table th, .preview table td {
      padding: 0.5rem 1rem;
      border: 1px solid #dfe2e5;
    }
    
    .preview table th {
      background-color: #f6f8fa;
      font-weight: 600;
    }
    
    .preview hr {
      height: 0.25rem;
      padding: 0;
      margin: 1.5rem 0;
      background-color: #e1e4e8;
      border: 0;
    }
    
    .preview a {
      color: rgb(var(--color-primary-500));
      text-decoration: none;
    }
    
    .preview a:hover {
      text-decoration: underline;
    }
    
    .preview img {
      max-width: 100%;
    }
  `;
  
  constructor() {
    super();
    // Configure marked with syntax highlighting
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (e) {
            console.error(e);
          }
        }
        return code;
      }
    });
  }
  
  renderMarkdown() {
    if (!this.markdown) return '';
    
    const html = marked(this.markdown);
    return DOMPurify.sanitize(html);
  }

  render() {
    return html`
      <div class="preview">
        <div .innerHTML=${this.renderMarkdown()}></div>
      </div>
    `;
  }
}