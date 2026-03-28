import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

ALLOWED_CATEGORIES = {
    "rings": "rings",
    "ring": "rings",
    "necklace": "necklace",
    "necklaces": "necklace",
    "earrings": "earrings",
    "earring": "earrings",
    "bangles": "bangles",
    "bangle": "bangles",
}

DEFAULT_PRODUCTS = [
    {
        "id": "temple-necklace",
        "title": "Temple Gold Necklace",
        "category": "necklace",
        "price": 185000,
        "description": "A statement bridal necklace with temple-inspired detailing, layered structure, and a rich handcrafted finish for special occasions.",
        "image": "https://images.unsplash.com/photo-1662434923031-b9bf1b6c10e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        "created_at": "2026-03-20T08:30:00+00:00",
    },
    {
        "id": "bridal-layered-necklace",
        "title": "Bridal Layered Necklace",
        "category": "necklace",
        "price": 242000,
        "description": "A premium layered gold necklace designed for weddings, with a graceful drape and heirloom-inspired craftsmanship.",
        "image": "https://images.unsplash.com/photo-1672646856394-ec0dd6a4ccec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        "created_at": "2026-03-20T09:00:00+00:00",
    },
    {
        "id": "diamond-ring-set",
        "title": "Diamond Ring Set",
        "category": "rings",
        "price": 78000,
        "description": "An elegant pair of gold rings accented with subtle diamond detailing, crafted for engagement and milestone gifting.",
        "image": "https://images.unsplash.com/photo-1654521883301-070279dd0ae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwcmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        "created_at": "2026-03-20T09:30:00+00:00",
    },
    {
        "id": "heritage-ring",
        "title": "Heritage Gold Ring",
        "category": "rings",
        "price": 64000,
        "description": "A bold handcrafted ring with heritage-inspired pattern work, balanced proportions, and a polished 22K finish.",
        "image": "https://images.unsplash.com/photo-1708551413300-4ade9d984570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxnb2xkJTIwcmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        "created_at": "2026-03-20T10:00:00+00:00",
    },
    {
        "id": "floral-earrings",
        "title": "Floral Gold Earrings",
        "category": "earrings",
        "price": 42000,
        "description": "Lightweight floral earrings with a bright polished finish, designed to transition beautifully from festive wear to daily elegance.",
        "image": "https://images.unsplash.com/photo-1645994044915-a67a383f7c6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxnb2xkJTIwZWFycmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        "created_at": "2026-03-20T10:30:00+00:00",
    },
    {
        "id": "star-stud-earrings",
        "title": "Star Stud Earrings",
        "category": "earrings",
        "price": 26500,
        "description": "A refined stud earring set with soft sparkle, minimal detailing, and a lightweight profile that feels premium every day.",
        "image": "https://images.unsplash.com/photo-1561172478-a203d9c8290e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxnb2xkJTIwZWFycmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        "created_at": "2026-03-20T11:00:00+00:00",
    },
    {
        "id": "classic-bangles",
        "title": "Classic Gold Bangles",
        "category": "bangles",
        "price": 128000,
        "description": "A timeless pair of classic bangles with a smooth mirror polish, generous weight, and lasting bridal appeal.",
        "image": "https://images.unsplash.com/photo-1679156271456-d6068c543ee7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYmFuZ2xlcyUyMGpld2VsbGVyeXxlbnwxfHx8fDE3NzQ1MzgyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "created_at": "2026-03-20T11:30:00+00:00",
    },
    {
        "id": "diamond-bangles",
        "title": "Diamond Accent Bangles",
        "category": "bangles",
        "price": 156000,
        "description": "Contemporary bangles featuring diamond accents, sleek edges, and a high-shine finish crafted for occasion dressing.",
        "image": "https://images.unsplash.com/photo-1611598935678-c88dca238fce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxnb2xkJTIwYmFuZ2xlcyUyMGpld2VsbGVyeXxlbnwxfHx8fDE3NzQ1MzgyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "created_at": "2026-03-20T12:00:00+00:00",
    },
]


class ProductStoreError(Exception):
    pass


class ProductValidationError(ProductStoreError):
    pass


class ProductNotFoundError(ProductStoreError):
    pass


def _iso_now():
    return datetime.now(timezone.utc).isoformat()


class ProductStore:
    def __init__(self, data_file):
        self.data_file = Path(data_file)
        self.data_file.parent.mkdir(parents=True, exist_ok=True)
        if not self.data_file.exists():
            self._write_products(DEFAULT_PRODUCTS)

    def _read_products(self):
        if not self.data_file.exists():
            return []

        with self.data_file.open("r", encoding="utf-8") as file:
            data = json.load(file)

        if not isinstance(data, list):
            raise ProductStoreError("Products data file must contain a list.")

        return [self._normalize_existing_product(item) for item in data]

    def _write_products(self, products):
        with self.data_file.open("w", encoding="utf-8") as file:
            json.dump(products, file, indent=2, ensure_ascii=True)

    def _normalize_existing_product(self, product):
        if not isinstance(product, dict):
            raise ProductStoreError("Each product must be an object.")

        return {
            "id": str(product.get("id", uuid.uuid4().hex[:10])),
            "title": str(product.get("title", "")).strip(),
            "category": self._normalize_category(product.get("category", "")),
            "price": self._normalize_price(product.get("price", "")),
            "description": str(product.get("description", "")).strip(),
            "image": str(product.get("image", "")).strip(),
            "created_at": str(product.get("created_at", _iso_now())).strip() or _iso_now(),
        }

    def _normalize_category(self, raw_category):
        category = str(raw_category).strip().lower()
        normalized = ALLOWED_CATEGORIES.get(category)
        if not normalized:
            raise ProductValidationError(
                "Category must be one of: rings, necklace, earrings, bangles."
            )
        return normalized

    def _normalize_price(self, raw_price):
        try:
            price = float(raw_price)
        except (TypeError, ValueError) as exc:
            raise ProductValidationError("Price must be a valid number.") from exc

        if price <= 0:
            raise ProductValidationError("Price must be greater than zero.")

        return round(price, 2)

    def create_product(self, *, title, category, price, description, image):
        clean_title = str(title).strip()
        clean_description = str(description).strip()
        clean_image = str(image).strip()

        if not clean_title:
            raise ProductValidationError("Product title is required.")

        if not clean_description:
            raise ProductValidationError("Product description is required.")

        if not clean_image:
            raise ProductValidationError("Product image is required.")

        new_product = {
            "id": uuid.uuid4().hex[:10],
            "title": clean_title,
            "category": self._normalize_category(category),
            "price": self._normalize_price(price),
            "description": clean_description,
            "image": clean_image,
            "created_at": _iso_now(),
        }

        products = self._read_products()
        products.insert(0, new_product)
        self._write_products(products)
        return new_product

    def list_products(self):
        products = self._read_products()
        return sorted(
            products,
            key=lambda item: item.get("created_at", ""),
            reverse=True,
        )

    def delete_product(self, product_id):
        target_id = str(product_id).strip()
        products = self._read_products()

        for index, product in enumerate(products):
            if product.get("id") != target_id:
                continue

            deleted_product = products.pop(index)
            self._write_products(products)
            return deleted_product

        raise ProductNotFoundError("Product not found.")
