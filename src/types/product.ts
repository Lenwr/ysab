export type Product = {
    id: string;
    name: string;
    slug: string;
    reference: string | null;
    description: string | null;
    category: string;
    color: string | null;
    pattern: string | null;
    price_label: string | null;
    is_featured: boolean;
    is_available: boolean;
    created_at: string;
  };
  
  export type ProductImage = {
    id: string;
    product_id: string;
    image_url: string;
    is_cover: boolean;
    created_at: string;
  };