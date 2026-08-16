"""Baixa imagens do roteiro e gera ícones PWA."""
import struct
import urllib.request
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "images"
ICON_DIR = ROOT / "icons"

IMAGES = {
    "aeroporto": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Paris_-_Aerial_View%2C_La_Defense%2C_Eiffel_Tower%2C_Trocad%C3%A9ro%2C_Tour_Montparnasse%2C_Notre-Dame%2C_Les_Invalides%2C_Arc_de_Triomphe%2C_Louvre%2C_Sacr%C3%A9-C%C5%93ur%2C_Montmartre%2C_2015.jpg/800px-thumbnail.jpg",
    "bairro": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Street_in_Le_Marais%2C_Paris%2C_France.jpg/800px-Street_in_Le_Marais%2C_Paris%2C_France.jpg",
    "notredame": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Notre-Dame_de_Paris%2C_4_October_2017.jpg/800px-Notre-Dame_de_Paris%2C_4_October_2017.jpg",
    "seine": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Panorama_Pont_Neuf_%28Paris%29.jpg/800px-Panorama_Pont_Neuf_%28Paris%29.jpg",
    "jantar": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Paris_cafe_terrace.jpg/800px-Paris_cafe_terrace.jpg",
    "cafe": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Croissant-Petit-Dejeuner.jpg/800px-Croissant-Petit-Dejeuner.jpg",
    "louvre": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/800px-Louvre_Museum_Wikimedia_Commons.jpg",
    "tuileries": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Tuileries_Garden%2C_Paris%2C_France_-_panoramio.jpg/800px-Tuileries_Garden%2C_Paris%2C_France_-_panoramio.jpg",
    "torre": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
    "trocadero": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Tour_Eiffel%2C_Paris%2C_from_Trocadero%2C_June_2010.jpg/800px-Tour_Eiffel%2C_Paris%2C_from_Trocadero%2C_June_2010.jpg",
    "arco": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Arc_de_Triomphe%2C_Paris_7_June_2014%2C_perspective-2.jpg/800px-Arc_de_Triomphe%2C_Paris_7_June_2014%2C_perspective-2.jpg",
    "champs": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Champs-Elysees_Daytime_%28cropped%29.jpg/800px-Champs-Elysees_Daytime_%28cropped%29.jpg",
    "montmartre": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Sacre_Coeur_paris.jpg/800px-Sacre_Coeur_paris.jpg",
    "disney": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Sleeping_Beauty_Castle_%28cropped%29.jpg/800px-Sleeping_Beauty_Castle_%28cropped%29.jpg",
    "orsay": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Le_Mus%C3%A9e_d%27Orsay%2C_Paris_May_2010.jpg/800px-Le_Mus%C3%A9e_d%27Orsay%2C_Paris_May_2010.jpg",
    "compras": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Galeries_Lafayette_dome%2C_Paris%2C_France.jpg/800px-Galeries_Lafayette_dome%2C_Paris%2C_France.jpg",
    "hotel": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/H%C3%B4tel_des_Invalides%2C_Paris%2C_France.jpg/800px-H%C3%B4tel_des_Invalides%2C_Paris%2C_France.jpg",
}


def png_chunk(tag: bytes, data: bytes) -> bytes:
    crc = zlib.crc32(tag + data) & 0xFFFFFFFF
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", crc)


def write_png(path: Path, size: int, navy=(31, 78, 121), gold=(201, 162, 39)):
    """Gera ícone PNG simples: fundo navy + torre dourada estilizada."""
    rows = []
    cx, cy = size // 2, size // 2
    tower_w = max(4, size // 10)
    tower_h = int(size * 0.42)
    base_y = int(size * 0.72)

    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            # Arco decorativo inferior
            if y > int(size * 0.78) and abs(x - cx) < int(size * 0.38):
                row.extend(gold)
                continue
            # Torre — corpo
            in_tower = (
                base_y - tower_h <= y <= base_y
                and cx - tower_w <= x <= cx + tower_w
            )
            # Topo triangular
            rel_y = y - (base_y - tower_h)
            top_limit = tower_w + rel_y // 3
            in_top = (
                base_y - tower_h <= y <= base_y - tower_h // 2
                and abs(x - cx) <= max(1, top_limit - (y - (base_y - tower_h)) // 2)
            )
            # Antena
            in_antenna = abs(x - cx) <= 1 and base_y - tower_h - size // 12 <= y < base_y - tower_h
            if in_tower or in_top or in_antenna:
                row.extend(gold)
            else:
                row.extend(navy)
        rows.append(bytes(row))

    raw = b"".join(rows)
    compressed = zlib.compress(raw, 9)
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n"
    png += png_chunk(b"IHDR", ihdr)
    png += png_chunk(b"IDAT", compressed)
    png += png_chunk(b"IEND", b"")
    path.write_bytes(png)


def download_images():
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    for name, url in IMAGES.items():
        dest = IMG_DIR / f"{name}.jpg"
        if dest.exists() and dest.stat().st_size > 1000:
            print(f"skip {name}")
            continue
        print(f"download {name}...")
        req = urllib.request.Request(url, headers={"User-Agent": "ParisTripApp/1.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            dest.write_bytes(resp.read())


def generate_icons():
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    write_png(ICON_DIR / "icon-192.png", 192)
    write_png(ICON_DIR / "icon-512.png", 512)
    # OG image — usa torre se existir, senão ícone grande
    og_src = IMG_DIR / "torre.jpg"
    og_dest = ROOT / "og-image.jpg"
    if og_src.exists():
        og_dest.write_bytes(og_src.read_bytes())
    else:
        write_png(og_dest, 512)


if __name__ == "__main__":
    download_images()
    generate_icons()
    print("Assets prontos.")
