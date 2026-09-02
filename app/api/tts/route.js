import { NextResponse } from 'next/server';

function createWavHeader(dataLength, sampleRate = 24000) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // RIFF identifier 'RIFF'
  view.setUint32(0, 0x52494646, false);
  // file length
  view.setUint32(4, 36 + dataLength, true);
  // WAVE identifier 'WAVE'
  view.setUint32(8, 0x57415645, false);
  // fmt chunk identifier 'fmt '
  view.setUint32(12, 0x666D7420, false);
  // fmt chunk length
  view.setUint32(16, 16, true);
  // sample format (1 is PCM)
  view.setUint16(20, 1, true);
  // channel count (1 for mono)
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier 'data'
  view.setUint32(36, 0x64617461, false);
  // data chunk length
  view.setUint32(40, dataLength, true);

  return Buffer.from(buffer);
}

export async function POST(req) {
  try {
    const { text, voice = 'Aoede' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY missing. Falling back to client-side synthesis.");
      return NextResponse.json({ error: 'TTS_API_KEY_MISSING' }, { status: 503 });
    }

    // Call Gemini 2.5 Flash TTS
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{ role: "user", parts: [{ text: text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voice // e.g. "Aoede" for smooth, professional, calm voice
            }
          }
        }
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini TTS Error:", JSON.stringify(errorData, null, 2));
      return NextResponse.json({ error: 'TTS API call failed' }, { status: response.status });
    }

    const data = await response.json();
    
    // Extract base64 audio data
    const inlineData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    if (!inlineData || !inlineData.data) {
      throw new Error('No audio data returned from Gemini TTS');
    }

    const pcmBuffer = Buffer.from(inlineData.data, 'base64');
    
    // Create WAV container
    const wavHeader = createWavHeader(pcmBuffer.length, 24000);
    const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
    
    return new NextResponse(wavBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': wavBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating Gemini TTS:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
