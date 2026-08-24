# JOE LINK V1–V4

GitHub Pages-ready local-first communication prototype.

## V1–V4
- V1: offline/local text chat, local identity, localStorage, queued/delivered demo states, nearby-peer UI.
- V2: iPhone file picker and local transfer queue with filename, size and experimental status.
- V3: press-and-hold microphone recording where browser APIs permit; local preview only.
- V4: incoming/outgoing-style call UI, timer, mute/speaker/end controls; designed for a future WebRTC/native transport.

## Honest iPhone/Safari limitation
This project does **not** fake Bluetooth. GitHub Pages + iPhone Safari cannot provide a full always-on iPhone-to-iPhone Bluetooth mesh. If Web Bluetooth is unavailable, the app detects that and remains functional in browser-only local mode.

Mesh Demo is intentionally a visual simulation of future routing. It does not transmit fake radio packets.

A future native iOS implementation can replace the discovery/transport layer with Apple's nearby-device networking APIs.

## Deploy
1. Create a GitHub repository.
2. Upload the contents of this folder to the repository root.
3. GitHub: Settings → Pages → Deploy from a branch → main → /(root).
4. Open the Pages HTTPS URL on iPhone Safari.
5. Use Share → Add to Home Screen.

No backend, account, ads, paid service, or external API is required.
