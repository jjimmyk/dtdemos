from arcgis.gis import GIS
from pathlib import Path

PORTAL = "https://www.arcgis.com"
USER = os.environ.get("AGO_USER") or "jamespking47"
PASS = os.environ.get("AGO_PASS") or "Kiyalshtin47!"
ROOT = Path("/Users/jimmyking/Downloads/Firefighting Command Center for Lahaina (SkyTL Data)/SkyTL Data 82125")

gis = GIS(PORTAL, USER, PASS)

def add_publish_share(path: Path, title: str):
    item = gis.content.add({"title": title, "type": "GeoJson" if path.suffix.lower()==".geojson" else "KML"}, data=str(path))
    fl_item = item.publish()  # Hosted Feature Layer
    fl_item.share(everyone=True)
    print("Published:", title, "→", fl_item.url)

# Risk models (GeoJSON)
for p in (ROOT / "riskMap_timeSeries").glob("*.geojson"):
    add_publish_share(p, f"Risk {p.stem}")

# Wind models (GeoJSON)
for p in (ROOT / "windMap_timeSeries").glob("*.geojson"):
    add_publish_share(p, f"Wind {p.stem}")

# Optional: KMLs (large); consider converting to Feature Layers instead of using KML directly
for p in ROOT.rglob("*.kml"):
    add_publish_share(p, f"KML {p.stem}")