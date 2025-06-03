import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { moduleRegistry } from '../modules/registry';

// מכל שמציג את המודול הפעיל
@customElement('module-container')
export class ModuleContainer extends LitElement {
  @state() activeModule = 'audio-studio';

  static styles = css`
    :host {
      display: block;
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem 1rem;
      height: 100%;
    }
    
    .container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('module-change', ((e: CustomEvent) => {
      this.activeModule = e.detail.module;
    }) as EventListener);
  }

  render() {
    const ModuleComponent = moduleRegistry.get(this.activeModule)?.component;
    
    return html`
      <div class="container">
        ${ModuleComponent ? html`<${ModuleComponent}></${ModuleComponent}>` : 
          html`<p>Module not found</p>`}
      </div>
    `;
  }
}