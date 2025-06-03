import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

// כותרת תחתונה של האפליקציה
@customElement('app-footer')
export class AppFooter extends LitElement {
  static styles = css`
    :host {
      display: block;
      background-color: rgb(var(--color-primary-900));
      color: white;
      padding: 1.5rem 1rem;
      font-size: 0.875rem;
    }
    
    footer {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .footer-top {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 2rem;
    }
    
    .footer-section {
      min-width: 180px;
    }
    
    h3 {
      font-weight: 600;
      margin-bottom: 0.75rem;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    li {
      margin-bottom: 0.5rem;
    }
    
    a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    a:hover {
      color: white;
      text-decoration: underline;
    }
    
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 1rem;
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
    }
  `;

  render() {
    const year = new Date().getFullYear();
    
    return html`
      <footer>
        <div class="footer-top">
          <div class="footer-section">
            <h3>BrowserTools Pro</h3>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Roadmap</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Tutorials</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Use</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; ${year} BrowserTools Pro. All rights reserved.</p>
        </div>
      </footer>
    `;
  }
}