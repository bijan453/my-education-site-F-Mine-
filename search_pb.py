import glob
import os
import re

pb_files = glob.glob(r'C:\Users\rohil\.gemini\antigravity\conversations\*.pb')

print(f"Searching {len(pb_files)} .pb files...")

for pb in pb_files:
    print(f"\n=====================================")
    print(f"FILE: {os.path.basename(pb)}")
    print(f"=====================================")
    try:
        with open(pb, 'rb') as f:
            data = f.read()
        
        # Let's search for occurrences of enhancements.js or code blocks
        # We can extract printable ASCII sequences (like a basic 'strings' command)
        matches = list(re.finditer(b'enhancements\\.js', data, re.IGNORECASE))
        if matches:
            print(f"Found {len(matches)} occurrences of 'enhancements.js'!")
            for i, match in enumerate(matches):
                start = max(0, match.start() - 200)
                end = min(len(data), match.end() + 1000)
                snippet = data[start:end]
                # Replace non-printable bytes
                snippet_clean = "".join([chr(b) if 32 <= b < 127 or b in [10, 13, 9] else '?' for b in snippet])
                print(f"\n--- MATCH {i+1} ---")
                print(snippet_clean[:1200])
        else:
            print("No occurrences of 'enhancements.js'")
            
    except Exception as e:
        print(f"Error reading {pb}: {e}")
