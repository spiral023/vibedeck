# Dockerfile für VibeDeck Next.js Anwendung
# Multi-stage build für optimale Image-Größe

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Kopiere package.json und package-lock.json (falls vorhanden)
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm ci --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Kopiere node_modules von deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Setze Umgebungsvariablen für Build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Baue die Anwendung
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Erstelle Nutzer für bessere Sicherheit
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Setze Umgebungsvariablen
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Kopiere nur das Notwendige für Production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ändere Besitzer zu nextjs user
RUN chown -R nextjs:nodejs /app

# Wechsle zu nextjs user
USER nextjs

# Exponiere Port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Starte die Anwendung
CMD ["node", "server.js"]
