import { buildApiUrl, fetchWithRetry } from "./api";

export type ProductCategory = "rings" | "necklace" | "earrings" | "bangles";

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  description: string;
  image: string;
  created_at: string;
}

interface AdminLoginResponse {
  success: boolean;
  token: string;
  expires_in_seconds: number;
}

interface CreateProductInput {
  title: string;
  category: ProductCategory;
  price: number | string;
  description: string;
  imageFile?: File | null;
  imageUrl?: string;
}

async function readErrorMessage(response: Response, fallbackMessage: string) {
  try {
    const payload = await response.json();
    if (typeof payload.error === "string" && payload.error) {
      return payload.error;
    }
  } catch {
    // Ignore invalid JSON and use the fallback message.
  }

  return fallbackMessage;
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetchWithRetry(buildApiUrl("/products"), {
    signal,
    retries: 2,
    retryDelayMs: 1500,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Unable to load jewellery products right now."),
    );
  }

  return response.json();
}

export async function adminLogin(password: string): Promise<AdminLoginResponse> {
  const response = await fetch(buildApiUrl("/admin/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Admin login failed."));
  }

  return response.json();
}

export async function createProduct(
  input: CreateProductInput,
  token: string,
): Promise<Product> {
  const formData = new FormData();
  formData.set("title", input.title);
  formData.set("category", input.category);
  formData.set("price", String(input.price));
  formData.set("description", input.description);

  if (input.imageFile) {
    formData.set("image", input.imageFile);
  }

  if (input.imageUrl) {
    formData.set("image_url", input.imageUrl);
  }

  const response = await fetch(buildApiUrl("/products"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Unable to create product."));
  }

  return response.json();
}

export async function deleteProduct(productId: string, token: string) {
  const response = await fetch(buildApiUrl(`/products/${productId}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Unable to delete product."));
  }

  return response.json();
}
