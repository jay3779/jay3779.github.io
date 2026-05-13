/**
 * Git Integration
 * Commits encoded posts to repository
 */

import { simpleGit, SimpleGit } from 'simple-git';
import * as vscode from 'vscode';

let git: SimpleGit;

/**
 * Initialize git integration
 */
export async function initGit() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    throw new Error('No workspace folder open');
  }

  git = simpleGit(workspaceFolder.uri.fsPath);
  return git;
}

/**
 * Commit a post to the repository
 */
export async function commitPost(
  url: string,
  title: string,
  description: string
): Promise<string> {
  if (!git) {
    await initGit();
  }

  // Extract payload from URL
  const match = url.match(/\/([a-zA-Z0-9\-_]+)$/);
  const payload = match ? match[1] : url.slice(-50);

  // Build commit message
  const desc = description ? ` | Desc: ${description}` : '';
  const commitMessage = 
    `blog: [itty:${payload}] Title: ${title}${desc}\n\n` +
    `Published: ${new Date().toISOString()}\n` +
    `URL: ${url}`;

  try {
    // Stage all changes
    await git.add('.');
    
    // Create commit
    const commit = await git.commit(commitMessage);
    
    // Push to origin
    await git.push('origin', 'main');

    return commit.hash;
  } catch (error) {
    throw new Error(
      `Git operation failed: ${(error as Error).message}. ` +
      `Ensure repository is initialized and connected to GitHub.`
    );
  }
}

/**
 * Check if repository is valid
 */
export async function validateRepository(): Promise<boolean> {
  try {
    if (!git) {
      await initGit();
    }
    await git.status();
    return true;
  } catch (error) {
    return false;
  }
}
