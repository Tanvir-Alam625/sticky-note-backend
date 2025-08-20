#!/usr/bin/env node

/**
 * Professional File & Folder Tree Generator
 * 
 * Generates a Markdown file (tree.md) with project structure visualization
 * Features:
 * - Cross-platform compatibility (Windows, macOS, Linux)
 * - Customizable depth via --depth argument
 * - Professional emoji icons for folders
 * - Configurable ignore patterns
 * - Comprehensive error handling
 * - Clean, maintainable code structure
 * 
 * Usage:
 *   npm run tree                    # Default depth: 10
 *   npm run tree -- --depth=5      # Custom depth: 5
 *   npm run tree -- --depth=30     # Maximum depth: 30
 * 
 * @author Tanvir-Alam625
 * @version 1.0.0
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ===== CONFIGURATION =====
const CONFIG = {
  outputFile: path.join(__dirname, '..', 'tree.md'),
  defaultDepth: 10,
  maxDepth: 30,
  minDepth: 1,
  
  // Files and folders to ignore
  ignorePatterns: [
    'node_modules',
    '.git',
    '.env',
    'tree.md',
    'package-lock.json',
    'yarn.lock',
    '.DS_Store',
    'dist',
    'build',
    'next',
    'railway.toml',
    'coverage',
    '.nyc_output',
    'logs'
  ],

  // Folder icon mapping for professional appearance
  folderIcons: [
    { pattern: /^node_modules$/i, icon: '📦', description: 'Dependencies' },
    { pattern: /^config$/i, icon: '🔧', description: 'Configuration' },
    { pattern: /^controllers?$/i, icon: '🧩', description: 'Controllers' },
    { pattern: /^middleware$/i, icon: '🛡️', description: 'Middleware' },
    { pattern: /^routes$/i, icon: '🛣️', description: 'Routes' },
    { pattern: /^setup$/i, icon: '⚙️', description: 'Setup' },
    { pattern: /^utils?$/i, icon: '🧰', description: 'Utilities' },
    { pattern: /^types?$/i, icon: '🏷️', description: 'Type Definitions' },
    { pattern: /^services?$/i, icon: '🧵', description: 'Services' },
    { pattern: /^database$/i, icon: '🗃️', description: 'Database' },
    { pattern: /^models?$/i, icon: '🗂️', description: 'Data Models' },
    { pattern: /^views?$/i, icon: '🗒️', description: 'Views' },
    { pattern: /^dist$/i, icon: '📤', description: 'Distribution' },
    { pattern: /^build$/i, icon: '🏗️', description: 'Build Output' },
    { pattern: /^src$/i, icon: '💻', description: 'Source Code' },
    { pattern: /^public$/i, icon: '🌐', description: 'Public Assets' },
    { pattern: /^static$/i, icon: '🌐', description: 'Static Files' },
    { pattern: /^assets$/i, icon: '🎨', description: 'Assets' },
    { pattern: /^test(s)?$/i, icon: '🧪', description: 'Tests' },
    { pattern: /^spec(s)?$/i, icon: '🧪', description: 'Specifications' },
    { pattern: /^docs?$/i, icon: '📄', description: 'Documentation' },
    { pattern: /^\.git$/i, icon: '🔀', description: 'Git Repository' },
    { pattern: /^\.env$/i, icon: '📝', description: 'Environment' },
    { pattern: /^scripts?$/i, icon: '📜', description: 'Scripts' },
    { pattern: /^tools?$/i, icon: '🔨', description: 'Tools' },
    { pattern: /^lib(s)?$/i, icon: '📚', description: 'Libraries' },
    { pattern: /^components?$/i, icon: '🧱', description: 'Components' },
    { pattern: /^pages?$/i, icon: '📄', description: 'Pages' },
    { pattern: /^layouts?$/i, icon: '🎯', description: 'Layouts' },
    { pattern: /^hooks?$/i, icon: '🪝', description: 'Hooks' },
    { pattern: /^store$/i, icon: '💾', description: 'State Store' },
    { pattern: /^reducers?$/i, icon: '🔄', description: 'Reducers' },
    { pattern: /^actions?$/i, icon: '⚡', description: 'Actions' },
    { pattern: /^.+$/, icon: '📁', description: 'Folder' } // fallback
  ]
};

// ===== UTILITY FUNCTIONS =====

/**
 * Logs messages with timestamp and appropriate styling
 * @param {string} level - Log level: 'info', 'warn', 'error', 'success'
 * @param {string} message - Message to log
 */
