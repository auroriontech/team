#!/bin/bash

# Monitor script for team.homedevenv.com
echo "🔍 Team Development Environment Monitor"
echo "======================================="
echo "$(date)"
echo ""

# Check container status
echo "📦 Container Status:"
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Check health endpoints
echo "🏥 Health Checks:"

# Astro container
if curl -s -f http://localhost:4321/test > /dev/null; then
    echo "✅ Astro dev server: Healthy"
else
    echo "❌ Astro dev server: Unhealthy"
fi

# Caddy proxy
CADDY_PORT=$(docker-compose port team 80 2>/dev/null | cut -d: -f2)
if [ ! -z "$CADDY_PORT" ] && curl -s -f http://localhost:$CADDY_PORT > /dev/null; then
    echo "✅ Caddy proxy: Healthy"
else
    echo "❌ Caddy proxy: Unhealthy"
fi

# External access
if curl -s -f http://team.homedevenv.com --connect-timeout 5 > /dev/null; then
    echo "✅ External access (team.homedevenv.com): Available"
else
    echo "⚠️  External access (team.homedevenv.com): Unavailable"
fi

# Test page
if curl -s -f http://team.homedevenv.com/test --connect-timeout 5 > /dev/null; then
    echo "✅ Test page: Accessible"
else
    echo "❌ Test page: Inaccessible"
fi

echo ""

# Show resource usage
echo "💻 Resource Usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
echo ""

# Recent logs summary
echo "📝 Recent Activity (last 5 minutes):"
echo "Astro logs:"
docker-compose logs --since 5m astro-dev | tail -3
echo ""
echo "Caddy logs:"
docker-compose logs --since 5m team | tail -3

echo ""
echo "🎯 Monitor complete at $(date)"