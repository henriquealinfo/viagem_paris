from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "images"
ICONS = {
    "aeroporto": "plane",
    "bairro": "street",
    "notredame": "church",
    "seine": "river",
    "jantar": "food",
    "cafe": "coffee",
    "louvre": "art",
    "tuileries": "garden",
    "torre": "tower",
    "trocadero": "sunset",
    "arco": "arch",
    "champs": "shop",
    "montmartre": "hill",
    "disney": "castle",
    "orsay": "museum",
    "compras": "bags",
    "hotel": "bed",
    "versailles": "crown",
}

LABELS = {
    "aeroporto": "Paris",
    "bairro": "Marais",
    "notredame": "Notre-Dame",
    "seine": "Sena",
    "jantar": "Bistro",
    "cafe": "Cafe",
    "louvre": "Louvre",
    "tuileries": "Tuileries",
    "torre": "Eiffel",
    "trocadero": "Trocadero",
    "arco": "Arc de Triomphe",
    "champs": "Champs-Elysees",
    "montmartre": "Montmartre",
    "disney": "Disney",
    "orsay": "Orsay",
    "compras": "Compras",
    "hotel": "Hotel",
    "versailles": "Versailles",
}

for name in ICONS:
    label = LABELS[name]
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#1F4E79"/><stop offset="100%" stop-color="#2a5f8f"/>
  </linearGradient></defs>
  <rect width="800" height="480" fill="url(#g)"/>
  <text x="400" y="250" text-anchor="middle" font-family="system-ui,sans-serif" font-size="32" fill="#C9A227" font-weight="700">{label}</text>
  <text x="400" y="300" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#fff" opacity="0.85">Paris</text>
</svg>"""
    (ROOT / f"{name}.svg").write_text(svg, encoding="utf-8")

print(f"Created {len(ICONS)} SVGs")
