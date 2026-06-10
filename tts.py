import sys
import asyncio
import edge_tts

async def amain():
    if len(sys.argv) < 3:
        print("Usage: python tts.py <text> <voice> [rate]", file=sys.stderr)
        sys.exit(1)
    
    text = sys.argv[1]
    voice = sys.argv[2]
    rate = sys.argv[3] if len(sys.argv) > 3 else "+0%"
    
    if not text.strip():
        return
        
    try:
        communicate = edge_tts.Communicate(text, voice, rate=rate)
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                sys.stdout.buffer.write(chunk["data"])
                sys.stdout.buffer.flush()
    except Exception as e:
        print(f"Error in TTS: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(amain())
