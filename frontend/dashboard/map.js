const zones = [
  { id: 'A1', congestion: 'low', x: 12, y: 20 },
  { id: 'B4', congestion: 'medium', x: 48, y: 38 },
  { id: 'C7', congestion: 'high', x: 76, y: 52 }
];

const map = document.getElementById('traffic-map');
const feed = document.getElementById('live-feed');

zones.forEach((zone) => {
  const marker = document.createElement('div');
  marker.className = `zone ${zone.congestion}`;
  marker.style.left = `${zone.x}%`;
  marker.style.top = `${zone.y}%`;
  marker.textContent = `${zone.id} (${zone.congestion})`;
  map.appendChild(marker);
});

document.getElementById('zones-count').textContent = String(zones.length);
document.getElementById('incidents-count').textContent = '0';
document.getElementById('notifications-count').textContent = '0';

function appendFeed(message) {
  const now = new Date().toISOString();
  feed.textContent = `${feed.textContent}\n[${now}] ${message}`;
}

appendFeed('Dashboard initialized.');
appendFeed('WebSocket integration point ready for real-time notifications.');
appendFeed('Live congestion update stream hook ready.');