function log(level, message) {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}]`;
  
  switch (level) {
    case 'error':
      console.error(`❌ ${prefix} ERROR: ${message}`);
      break;
    case 'warn':
      console.warn(`⚠️  ${prefix} WARN: ${message}`);
      break;
    case 'success':
      console.log(`✅ ${prefix} SUCCESS: ${message}`);
      break;
    case 'info':
    default:
      console.log(`ℹ️  ${prefix} INFO: ${message}`);
      break;
  }
}

/**
 * Parses command line arguments for depth configuration
 * @returns {number} Validated depth value
 */
function parseDepthArgument() {
  const depthArg = process.argv.find(arg => arg.startsWith('--depth='));
  
  if (!depthArg) {
    return CONFIG.defaultDepth;
  }
  
  const depthValue = parseInt(depthArg.split('=')[1], 10);
  
  if (isNaN(depthValue)) {
    log('warn', `Invalid depth value. Using default: ${CONFIG.defaultDepth}`);
    return CONFIG.defaultDepth;
  }
  
  if (depthValue < CONFIG.minDepth) {
    log('warn', `Depth too small. Using minimum: ${CONFIG.minDepth}`);
    return CONFIG.minDepth;
  }
  
  if (depthValue > CONFIG.maxDepth) {
    log('warn', `Depth too large. Using maximum: ${CONFIG.maxDepth}`);
    return CONFIG.maxDepth;
  }
  
  log('info', `Using custom depth: ${depthValue}`);
  return depthValue;
}

/**
 * Discovers all folders in the project root directory
 * @param {string} rootDir - Root directory to scan
 * @returns {string[]} Array of folder names
 */
function discoverProjectFolders(rootDir) {
  try {
    const entries = fs.readdirSync(rootDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => !CONFIG.ignorePatterns.includes(name));
  } catch (error) {
    log('error', `Failed to read project directory: ${error.message}`);
    return [];
  }
}

// ===== CORE FUNCTIONS =====

/**
 * Generates directory tree using tree-node-cli
 * @param {number} depth - Maximum depth for tree generation
 * @returns {string} Raw tree output or error message
 */
function generateDirectoryTree(depth) {
  try {
    log('info', `Generating directory tree with depth: ${depth}`);
    
    const excludePattern = CONFIG.ignorePatterns.join('|');
    const command = `npx tree-node-cli --exclude "${excludePattern}" --max-depth ${depth} --dirs-first ./`;
    
    const tree = execSync(command, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'),
      timeout: 30000 // 30 seconds timeout
    });
    
    log('success', 'Directory tree generated successfully');
    return tree;
    
  } catch (error) {
    log('error', `Failed to generate directory tree: ${error.message}`);
    return `Error generating tree: ${error.message}\n\nPlease ensure tree-node-cli is installed:\nnpm install --save-dev tree-node-cli`;
  }
}

/**
 * Adds professional emoji icons to folder names in the tree
 * @param {string} tree - Raw tree output
 * @param {string[]} projectFolders - Known project folders
 * @returns {string} Tree with emoji icons
 */
function addFolderIcons(tree, projectFolders) {
  try {
    log('info', 'Adding professional folder icons');
    
    const lines = tree.split('\n');
    const processedLines = lines.map(line => {
      // Match tree structure lines (├── or └── followed by name)
      const match = line.match(/^(\s*[├└│─\s]*(?:├── |└── ))([^\/\n]+)$/);
      
      if (!match) return line;
      
      const [, prefix, name] = match;
      const trimmedName = name.trim();
      
      // Only add icons to known project folders
      if (!projectFolders.includes(trimmedName)) {
        return line;
      }
      
      // Find matching icon
      for (const { pattern, icon } of CONFIG.folderIcons) {
        if (pattern.test(trimmedName)) {
          return `${prefix}${icon} ${trimmedName}`;
        }
      }
      
      return line;
    });
    
    log('success', 'Folder icons added successfully');
    return processedLines.join('\n');
    
  } catch (error) {
    log('error', `Failed to add folder icons: ${error.message}`);
    return tree; // Return original tree if icon processing fails
  }
}

/**
 * Generates professional Markdown content with metadata
 * @param {string} treeWithIcons - Tree with emoji icons
 * @returns {string} Complete Markdown content
 */
function generateMarkdownContent(treeWithIcons) {
  const timestamp = new Date().toLocaleString();
  const depth = parseDepthArgument();
  
  return `# 📁 Project Structure

> **Generated on:** ${timestamp}  
> **Max Depth:** ${depth} levels  
> **Generator:** File & Folder Tree Script v1.0.0

## Directory Tree

\`\`\`
${treeWithIcons}
\`\`\`

## Legend

| Icon | Type | Description |
|------|------|-------------|
| 📦 | Dependencies | Node.js packages and modules |
| 🔧 | Configuration | App configuration files |
| 🧩 | Controllers | Request handlers and business logic |
| 🛡️ | Middleware | Request/response middleware |
| 🛣️ | Routes | API route definitions |
| ⚙️ | Setup | Initialization and setup scripts |
| 🧰 | Utilities | Helper functions and tools |
| 🗃️ | Database | Database-related files |
| 💻 | Source | Main source code |
| 🧪 | Tests | Test files and specifications |
| 📄 | Documentation | Project documentation |
| 📁 | General | Other folders |

---
*This file was auto-generated. Do not edit manually.*
`;
}

/**
 * Writes content to the output file with proper error handling
 * @param {string} content - Markdown content to write
 * @param {string} outputPath - Output file path
 */
function writeOutputFile(content, outputPath) {
  try {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, content, 'utf8');
    log('success', `Tree documentation written to: ${path.relative(process.cwd(), outputPath)}`);
    
  } catch (error) {
    log('error', `Failed to write output file: ${error.message}`);
    process.exit(1);
  }
}

// ===== MAIN EXECUTION =====

/**
 * Main function - orchestrates the entire tree generation process
 */
function main() {
  try {
    log('info', '🌳 Starting Professional Tree Generator');
    
    // Parse configuration
    const depth = parseDepthArgument();
    const rootDir = path.join(__dirname, '..');
    
    // Discover project structure
    const projectFolders = discoverProjectFolders(rootDir);
    log('info', `Discovered ${projectFolders.length} project folders`);
    
    // Generate directory tree
    const rawTree = generateDirectoryTree(depth);
    
    // Add professional icons
    const treeWithIcons = addFolderIcons(rawTree, projectFolders);
    
    // Generate markdown content
    const markdownContent = generateMarkdownContent(treeWithIcons);
    
    // Write output file
    writeOutputFile(markdownContent, CONFIG.outputFile);
    
    log('success', '🎉 Tree generation completed successfully!');
    
  } catch (error) {
    log('error', `Unexpected error: ${error.message}`);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

// Export for potential use as module
module.exports = {
  generateDirectoryTree,
  addFolderIcons,
  generateMarkdownContent,
  CONFIG
};
