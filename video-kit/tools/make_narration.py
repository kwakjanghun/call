"""content/scenes.json의 나레이션을 edge-tts로 합성하고 장면 길이를 계산한다.

사용법:  python tools/make_narration.py
필요:    pip install edge-tts mutagen
산출:    public/audio/s1.mp3 ... + src/scenes.generated.json
"""
import asyncio
import json
import os
import sys

try:
    import edge_tts
    from mutagen.mp3 import MP3
except ImportError:
    sys.exit("pip install edge-tts mutagen 먼저 실행해 주세요.")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content", "scenes.json")
AUDIO_DIR = os.path.join(ROOT, "public", "audio")
OUT = os.path.join(ROOT, "src", "scenes.generated.json")


async def main() -> None:
    with open(CONTENT, encoding="utf-8") as f:
        data = json.load(f)
    voice = data.get("voice", "ko-KR-InJoonNeural")
    os.makedirs(AUDIO_DIR, exist_ok=True)

    generated = []
    for i, scene in enumerate(data["scenes"], start=1):
        name = f"s{i}.mp3"
        path = os.path.join(AUDIO_DIR, name)
        print(f"[{i}/{len(data['scenes'])}] {scene['title']} ...")
        await edge_tts.Communicate(scene["narration"], voice).save(path)
        dur = MP3(path).info.length
        generated.append({**scene, "audio": name, "durationSec": round(dur, 2)})

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({"footer": data.get("footer", ""), "scenes": generated}, f, ensure_ascii=False, indent=2)
    total = sum(s["durationSec"] for s in generated)
    print(f"완료 — 장면 {len(generated)}개, 나레이션 총 {total:.1f}초")
    print(f"다음 단계: npm run render")


asyncio.run(main())
