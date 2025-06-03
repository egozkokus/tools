import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { moduleRegistry } from '../modules/registry';

// כותרת האפליקציה עם ניווט למודולים
@customElement('app-header')
export class AppHeader extends LitElement {
  @state() activeModule = 'audio-studio';

  static styles = css`
    :host {
      display: block;
      background-color: rgb(var(--color-primary-500));
      color: white;
    }
    
    header {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    
    .flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    nav {
      display: flex;
      gap: 1rem;
    }
    
    nav button {
      background: transparent;
      border: none;
      color: white;
      opacity: 0.8;
      font-size: 1rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    
    nav button:hover, nav button.active {
      opacity: 1;
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    nav button.active {
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .flex {
        flex-direction: column;
        gap: 1rem;
      }
      
      nav {
        width: 100%;
        overflow-x: auto;
        justify-content: center;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('module-change', ((e: CustomEvent) => {
      this.activeModule = e.detail.module;
    }) as EventListener);
  }

  switchModule(module: string) {
    this.activeModule = module;
    this.dispatchEvent(new CustomEvent('module-change', {
      detail: { module },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <header>
        <div class="flex">
          <div class="logo">BrowserTools Pro</div>
          <nav>
            ${Array.from(moduleRegistry.keys()).map(module => html`
              <button 
                @click=${() => this.switchModule(module)}
                class=${this.activeModule === module ? 'active' : ''}
              >
                ${moduleRegistry.get(module)?.title || module}
              </button>
            `)}
          </nav>
        </div>
      </header>
    `;
  }
}