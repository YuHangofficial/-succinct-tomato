from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ICONS = ROOT / "src-tauri" / "icons"


def make_icon(size: int) -> Image.Image:
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    base_draw = ImageDraw.Draw(base)

    margin = int(size * 0.08)
    radius = int(size * 0.24)
    rect = [margin, margin, size - margin, size - margin]

    for y in range(size):
        blend = y / max(size - 1, 1)
        top = (213, 149, 125)
        bottom = (140, 166, 163)
        color = tuple(int(top[i] * (1 - blend) + bottom[i] * blend) for i in range(3)) + (255,)
        base_draw.line([(0, y), (size, y)], fill=color)

    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle(rect, radius=radius, fill=255)
    image = Image.composite(base, image, mask)

    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse(
        [int(size * 0.18), int(size * 0.14), int(size * 0.82), int(size * 0.78)],
        fill=(255, 255, 255, 52),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(radius=max(6, size // 18)))
    image.alpha_composite(glow)

    ring_width = max(4, size // 18)
    ring_box = [int(size * 0.25), int(size * 0.25), int(size * 0.75), int(size * 0.75)]
    draw = ImageDraw.Draw(image)
    draw.arc(ring_box, start=210, end=500, fill=(255, 248, 244, 242), width=ring_width)

    stem_width = max(4, size // 14)
    stem_height = int(size * 0.18)
    stem_x = size // 2
    stem_top = int(size * 0.39)
    stem_bottom = stem_top + stem_height
    draw.rounded_rectangle(
        [
            stem_x - stem_width // 2,
            stem_top,
            stem_x + stem_width // 2,
            stem_bottom,
        ],
        radius=stem_width // 2,
        fill=(255, 249, 245, 238),
    )
    draw.ellipse(
        [stem_x - stem_width // 2, int(size * 0.29), stem_x + stem_width // 2, stem_top],
        fill=(255, 249, 245, 238),
    )

    return image


def main() -> None:
    ICONS.mkdir(parents=True, exist_ok=True)

    sizes = [32, 128, 256]
    rendered = {size: make_icon(size) for size in sizes}
    rendered[32].save(ICONS / "32x32.png")
    rendered[128].save(ICONS / "128x128.png")
    rendered[256].save(ICONS / "128x128@2x.png")
    rendered[256].save(ICONS / "icon.png")
    rendered[256].save(ICONS / "icon.ico", sizes=[(256, 256), (128, 128), (64, 64), (32, 32), (16, 16)])


if __name__ == "__main__":
    main()
