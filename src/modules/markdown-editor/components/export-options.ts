import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// אפשרויות יצוא של המרקדאון
@customElement('export-options')
export class ExportOptions extends LitElement {
  @property({ type: String }) markdown = '';
  
  static styles = css`
    :host {
      display: block;
      margin-top: 1rem;
    }
    
    .export-container {
      background: white;
      border-radius: 0.5rem;
      padding: 1rem 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #333;
    }
    
    .export-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .export-button {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.25rem;
      background: #f9f9f9;
      border: 1px solid #eee;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      color: #333;
      font-weight: 500;
    }
    
    .export-button:hover {
      background: #f0f0f0;
      border-color: #ddd;
    }
    
    .export-button svg {
      margin-right: 0.5rem;
      color: rgb(var(--color-primary-500));
    }
  `;
  
  exportMarkdown() {
    const blob = new Blob([this.markdown], { type: 'text/markdown' });
    this.downloadBlob(blob, 'document.md');
  }
  
  exportHTML() {
    const html = marked(this.markdown);
    const sanitizedHtml = DOMPurify.sanitize(html);
    
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Document</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1, h2 { border-bottom: 1px solid #eee; padding-bottom: 0.3rem; }
    pre {
      background-color: #f6f8fa;
      border-radius: 0.25rem;
      padding: 1rem;
      overflow: auto;
    }
    code {
      font-family: Menlo, Monaco, "Courier New", monospace;
      font-size: 0.9em;
      background-color: #f6f8fa;
      padding: 0.2em 0.4em;
      border-radius: 0.25rem;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    blockquote {
      margin: 1rem 0;
      padding: 0 1rem;
      color: #6a737d;
      border-left: 0.25rem solid #dfe2e5;
    }
    img { max-width: 100%; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1rem 0;
    }
    table th, table td {
      border: 1px solid #dfe2e5;
      padding: 0.5rem 1rem;
    }
    table th { background-color: #f6f8fa; }
  </style>
</head>
<body>
  ${sanitizedHtml}
</body>
</html>
    `;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    this.downloadBlob(blob, 'document.html');
  }
  
  exportPDF() {
    alert('PDF export would require a PDF generation library. This is a placeholder for the feature.');
  }
  
  downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  render() {
    return html`
      <div class="export-container">
        <h3>Export</h3>
        <div class="export-buttons">
          <button class="export-button" @click=${this.exportMarkdown}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
              <line x1="9" y1="9" x2="10" y2="9"></line>
              <line x1="9" y1="13" x2="15" y2="13"></line>
              <line x1="9" y1="17" x2="15" y2="17"></line>
            </svg>
            Markdown
          </button>
          
          <button class="export-button" @click=${this.exportHTML}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M9 13h6"></path>
              <path d="M9 17h6"></path>
              <path d="M10 9H9"></path>
            </svg>
            HTML
          </button>
          
          <button class="export-button" @click=${this.exportPDF}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M9 15h6"></path>
              <path d="M9 11h6"></path>
            </svg>
            PDF
          </button>
        </div>
      </div>
    `;
  }
}