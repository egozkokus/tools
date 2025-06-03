import { LitElement } from 'lit';

// אובייקט שמאחסן את כל המודולים הזמינים
export interface ModuleInfo {
  title: string;
  description: string;
  icon: string;
  component: typeof LitElement;
}

export const moduleRegistry = new Map<string, ModuleInfo>();

// פונקציה להרשמת כל המודולים
export function registerModules() {
  // Import all modules dynamically
  import('./audio-studio/audio-studio-module')
    .then(module => {
      moduleRegistry.set('audio-studio', {
        title: 'Audio Studio',
        description: 'Process audio files with professional tools',
        icon: 'waveform',
        component: module.AudioStudioModule
      });
    })
    .catch(err => console.error('Failed to load Audio Studio module:', err));
    
  import('./markdown-editor/markdown-editor-module')
    .then(module => {
      moduleRegistry.set('markdown-editor', {
        title: 'Markdown Editor',
        description: 'Edit and preview markdown with export options',
        icon: 'file-text',
        component: module.MarkdownEditorModule
      });
    })
    .catch(err => console.error('Failed to load Markdown Editor module:', err));
    
  import('./image-lab/image-lab-module')
    .then(module => {
      moduleRegistry.set('image-lab', {
        title: 'Image Lab',
        description: 'Process and transform images',
        icon: 'image',
        component: module.ImageLabModule
      });
    })
    .catch(err => console.error('Failed to load Image Lab module:', err));
    
  import('./file-hub/file-hub-module')
    .then(module => {
      moduleRegistry.set('file-hub', {
        title: 'File Hub',
        description: 'Manage, compress and validate files',
        icon: 'folder',
        component: module.FileHubModule
      });
    })
    .catch(err => console.error('Failed to load File Hub module:', err));
}