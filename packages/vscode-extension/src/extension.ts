/**
 * VS Code Extension: Itty-Bitty Blog
 * 
 * Creates shareable blog posts programmatically from VS Code chat.
 * Exposes MCP tools for Copilot Chat integration.
 */

import * as vscode from 'vscode';
import { encodeMarkdown } from './encoder';
import { commitPost } from './git-integration';

export function activate(context: vscode.ExtensionContext) {
  console.log('✅ Itty-Bitty Blog extension activated');

  // Command: Create post from user input
  const createPostCmd = vscode.commands.registerCommand(
    'ittyBlog.createPost',
    async () => {
      const markdown = await vscode.window.showInputBox({
        title: 'Create Blog Post',
        prompt: 'Paste markdown content (max 32KB)',
        placeHolder: '# Title\n\nContent here...',
        validateInput: (value: string) => {
          if (value.length > 32768) {
            return `Too large (${value.length} > 32KB)`;
          }
          return '';
        }
      });

      if (!markdown) return;

      const title = await vscode.window.showInputBox({
        prompt: 'Post title',
        placeHolder: 'My Blog Post'
      });

      if (!title) return;

      try {
        const result = encodeMarkdown(markdown, title);
        
        // Show result with copy button
        const action = await vscode.window.showInformationMessage(
          `✅ Encoded! Size: ${result.compressedSize}b`,
          'Copy URL',
          'Copy & Commit'
        );

        if (action === 'Copy URL') {
          await vscode.env.clipboard.writeText(result.url);
          vscode.window.showInformationMessage('URL copied to clipboard');
        } else if (action === 'Copy & Commit') {
          await vscode.env.clipboard.writeText(result.url);
          
          const desc = await vscode.window.showInputBox({
            prompt: 'Post description (optional)'
          });

          try {
            await commitPost(result.url, title, desc || '');
            vscode.window.showInformationMessage(
              '✅ Post committed! Triggering deploy...'
            );
          } catch (error) {
            vscode.window.showErrorMessage(
              `Commit failed: ${(error as Error).message}`
            );
          }
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          `Encoding failed: ${(error as Error).message}`
        );
      }
    }
  );

  // Command: Encode selected text
  const encodeSelectionCmd = vscode.commands.registerCommand(
    'ittyBlog.encodeSelection',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const selection = editor.document.getText(editor.selection);
      const title = await vscode.window.showInputBox({
        prompt: 'Post title',
        value: 'Untitled'
      });

      if (!title) return;

      try {
        const result = encodeMarkdown(selection, title);
        const picked = await vscode.window.showQuickPick(
          [
            { label: 'Copy URL', description: 'Clipboard' },
            { label: 'Open in Browser', description: 'View decoded' },
            { label: 'Commit & Deploy', description: 'Auto-commit' }
          ],
          { placeHolder: 'What next?' }
        );

        if (picked?.label === 'Copy URL') {
          await vscode.env.clipboard.writeText(result.url);
          vscode.window.showInformationMessage('URL copied!');
        } else if (picked?.label === 'Open in Browser') {
          vscode.env.openExternal(vscode.Uri.parse(result.url));
        } else if (picked?.label === 'Commit & Deploy') {
          try {
            await commitPost(result.url, title, '');
            vscode.window.showInformationMessage('✅ Post deployed!');
          } catch (error) {
            vscode.window.showErrorMessage(
              `Deployment failed: ${(error as Error).message}`
            );
          }
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          `Error: ${(error as Error).message}`
        );
      }
    }
  );

  context.subscriptions.push(createPostCmd, encodeSelectionCmd);
}

export function deactivate() {}
