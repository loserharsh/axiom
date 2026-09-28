"""
Axiom Study & Deathline Tracker - Multi-threaded Local Server
Serves static web application files concurrently.
"""

import http.server
import socket
import sys
import os

PORT = 8085
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class StudyAppHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Prevent browser caching during active study/development
        if self.path.endswith('.js') or self.path.endswith('.css') or self.path.endswith('.html') or self.path == '/':
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
        super().end_headers()

    def log_message(self, format, *args):
        sys.stderr.write(f"[{self.log_date_time_string()}] {args[0]} {args[1]}\n")

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    http.server.ThreadingHTTPServer.allow_reuse_address = False

    server = None
    chosen_port = PORT
    for try_port in [8085, 8080, 8088, 3000, 5000]:
        try:
            server = http.server.ThreadingHTTPServer(('0.0.0.0', try_port), StudyAppHandler)
            chosen_port = try_port
            break
        except OSError:
            continue

    if not server:
        try:
            server = http.server.ThreadingHTTPServer(('0.0.0.0', 0), StudyAppHandler)
            chosen_port = server.server_address[1]
        except Exception as e:
            print(f"Error starting server: {e}", flush=True)
            sys.exit(1)

    print("==================================================", flush=True)
    print("  Axiom Study & Deathline Tracker Server Running", flush=True)
    print(f"  URL:         http://localhost:{chosen_port}", flush=True)
    print(f"  Alternative: http://127.0.0.1:{chosen_port}", flush=True)
    print("==================================================", flush=True)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.", flush=True)
        server.shutdown()
