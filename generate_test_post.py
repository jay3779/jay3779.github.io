#!/usr/bin/env python3
"""Generate compressed test post for itty-bitty decoder"""
import gzip
import base64

title = "Lorem Ipsum Decoder Test"
html = """<h1>Lorem Ipsum Decoder Test</h1>
<p>This is a test post to verify the self-hosted decoder is working correctly.</p>
<h2>What is Lorem Ipsum?</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
<h2>Why Use It?</h2>
<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<h2>Testing Self-Hosted Decoder</h2>
<p>This post is compressed with gzip and base64 encoded, then served by the self-hosted decoder at /decoder.html. If you can read this, the decoder is working!</p>
<footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; color: #888; font-size: 0.9em;">
  <p>✅ Decoder Status: <strong>WORKING</strong></p>
</footer>"""

# Compress with gzip (like itty-bitty uses)
compressed = gzip.compress(html.encode('utf-8'))
b64 = base64.b64encode(compressed).decode('ascii')

print("=" * 80)
print("TEST POST GENERATOR")
print("=" * 80)
print(f"Title: {title}")
print(f"Original HTML: {len(html)} bytes")
print(f"Compressed: {len(compressed)} bytes")
print(f"Compression: {100 * (1 - len(compressed) / len(html)):.1f}%")
print()
print("Base64 Encoded Data:")
print(b64[:50] + "...")
print()
print("Decoder URL:")
url = f"https://jay3779.github.io/decoder.html#{title.replace(' ', '%20')}/{b64}"
print(url)
print()
print("=" * 80)
print("Copy the URL above to test in browser!")
print("=" * 80)

# Also write to a file for easy copying
with open('/tmp/test_url.txt', 'w') as f:
    f.write(url)
print(f"\nURL saved to: /tmp/test_url.txt")
