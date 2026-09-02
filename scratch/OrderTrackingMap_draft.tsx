"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Assuming DisruptionContext is here based on project structure
import { disruptionConfigs } from "@/lib/disruptionContext";
// We need to import the context. Let's write the context import carefully.
// Wait, lib/disruptionContext exports `DisruptionProvider`, but the context itself might not be exported.
// Wait, I saw `const DisruptionContext = createContext(null);` but it wasn't exported in the snippet.
// Actually, I can just mock the context or check if it's exported. Let me check lib/disruptionContext.jsx.
