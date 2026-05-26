# RanahMinang Project Instructions

## Project Context
RanahMinang is a Tourism & Culture Exchange platform focused on Minangkabau culture and tourism in West Sumatra, Indonesia.

## Main Stack
- Next.js App Router
- TypeScript
- TailwindCSS
- Prisma ORM
- MariaDB
- Leaflet.js
- JWT Authentication

## Deployment Environment
- Ubuntu 24.04 VPS inside VMware
- aaPanel deployment
- Cloudflare Tunnel public access
- Linux production environment
- Node.js production runtime
- Project root:
  /www/wwwroot/ranahminang

## Development Rules
- Keep architecture simple and maintainable.
- Do not overengineer backend.
- Prefer modular reusable components.
- Avoid Windows-only filesystem paths.
- Always use Linux-compatible deployment assumptions.
- Keep deployment VPS-friendly.
- Do not replace existing frontend unless explicitly requested.
- Preserve existing UI design.
- Prefer App Router architecture.
- Use Prisma for database access.
- Use MariaDB compatibility.
- Use lightweight APIs.
- Avoid unnecessary dependencies.

## UI Guidelines
- Cultural modern aesthetic
- Earth-tone palette
- Mobile responsive
- Interactive map-first UX
- Simple clean navigation

## Features
- Interactive West Sumatra map
- Tourism destinations
- Cultural encyclopedia
- Historical narratives
- Producer/tourist interaction
- Authentication
- Upload system
- Event registration

## Infrastructure
- Public access through Cloudflare Tunnel
- Ubuntu production deployment
- Local uploads stored on VPS
- Docker compatibility preferred