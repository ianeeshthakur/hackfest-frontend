import re

with open('lib/disruptionContext.jsx', 'r') as f:
    content = f.read()

# Add recoveryOptions to factory disruptions
content = content.replace(
    '    propagationSteps: [\n      { text: "Power failure halts Spinning Line"',
    '    recoveryOptions: [\n      { title: "Shift to Alternate Facility", delay: "+1h", risk: 15, recommended: true },\n      { title: "Run on Backup Generators", delay: "+4h", risk: 45 },\n      { title: "Wait for Grid Restoration", delay: "+8h", risk: 65 }\n    ],\n    propagationSteps: [\n      { text: "Power failure halts Spinning Line"'
)

content = content.replace(
    '    propagationSteps: [\n      { text: "Machine M-4 offline"',
    '    recoveryOptions: [\n      { title: "Reroute to Line 4", delay: "+2h", risk: 22, recommended: true },\n      { title: "Expedite Maintenance", delay: "+6h", risk: 40 },\n      { title: "Subcontract Production", delay: "+12h", risk: 55 }\n    ],\n    propagationSteps: [\n      { text: "Machine M-4 offline"'
)

content = content.replace(
    '    propagationSteps: [\n      { text: "Factory production capacity -24%"',
    '    recoveryOptions: [\n      { title: "Rebalance Production", delay: "+2h", risk: 31, recommended: true },\n      { title: "Split Order", delay: "+4h", risk: 39 },\n      { title: "Wait", delay: "+6h", risk: 52 }\n    ],\n    propagationSteps: [\n      { text: "Factory production capacity -24%"'
)

content = content.replace(
    '    propagationSteps: [\n      { text: "Supplier T-4 misses shipment"',
    '    recoveryOptions: [\n      { title: "Source from Supplier K-2", delay: "+3h", risk: 28, recommended: true },\n      { title: "Air Freight Current Order", delay: "+6h", risk: 35 },\n      { title: "Wait for Original Shipment", delay: "+24h", risk: 75 }\n    ],\n    propagationSteps: [\n      { text: "Supplier T-4 misses shipment"'
)

content = content.replace(
    '    propagationSteps: [\n      { text: "Transit delay on NH-44"',
    '    recoveryOptions: [\n      { title: "Reroute via Mundra Port", delay: "+12h", risk: 30, recommended: true },\n      { title: "Air Freight Critical Units", delay: "+24h", risk: 45 },\n      { title: "Wait in Current Queue", delay: "+72h", risk: 85 }\n    ],\n    propagationSteps: [\n      { text: "Transit delay on NH-44"'
)

# For shipment configs
content = content.replace(
    '    propagationSteps: [\n      { text: "Nhava Sheva congestion detected"',
    '    recoveryOptions: [\n      { title: "Reroute via Mundra Port", delay: "+24h", risk: 25, recommended: true },\n      { title: "Air Freight Priority Units", delay: "+48h", risk: 40 },\n      { title: "Wait for Berthing Window", delay: "+120h", risk: 80 }\n    ],\n    propagationSteps: [\n      { text: "Nhava Sheva congestion detected"'
)

content = content.replace(
    '    propagationSteps: [\n      { text: "Suez Canal transit restricted"',
    '    recoveryOptions: [\n      { title: "Divert via Cape of Good Hope", delay: "+336h", risk: 40, recommended: true },\n      { title: "Air Freight Critical Cargo", delay: "+72h", risk: 65 },\n      { title: "Hold at Anchorage", delay: "TBD", risk: 90 }\n    ],\n    propagationSteps: [\n      { text: "Suez Canal transit restricted"'
)

content = content.replace(
    '    propagationSteps: [\n      { text: "Typhoon warning issued"',
    '    recoveryOptions: [\n      { title: "Secure Safe Anchorage", delay: "+48h", risk: 15, recommended: true },\n      { title: "Reroute around Storm System", delay: "+72h", risk: 35 },\n      { title: "Proceed with Caution", delay: "+24h", risk: 85 }\n    ],\n    propagationSteps: [\n      { text: "Typhoon warning issued"'
)

content = content.replace(
    '    propagationSteps: [\n      { text: "Dock workers strike active"',
    '    recoveryOptions: [\n      { title: "Divert to Port of Rotterdam", delay: "+72h", risk: 25, recommended: true },\n      { title: "Wait for Strike Resolution", delay: "+168h", risk: 75 },\n      { title: "Air Freight Ex-Factory", delay: "+48h", risk: 60 }\n    ],\n    propagationSteps: [\n      { text: "Dock workers strike active"'
)

with open('lib/disruptionContext.jsx', 'w') as f:
    f.write(content)
