from pathlib import Path
from PIL import Image, ImageDraw

out = Path(__file__).parent
for size in (180, 192, 512):
    image = Image.new("RGBA", (size, size), "#1673a8")
    draw = ImageDraw.Draw(image)
    pad = round(size * 0.12)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=round(size * 0.20), fill="#1673a8")
    draw.ellipse((pad, pad, size - pad, size - pad), fill="#ffffff26")
    center = size // 2
    arm = round(size * 0.12)
    thick = round(size * 0.075)
    draw.rounded_rectangle((center - thick // 2, center - arm, center + thick // 2, center + arm), radius=thick // 2, fill="white")
    draw.rounded_rectangle((center - arm, center - thick // 2, center + arm, center + thick // 2), radius=thick // 2, fill="white")
    image.save(out / f"icon-{size}.png", "PNG", optimize=True)
