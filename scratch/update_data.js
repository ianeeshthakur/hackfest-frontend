const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/clusterData.js');
let content = fs.readFileSync(filePath, 'utf8');

// Use a simple hash to generate deterministic pseudo-random values
function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Generate token: "F-" + 5 uppercase alphanumeric
function getToken(id) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "F-";
  let h = hashStr(id + "token");
  for (let i=0; i<5; i++) {
    token += chars[h % chars.length];
    h = Math.floor(h / chars.length);
    if (h === 0) h = hashStr(id + i);
  }
  return token;
}

content = content.replace(/\{ id:"([^"]+)", name:"([^"]+)",\s*clusterId:"([^"]+)",\s*type:"([^"]+)",\s*latitude:([0-9.]+),\s*longitude:([0-9.]+),\s*status:"([^"]+)",\s*capacity:([0-9]+),\s*disruption:([^}]+) \}/g, (match, id, name, clusterId, type, lat, lng, status, cap, dis) => {
  const load = 60 + (hashStr(id + "load") % 35);
  const orders = 1 + (hashStr(id + "orders") % 8);
  const token = getToken(id);
  return `{ id:"${id}", name:"${name}", clusterId:"${clusterId}", type:"${type}", latitude:${lat}, longitude:${lng}, status:"${status}", capacity:${cap}, currentLoad:${load}, orders:${orders}, token:"${token}", disruption:${dis} }`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated factories in clusterData.js");
