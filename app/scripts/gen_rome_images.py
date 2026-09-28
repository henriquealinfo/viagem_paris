from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "images"
LABELS = {
    "panteao": ("Panteao", "Roma"),
    "navona": ("Piazza Navona", "Roma"),
    "campo": ("Campo de' Fiori", "Roma"),
    "trevi": ("Fontana di Trevi", "Roma"),
    "spagna": ("Piazza di Spagna", "Roma"),
    "trastevere": ("Trastevere", "Roma"),
    "vaticano": ("Vaticano", "Roma"),
    "saopedro": ("Sao Pedro", "Vaticano"),
    "coliseu": ("Coliseu", "Roma"),
    "forum": ("Forum Romano", "Roma"),
    "palatino": ("Palatino", "Roma"),
    "campidoglio": ("Campidoglio", "Roma"),
    "vittoriano": ("Vittoriano", "Roma"),
    "gueto": ("Gueto Judaico", "Roma"),
    "opera": ("Opera Garnier", "Paris"),
}

for name, (label, city) in LABELS.items():
    start, end = ("#8B3A2A", "#C4784A") if city != "Paris" else ("#1F4E79", "#2a5f8f")
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="{start}"/><stop offset="100%" stop-color="{end}"/>
  </linearGradient></defs>
  <rect width="800" height="480" fill="url(#g)"/>
  <text x="400" y="240" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" fill="#F5E6C8" font-weight="700">{label}</text>
  <text x="400" y="290" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#fff" opacity="0.85">{city}</text>
</svg>
"""
    (ROOT / f"{name}.svg").write_text(svg, encoding="utf-8")

print(f"Created {len(LABELS)} SVGs")
