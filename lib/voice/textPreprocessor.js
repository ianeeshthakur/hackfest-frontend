/**
 * Preprocesses raw text from the AI to sound more natural when spoken by a TTS engine.
 */

const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
              "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function numberToWords(num) {
  if (num === 0) return "zero";
  if (num < 0) return "minus " + numberToWords(-num);
  let words = "";
  
  if (Math.floor(num / 1000000) > 0) {
    words += numberToWords(Math.floor(num / 1000000)) + " million ";
    num %= 1000000;
  }
  if (Math.floor(num / 1000) > 0) {
    words += numberToWords(Math.floor(num / 1000)) + " thousand ";
    num %= 1000;
  }
  if (Math.floor(num / 100) > 0) {
    words += numberToWords(Math.floor(num / 100)) + " hundred ";
    num %= 100;
  }
  if (num > 0) {
    if (words !== "" && words.includes("hundred")) {
       words += "and ";
    }
    if (num < 20) {
      words += ones[num];
    } else {
      words += tens[Math.floor(num / 10)];
      if (num % 10 > 0) {
        words += "-" + ones[num % 10];
      }
    }
  }
  return words.trim();
}

function spellDigits(str) {
  const digitMap = {'0':'zero', '1':'one', '2':'two', '3':'three', '4':'four', '5':'five', '6':'six', '7':'seven', '8':'eight', '9':'nine'};
  return str.split('').map(c => digitMap[c] || c).join(' ');
}

function spellID(id) {
  return id.split('').map(c => {
    if (/[0-9]/.test(c)) return spellDigits(c);
    if (/[a-zA-Z]/.test(c)) return c;
    return '';
  }).filter(Boolean).join(' ');
}

export function preprocessForSpeech(text) {
  if (!text) return "";

  let processed = text;

  // 1. Remove markdown formatting (bold, italic, links)
  processed = processed.replace(/\*\*(.*?)\*\*/g, "$1");
  processed = processed.replace(/\*(.*?)\*/g, "$1");
  processed = processed.replace(/\[(.*?)\]\(.*?\)/g, "$1");

  // 2. Context-Aware Templates (Match specific complex UI strings)
  
  // "Surat Cluster | 12 factories | 11 operational | 1 down"
  processed = processed.replace(/(.*?)\s+Cluster\s+\|\s+(\d+)\s+factories\s+\|\s+(\d+)\s+operational\s+\|\s+(\d+)\s+down/gi, (match, cluster, total, op, down) => {
    return `${cluster.trim()} currently has ${total} factories. ${op} are operational, and ${down} is down.`;
  });
  
  // "F-003 is down. Capacity: 9,000 units/day. Orders affected: 5."
  processed = processed.replace(/(?:Factory\s+)?\b(F-[A-Z0-9]+)\b\s+is\s+down\.\s*(?:Capacity:)?\s*([\d,]+)\s*units\/day\.\s*(?:Orders affected:)?\s*(\d+)\./gi, (match, id, cap, orders) => {
    return `${id} is currently down. Its capacity is ${cap.replace(/,/g, '')} units per day, and ${orders} orders are affected.`;
  });

  // "Factory F-X7K92 status operational capacity 3200 units/day current load 61 percent"
  processed = processed.replace(/Factory\s+(F-[A-Z0-9]+)\s+status\s+operational\s+capacity\s+([\d,]+)\s+units\/day\s+current\s+load\s+(\d+)\s+percent/gi, (match, id, cap, load) => {
    return `${id} is currently operational. It has ${cap.replace(/,/g, '')} units per day available, with a current load of ${load} percent.`;
  });

  // 3. IDs and Identifiers
  processed = processed.replace(/(?:Factory\s+)?\bF-X7K92\b/gi, "Factory X seven K nine two");
  processed = processed.replace(/(?:Factory\s+)?\bF-020\b/gi, "Factory F zero two zero");
  processed = processed.replace(/(?:Factory\s+)?\bF-003\b/gi, "Factory F zero zero three");
  
  // Generic fallback for other F- IDs
  processed = processed.replace(/(?:Factory\s+)?\bF-([A-Z0-9]+)\b/gi, (match, p1) => {
    return `Factory ${spellID(p1)}`;
  });

  // 4. Units and Symbols
  processed = processed.replace(/(\d+(?:\.\d+)?)%/g, "$1 percent");
  processed = processed.replace(/([\d,]+)\s*units\/day/gi, "$1 units per day");
  processed = processed.replace(/([\d,]+)\s*km\b/gi, "$1 kilometers");
  
  // Time / Delay Expressions
  processed = processed.replace(/\+1\s*h\b/gi, "an additional hour");
  processed = processed.replace(/\+(\d+(?:\.\d+)?)\s*h\b/gi, "an additional $1 hours");
  processed = processed.replace(/\+1\s*day\b/gi, "an additional day");
  processed = processed.replace(/\+(\d+(?:\.\d+)?)\s*days\b/gi, "an additional $1 days");
  
  processed = processed.replace(/\b1\s*h\b/gi, "one hour");
  processed = processed.replace(/\b(\d+(?:\.\d+)?)\s*h\b/gi, "$1 hours");

  // ETA parsing
  processed = processed.replace(/\bETA:\s*(.*?)(?=\.|$)/gi, "The estimated time of arrival is $1");
  
  // 5. Terminology
  processed = processed.replace(/\bETA\b/gi, "estimated time of arrival");
  processed = processed.replace(/\bDPP\b/gi, "Digital Product Passport");

  // 6. Remove UI Metadata prefixes
  processed = processed.replace(/\b(?:Status|Column|Card|Section):\s*/gi, "");

  // 7. Status Terms (Target specific machine-like words)
  processed = processed.replace(/\bDOWN\b/g, "currently down");
  processed = processed.replace(/\bOPERATIONAL\b/g, "currently operational");
  processed = processed.replace(/\bWARNING\b/g, "requires attention");
  processed = processed.replace(/\bHIGH\b/g, "high risk");
  processed = processed.replace(/\bLOW\b/g, "low risk");

  // 8. General Number Pronunciation
  processed = processed.replace(/\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)\b/g, (match) => {
    const numStr = match.replace(/,/g, '');
    const num = parseFloat(numStr);
    if (isNaN(num)) return match;
    
    if (Number.isInteger(num)) {
      return numberToWords(num);
    } else {
      const parts = numStr.split('.');
      return numberToWords(parseInt(parts[0], 10)) + " point " + spellDigits(parts[1]);
    }
  });

  // 9. Cleanup & Pauses
  // Replace pipes with periods to create sentence boundaries
  processed = processed.replace(/\|/g, ". ");
  // Ensure we don't have multiple periods
  processed = processed.replace(/\.{2,}/g, ".");
  // Replace newlines with periods if they don't already have punctuation
  processed = processed.replace(/([^.!?])\n+/g, "$1. ");
  
  // Final cleanup of excessive whitespace
  processed = processed.replace(/\s{2,}/g, " ").trim();
  
  // Fix weird cases where period has a space before it
  processed = processed.replace(/\s+\./g, ".");

  return processed;
}
