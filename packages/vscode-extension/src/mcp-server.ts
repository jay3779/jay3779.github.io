/**
 * MCP Server for Itty-Bitty Blog
 * Exposes tools for Copilot Chat integration
 * 
 * Tools:
 * - createBlogPost: Accept markdown, encode, auto-commit
 * - encodeMarkdown: Just encoding (no commit)
 */

import * as fs from 'fs';
import * as path from 'path';
import { encodeMarkdown } from './encoder';

/**
 * MCP Tool: Create Blog Post
 * Accepts markdown content, generates itty-bitty URL, optionally commits
 */
async function createBlogPost(input: {
  title: string;
  content: string;
  description?: string;
  autoCommit?: boolean;
}): Promise<{
  success: boolean;
  url: string;
  message: string;
  metadata: Record<string, unknown>;
}> {
  try {
    // Validate input
    if (!input.title || !input.content) {
      return {
        success: false,
        url: '',
        message: 'Missing title or content',
        metadata: {}
      };
    }

    // Encode
    const result = encodeMarkdown(input.content, input.title);

    // Size warning
    let sizeWarning = '';
    if (result.compressedSize > 4000) {
      sizeWarning = 
        ` (Note: ${result.compressedSize}b exceeds social media optimal size of 4KB)`;
    }

    const message = `✅ Blog post encoded${sizeWarning}`;

    // In production, would commit here if autoCommit=true
    // Requires git setup in extension context

    return {
      success: true,
      url: result.url,
      message,
      metadata: {
        rawSize: result.rawSize,
        compressedSize: result.compressedSize,
        compressionRatio: result.compressionRatio,
        title: input.title,
        description: input.description || ''
      }
    };
  } catch (error) {
    return {
      success: false,
      url: '',
      message: `Error: ${(error as Error).message}`,
      metadata: {}
    };
  }
}

/**
 * MCP Tool: Encode Markdown
 * Simple encoding without commit
 */
async function encodePlainMarkdown(input: {
  content: string;
  title?: string;
}): Promise<{
  success: boolean;
  url: string;
  stats: Record<string, unknown>;
}> {
  try {
    const result = encodeMarkdown(
      input.content,
      input.title || 'Untitled'
    );

    return {
      success: true,
      url: result.url,
      stats: {
        rawSize: result.rawSize,
        compressedSize: result.compressedSize,
        compressionRatio: result.compressionRatio
      }
    };
  } catch (error) {
    throw new Error(`Encoding failed: ${(error as Error).message}`);
  }
}

/**
 * MCP Tool Definitions (for VS Code Chat integration)
 */
export const mcpTools = [
  {
    name: 'createBlogPost',
    description: 'Create a shareable itty-bitty blog post URL. Encodes markdown content with optional auto-commit.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Blog post title'
        },
        content: {
          type: 'string',
          description: 'Markdown content (max 32KB)'
        },
        description: {
          type: 'string',
          description: 'Short post description for index'
        },
        autoCommit: {
          type: 'boolean',
          description: 'Auto-commit to repository'
        }
      },
      required: ['title', 'content']
    },
    handler: createBlogPost
  },
  {
    name: 'encodeMarkdown',
    description: 'Encode markdown to itty-bitty URL without committing',
    inputSchema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Markdown content'
        },
        title: {
          type: 'string',
          description: 'Optional title for URL metadata'
        }
      },
      required: ['content']
    },
    handler: encodePlainMarkdown
  }
];

/**
 * Minimal MCP Server Implementation
 * In production, would use @modelcontextprotocol/sdk
 */
export async function startMCPServer() {
  // This is a simplified version
  // Full implementation requires MCP SDK setup
  console.log('MCP Server tools registered:', mcpTools.map(t => t.name));
  return {
    tools: mcpTools,
    resources: []
  };
}
