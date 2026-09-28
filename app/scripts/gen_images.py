from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "images"

PARIS = ("#1F4E79", "#2a5f8f", "#C9A227")
ROMA = ("#8B3A2A", "#C4784A", "#F5E6C8")

CARDS = {
    "aeroporto": ("Aeroporto", "Viagem", PARIS),
    "bairro": ("Bairro", "Paris", PARIS),
    "notredame": ("Notre-Dame", "Paris", PARIS),
    "seine": ("Sena", "Paris", PARIS),
    "jantar": ("Jantar", "Europa", PARIS),
    "cafe": ("Cafe", "Europa", PARIS),
    "louvre": ("Louvre", "Paris", PARIS),
    "tuileries": ("Tuileries", "Paris", PARIS),
    "torre": ("Torre Eiffel", "Paris", PARIS),
    "trocadero": ("Trocadero", "Paris", PARIS),
    "arco": ("Arco do Triunfo", "Paris", PARIS),
    "champs": ("Champs-Elysees", "Paris", PARIS),
    "montmartre": ("Montmartre", "Paris", PARIS),
    "disney": ("Disneyland", "Paris", PARIS),
    "orsay": ("Orsay", "Paris", PARIS),
    "compras": ("Galeries Lafayette", "Paris", PARIS),
    "hotel": ("Hospedagem", "Europa", PARIS),
    "versailles": ("Versalhes", "Paris", PARIS),
    "placeholder": ("Foto", "Roteiro", PARIS),
    "opera": ("Opera Garnier", "Paris", PARIS),
    "panteao": ("Panteao", "Roma", ROMA),
    "navona": ("Piazza Navona", "Roma", ROMA),
    "campo": ("Campo de' Fiori", "Roma", ROMA),
    "trevi": ("Fontana di Trevi", "Roma", ROMA),
    "spagna": ("Piazza di Spagna", "Roma", ROMA),
    "trastevere": ("Trastevere", "Roma", ROMA),
    "vaticano": ("Vaticano", "Roma", ROMA),
    "saopedro": ("Sao Pedro", "Vaticano", ROMA),
    "coliseu": ("Coliseu", "Roma", ROMA),
    "forum": ("Forum Romano", "Roma", ROMA),
    "palatino": ("Palatino", "Roma", ROMA),
    "campidoglio": ("Campidoglio", "Roma", ROMA),
    "vittoriano": ("Vittoriano", "Roma", ROMA),
    "gueto": ("Gueto Judaico", "Roma", ROMA),
}

for name, (label, city, (c1, c2, ink)) in CARDS.items():
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="{c1}"/><stop offset="100%" stop-color="{c2}"/>
  </linearGradient></defs>
  <rect width="800" height="480" fill="url(#g)"/>
  <text x="400" y="240" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" fill="{ink}" font-weight="700">{label}</text>
  <text x="400" y="290" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#fff" opacity="0.85">{city}</text>
</svg>
"""
    (ROOT / f"{name}.svg").write_text(svg, encoding="utf-8")

print(f"Created {len(CARDS)} SVGs")
