import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './app-header';
import './module-container';
import './app-footer';

// השלד הראשי של האפליקציה
@customElement('app-shell')
export class AppShell extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }
    
    .main-content {
      flex: 1;
    }
  `;

  render() {
    return html`
      <app-header></app-header>
      <main class="main-content">
        <module-container></module-container>
      </main>
      <app-footer></app-footer>
    `;
  }
}