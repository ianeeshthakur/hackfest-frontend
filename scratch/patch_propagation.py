import re

with open('lib/disruptionContext.jsx', 'r') as f:
    content = f.read()

# Add propagationSteps to powerCut
content = content.replace(
    '    buyerView:',
    '    propagationSteps: [\n      { text: "Power failure halts Spinning Line", highlight: true },\n      { text: "18% total capacity lost" },\n      { text: "2 orders delayed", highlight: true },\n      { text: "Expected restoration +4h" },\n      { text: "Backup generators inadequate", success: false }\n    ],\n    buyerView:'
)

content = content.replace(
    '    machineStatus: "OFFLINE",\n    buyerView:',
    '    machineStatus: "OFFLINE",\n    propagationSteps: [\n      { text: "Machine M-4 offline", highlight: true },\n      { text: "Production line 3 halted" },\n      { text: "31% capacity reduction", highlight: true },\n      { text: "7,800 units delayed" },\n      { text: "Maintenance dispatched, ETA 8h", success: true }\n    ],\n    buyerView:'
)

content = content.replace(
    '    workerAvailability: "76%",\n    buyerView:',
    '    workerAvailability: "76%",\n    propagationSteps: [\n      { text: "Factory production capacity -24%", highlight: true },\n      { text: "3 orders exposed" },\n      { text: "8,500 units delayed", highlight: true },\n      { text: "Expected delay +6h" },\n      { text: "Alternate capacity identified", success: true }\n    ],\n    buyerView:'
)

content = content.replace(
    '    inventoryCoverage: "2.4 DAYS",\n    buyerView:',
    '    inventoryCoverage: "2.4 DAYS",\n    propagationSteps: [\n      { text: "Supplier T-4 misses shipment", highlight: true },\n      { text: "Inventory buffers depleted" },\n      { text: "37% capacity at risk", highlight: true },\n      { text: "Expected delay +12h" },\n      { text: "Alternative sourcing activated", success: true }\n    ],\n    buyerView:'
)

content = content.replace(
    '    aiResponse: "A logistics delay has affected shipment timing. Alternative routing and delivery windows are being evaluated.",\n    buyerView:',
    '    aiResponse: "A logistics delay has affected shipment timing. Alternative routing and delivery windows are being evaluated.",\n    propagationSteps: [\n      { text: "Transit delay on NH-44", highlight: true },\n      { text: "Shipment stuck in queue" },\n      { text: "15,000 units delayed", highlight: true },\n      { text: "Expected delay +48h" },\n      { text: "Rerouting via alternate port evaluated", success: true }\n    ],\n    buyerView:'
)

# For shipment configs, add propagationSteps
content = content.replace(
    '    buyerView: {\n      title: "SHIPMENT DELAY",\n      description: "Port congestion is delaying your ocean freight."\n    },',
    '    propagationSteps: [\n      { text: "Nhava Sheva congestion detected", highlight: true },\n      { text: "Vessel berthing delayed" },\n      { text: "15,000 units delayed", highlight: true },\n      { text: "Expected delay +120h" },\n      { text: "Rerouting to alternate port", success: true }\n    ],\n    buyerView: {\n      title: "SHIPMENT DELAY",\n      description: "Port congestion is delaying your ocean freight."\n    },'
)

content = content.replace(
    '    buyerView: {\n      title: "CRITICAL SHIPMENT DELAY",\n      description: "Global route diversion is adding 14+ days to transit."\n    },',
    '    propagationSteps: [\n      { text: "Suez Canal transit restricted", highlight: true },\n      { text: "Global shipping lanes impacted" },\n      { text: "45,000 units at risk", highlight: true },\n      { text: "Expected delay +336h" },\n      { text: "Diverting to Cape of Good Hope", success: true }\n    ],\n    buyerView: {\n      title: "CRITICAL SHIPMENT DELAY",\n      description: "Global route diversion is adding 14+ days to transit."\n    },'
)

content = content.replace(
    '    buyerView: {\n      title: "WEATHER DELAY",\n      description: "Storms are causing minor transit delays."\n    },',
    '    propagationSteps: [\n      { text: "Typhoon warning issued", highlight: true },\n      { text: "Port operations suspended" },\n      { text: "20,000 units halted", highlight: true },\n      { text: "Expected delay +48h" },\n      { text: "Safe anchorage secured", success: true }\n    ],\n    buyerView: {\n      title: "WEATHER DELAY",\n      description: "Storms are causing minor transit delays."\n    },'
)

content = content.replace(
    '    buyerView: {\n      title: "PORT STRIKE DELAY",\n      description: "Labor strike is preventing cargo unloading."\n    },',
    '    propagationSteps: [\n      { text: "Dock workers strike active", highlight: true },\n      { text: "Cargo unloading halted" },\n      { text: "12,000 units stuck", highlight: true },\n      { text: "Expected delay +168h" },\n      { text: "Overland transport initiated", success: true }\n    ],\n    buyerView: {\n      title: "PORT STRIKE DELAY",\n      description: "Labor strike is preventing cargo unloading."\n    },'
)

with open('lib/disruptionContext.jsx', 'w') as f:
    f.write(content)
