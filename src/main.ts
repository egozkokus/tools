import './styles/index.css';
import './components/app-shell';
import { registerModules } from './modules/registry';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Register all modules
  registerModules();
  
  // Render the app shell
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = '<app-shell></app-shell>';
  }
});