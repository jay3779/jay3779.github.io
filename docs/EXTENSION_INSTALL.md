# Extension Installation & Testing Guide

**Extension:** VS Code Itty-Bitty Blog  
**Package:** `vscode-itty-blog-0.1.0.vsix` (330 KB)  
**Status:** ✅ Built & ready to test

---

## Installation

### Method 1: Command Line (Recommended)

```powershell
code --install-extension "c:\Itty Blog\vscode-itty-extension\vscode-itty-blog-0.1.0.vsix"
```

### Method 2: VS Code UI

1. Open VS Code
2. **Extensions** → **Views and More Actions** (⋯) → **Install from VSIX**
3. Select file: `c:\Itty Blog\vscode-itty-extension\vscode-itty-blog-0.1.0.vsix`
4. Click **Install**

### Method 3: Drag & Drop

Drag `vscode-itty-blog-0.1.0.vsix` onto VS Code Extensions panel

---

## Verification

After installation:

```powershell
# Reload VS Code to activate extension
ctrl+shift+p → "Developer: Reload Window"
```

Check **Output** panel → **Itty-Bitty Blog** for activation log:

```
✅ Itty-Bitty Blog extension activated
```

---

## Test the Extension

### Test 1: Command Palette

1. `Ctrl+Shift+P`
2. Type: `Create Itty-Bitty Blog Post`
3. Paste test markdown:
   ```markdown
   # Test Post

   Testing the **itty-bitty** encoding.

   - Point 1
   - Point 2

   Done!
   ```
4. Title: `Test Post`
5. Click **Copy URL** (or **Copy & Commit** if git is configured)

**Expected Result:**
- URL copied to clipboard
- Format: `${ITTY_BLOG_BASE_URL}/#Test%20Post/[base64url_payload]`
- Notification: ✅ Success

### Test 2: Encode Selection

1. Write or select markdown in editor
2. Right-click → **Encode Selection as Itty-Bitty URL**
3. Enter title
4. Choose action (Copy / Open / Commit)

**Expected Result:**
- URL generated and copied/opened
- No errors in console

### Test 3: Copilot Chat (MCP Tool)

If you have GitHub Copilot:

1. Open **Copilot Chat** (`Ctrl+Shift+I`)
2. Paste markdown
3. Type: `@ittyBlog Create a blog post from this markdown`
4. Tool executes and returns URL

**Expected Result:**
- Chat shows encoded URL
- Compression stats displayed
- No errors

---

## Troubleshooting

### "Extension not found" during install

```powershell
# Check file exists
Test-Path "c:\Itty Blog\vscode-itty-extension\vscode-itty-blog-0.1.0.vsix"

# If missing, rebuild:
cd "c:\Itty Blog\vscode-itty-extension"
npm run compile && npm run package
```

### "Extension won't activate"

Check VS Code version:

```powershell
# Open VS Code and check About
Version → v1.102.0+ required for MCP support
```

Reload:
- `Ctrl+Shift+P` → `Developer: Reload Window`

Check logs:
- **View** → **Output** → `Itty-Bitty Blog`
- **View** → **Debug Console**

### "Command not found"

```powershell
# Try exact command name
Ctrl+Shift+P → "ittyBlog.createPost"
```

Or check if extension is truly installed:
- **Extensions** panel
- Search `itty`
- Should show "Itty-Bitty Blog" as Installed

### "Git commit failed" error

Extension needs Git configured:

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Or local to blog repo:
cd "c:\Itty Blog\blog-repo"
git config user.name "Your Name"
git config user.email "your@email.com"
```

Also ensure you're in a Git repository:

```bash
cd "c:\Itty Blog\blog-repo"
git status  # Should show branch info
```

---

## Extension Features Reference

### Commands Available

| Command | Shortcut | Action |
|---------|----------|--------|
| Create Itty-Bitty Blog Post | `Ctrl+Shift+P` + type | Open input dialog |
| Encode Selection | Right-click | Encode selected text |
| (MCP Tool) createBlogPost | `@ittyBlog` in chat | Auto-encode & commit |
| (MCP Tool) encodeMarkdown | `@ittyBlog` in chat | Just encode, no commit |

### Input Validation

- **Max markdown:** 32 KB
- **Warns if:** Compressed > 4 KB (social media limit)
- **Safe:** < 1 KB compressed (typical post)

### Actions After Encoding

1. **Copy URL** — Copies to clipboard
2. **Open in Browser** — Opens itty-bitty URL in default browser (shows decoded content)
3. **Copy & Commit** — Copies URL and commits to Git
4. **Commit & Deploy** — Full workflow (requires Git + GitHub remote)

---

## Testing Checklist

- [ ] Installation successful (no errors)
- [ ] Command "Create Itty-Bitty Blog Post" appears in palette
- [ ] Right-click context menu shows "Encode Selection"
- [ ] Can paste markdown and generate URL
- [ ] URL format: `${ITTY_BLOG_BASE_URL}/#...`
- [ ] Compression stats displayed
- [ ] No JavaScript errors in console
- [ ] Git commit works (if configured)

---

## Development Tips

### Debug Mode

1. Open VS Code in dev folder:
   ```powershell
   cd c:\Itty Blog\vscode-itty-extension
   code .
   ```

2. Press `F5` to launch **Extension Development Host**

3. New VS Code window opens with extension active

4. Test commands with full debugging:
   - Set breakpoints in `src/extension.ts`
   - Debug Console shows output
   - Hot reload on file save (mostly)

### Rebuild Extension

```powershell
cd c:\Itty Blog\vscode-itty-extension

# Clean build
npm run compile

# Package as VSIX
npm run package

# Install new version
code --install-extension ./vscode-itty-blog-0.1.0.vsix --force
```

---

## Next: Create First Blog Post

Once extension is working:

1. **Via Extension** (recommended):
   ```
   Ctrl+Shift+P → Create Itty-Bitty Blog Post
   Paste markdown → Add title → Choose action
   ```

2. **Via Git Commit** (advanced):
   ```bash
   git commit -m "blog: [itty:payload] Title: My Post"
   git push origin main
   # GitHub Actions deploys automatically
   ```

---

## Support

- **Extension Docs:** [vscode-itty-extension/README.md](../vscode-itty-extension/README.md)
- **Platform Docs:** [blog-repo/README.md](../blog-repo/README.md)
- **Full Guide:** [IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md)

---

**Ready to test!** 🧪

Install the extension and run the test commands above to verify everything works.
