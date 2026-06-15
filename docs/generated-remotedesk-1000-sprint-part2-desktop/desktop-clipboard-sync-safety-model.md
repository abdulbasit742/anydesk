# Clipboard sync safety model

Clipboard sync is disabled by default and text-only. Both sides need explicit controls. HTML, files, images, and clipboard history are intentionally out of scope. The runtime redacts clipboard contents from audit/support payloads and refuses obvious secret-like manual sync requests.
