"""
Study Vault & Deathline Tracker - Multi-threaded Dual-Stack (IPv4/IPv6) Server with TypeSafe Jev Proxy
Serves static files concurrently over both IPv4 (127.0.0.1) and IPv6 (::1/localhost) without socket drops.
"""

import http.server
import socket
import urllib.request
import json
import sys
import os

PORT = 8085
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class DualStackThreadingServer(http.server.ThreadingHTTPServer):
    address_family = socket.AF_INET6
    daemon_threads = True

    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except (AttributeError, OSError):
            pass
        super().server_bind()

class StudyAppHandler(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Prevent browser caching issues during active development
        if self.path.endswith('.js') or self.path.endswith('.css') or self.path.endswith('.html') or self.path == '/':
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
        super().end_headers()

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            pass

    def log_message(self, format, *args):
        sys.stderr.write(f"[{self.log_date_time_string()}] {args[0]} {args[1]}\n")

    def do_POST(self):
        if self.path == "/api/systemone":
            try:
                content_length = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(content_length)
                
                auth_header = self.headers.get("Authorization", "")
                if not auth_header:
                    self.send_response(401)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(b'{"error": "Authorization header missing"}')
                    return

                # Forward to TypeSafe AI System One
                req = urllib.request.Request(
                    "https://api.typesafe.ai/v1/systemone",
                    data=body,
                    headers={
                        "Authorization": auth_header,
                        "Content-Type": "application/json",
                        "User-Agent": "StudyVault/1.0"
                    },
                    method="POST"
                )

                with urllib.request.urlopen(req, timeout=30) as resp:
                    resp_data = resp.read()
                    self.send_response(resp.status)
                    self.send_header("Content-Type", "application/json")
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    self.wfile.write(resp_data)

            except urllib.error.HTTPError as e:
                err_resp = e.read()
                self.send_response(e.code)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(err_resp)
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        else:
            self.send_error(404, "Endpoint not found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type")
        self.end_headers()

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    DualStackThreadingServer.allow_reuse_address = True

    server = None
    for try_port in [8085, 8080, 8088]:
        try:
            # Bind to '::' with IPV6_V6ONLY=0 to accept both IPv4 (127.0.0.1) and IPv6 (::1)
            server = DualStackThreadingServer(('::', try_port), StudyAppHandler)
            PORT = try_port
            break
        except Exception:
            try:
                # Fallback to IPv4 only if dual-stack is unsupported on host
                server = http.server.ThreadingHTTPServer(('', try_port), StudyAppHandler)
                PORT = try_port
                break
            except OSError:
                continue

    if not server:
        print("Error: Could not bind to any test port (8085, 8080, 8088)", flush=True)
        sys.exit(1)

    print("==================================================", flush=True)
    print(f"  Zenith Study & Deathline Tracker (Dual-Stack)", flush=True)
    print(f"  URL (IPv4):  http://127.0.0.1:{PORT}", flush=True)
    print(f"  URL (Local): http://localhost:{PORT}", flush=True)
    print(f"  TypeSafe Jev API proxy enabled at: /api/systemone", flush=True)
    print("==================================================", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.", flush=True)
        server.shutdown()
