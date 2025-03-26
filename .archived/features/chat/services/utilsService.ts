/**
 * Chat Utils Service
 * 
 * This service provides utility functions for the chat feature,
 * such as clipboard operations and export functionality.
 */
import type { Chat, ExportFormat } from '../types';
import { browser } from '$app/environment';

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!browser) return false;
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    
    // Fallback method
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (fallbackError) {
      console.error('Fallback clipboard copy failed:', fallbackError);
      return false;
    }
  }
}

/**
 * Format chat as markdown
 */
export function formatChatAsMarkdown(chat: Chat): string {
  let markdown = `# ${chat.name || 'Chat Export'}\n\n`;
  
  if (chat.company) {
    markdown += `**Company:** ${chat.company}\n\n`;
  }
  
  markdown += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
  markdown += `## Messages\n\n`;
  
  chat.messages.forEach(message => {
    const sender = message.sender === 'user' ? 'You' : message.sender === 'ai' ? 'AI' : 'System';
    const time = new Date(message.timestamp).toLocaleTimeString();
    markdown += `### ${sender} (${time})\n\n${message.content}\n\n`;
  });
  
  return markdown;
}

/**
 * Format chat as HTML
 */
export function formatChatAsHtml(chat: Chat): string {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${chat.name || 'Chat Export'}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; }
    .message { padding: 10px; margin-bottom: 15px; border-radius: 5px; }
    .user { background-color: #f0f7ff; border-left: 4px solid #3b82f6; }
    .ai { background-color: #f0fdf4; border-left: 4px solid #10b981; }
    .system { background-color: #f5f5f5; border-left: 4px solid #6b7280; font-style: italic; }
    .meta { font-size: 0.8em; color: #6b7280; margin-bottom: 5px; }
    pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
    code { font-family: monospace; background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>${chat.name || 'Chat Export'}</h1>
  
  ${chat.company ? `<p><strong>Company:</strong> ${chat.company}</p>` : ''}
  
  <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
  
  <h2>Messages</h2>
  
  <div class="messages">`;
  
  chat.messages.forEach(message => {
    const sender = message.sender === 'user' ? 'You' : message.sender === 'ai' ? 'AI' : 'System';
    const time = new Date(message.timestamp).toLocaleTimeString();
    
    html += `
    <div class="message ${message.sender}">
      <div class="meta">${sender} at ${time}</div>
      <div class="content">${message.content}</div>
    </div>`;
  });
  
  html += `
  </div>
</body>
</html>`;

  return html;
}

/**
 * Export chat to file using File System Access API if available,
 * with fallback to download attribute
 */
export async function exportChat(chat: Chat, format: ExportFormat): Promise<boolean> {
  if (!browser) return false;
  
  try {
    let content = '';
    let mimeType = '';
    let fileName = `${chat.name || 'chat'}-export`.replace(/\s+/g, '_').toLowerCase();
    
    // Prepare content based on format
    switch (format) {
      case 'markdown':
        content = formatChatAsMarkdown(chat);
        mimeType = 'text/markdown';
        fileName += '.md';
        break;
      case 'html':
        content = formatChatAsHtml(chat);
        mimeType = 'text/html';
        fileName += '.html';
        break;
      case 'json':
        content = JSON.stringify({
          chat,
          exportDate: new Date().toISOString()
        }, null, 2);
        mimeType = 'application/json';
        fileName += '.json';
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    // Create a blob from the content
    const blob = new Blob([content], { type: mimeType });
    
    // Try to use the File System Access API
    if ('showSaveFilePicker' in window) {
      try {
        // Use modern File System Access API
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: format === 'markdown' ? 'Markdown File' : 
                         format === 'html' ? 'HTML File' : 'JSON File',
            accept: {
              [mimeType]: [format === 'markdown' ? '.md' : 
                           format === 'html' ? '.html' : '.json']
            }
          }]
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
      } catch (fsaError) {
        // User might have canceled the save dialog
        console.log('File System Access API error (might be user cancel):', fsaError);
        return false;
      }
    } else {
      // Fallback for browsers without File System Access API
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    }
  } catch (error) {
    console.error('Error exporting chat:', error);
    return false;
  }
}

// Types for the File System Access API
declare global {
  interface Window {
    showSaveFilePicker?: (options?: {
      suggestedName?: string;
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<FileSystemFileHandle>;
  }
  
  interface FileSystemFileHandle {
    createWritable: () => Promise<FileSystemWritableFileStream>;
  }
  
  interface FileSystemWritableFileStream {
    write: (data: any) => Promise<void>;
    close: () => Promise<void>;
  }
}