#!/bin/bash

# Test script for team.homedevenv.com
echo "🧪 Testing team.homedevenv.com accessibility..."

# Test local container directly
echo "📦 Testing local Astro container..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:4321 | grep -q "200"; then
    echo "✅ Astro container responding on localhost:4321"
else
    echo "❌ Astro container not responding on localhost:4321"
fi

# Test through Caddy proxy
echo "🌐 Testing Caddy proxy..."
CADDY_PORT=$(docker-compose port team 80 | cut -d: -f2)
if curl -s -o /dev/null -w "%{http_code}" http://localhost:$CADDY_PORT | grep -q "200"; then
    echo "✅ Caddy proxy responding on localhost:$CADDY_PORT"
else
    echo "❌ Caddy proxy not responding on localhost:$CADDY_PORT"
fi

# Test team.homedevenv.com (if accessible)
echo "🌍 Testing team.homedevenv.com..."
if curl -s -o /dev/null -w "%{http_code}" http://team.homedevenv.com --connect-timeout 5 | grep -q "200"; then
    echo "✅ team.homedevenv.com is accessible!"
else
    echo "⚠️  team.homedevenv.com not accessible (may require network tunnel)"
fi

# Test container health
echo "🏥 Checking container health..."
docker-compose ps

# Show recent logs
echo "📝 Recent Astro logs:"
docker-compose logs --tail 5 astro-dev

echo "📝 Recent Caddy logs:"
docker-compose logs --tail 5 team

echo "🎯 Test complete!"