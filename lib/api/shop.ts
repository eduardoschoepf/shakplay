import { xanoClient } from "@/lib/xano-client"

export interface Product {
  id: number
  name: string
  description: string
  short_description: string
  category: string
  subcategory?: string
  brand: string
  sku: string
  price: number
  sale_price?: number
  currency: string
  discount_percentage?: number
  images: string[]
  thumbnail: string
  rating: number
  review_count: number
  in_stock: boolean
  stock_quantity: number
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  specifications: Record<string, string>
  tags: string[]
  is_featured: boolean
  is_new: boolean
  is_bestseller: boolean
  related_products: number[]
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: number
  product_id: number
  product: Product
  quantity: number
  size?: string
  color?: string
  customizations?: Record<string, string>
  unit_price: number
  total_price: number
  added_at: string
}

export interface Cart {
  id: number
  user_id: number
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  updated_at: string
}

export interface Order {
  id: number
  user_id: number
  order_number: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  items: Array<{
    product_id: number
    product_name: string
    product_image: string
    quantity: number
    unit_price: number
    total_price: number
    size?: string
    color?: string
  }>
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  shipping_address: {
    name: string
    street: string
    city: string
    state: string
    zip_code: string
    country: string
    phone?: string
  }
  billing_address: {
    name: string
    street: string
    city: string
    state: string
    zip_code: string
    country: string
  }
  tracking_number?: string
  estimated_delivery?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Review {
  id: number
  product_id: number
  user_id: number
  user_name: string
  user_avatar?: string
  rating: number
  title: string
  comment: string
  images?: string[]
  verified_purchase: boolean
  helpful_count: number
  created_at: string
  updated_at: string
}

export interface Wishlist {
  id: number
  user_id: number
  name: string
  description?: string
  is_public: boolean
  items: Array<{
    product_id: number
    product: Product
    added_at: string
    notes?: string
  }>
  created_at: string
  updated_at: string
}

export const shopAPI = {
  // Products
  getProducts: async (filters?: {
    category?: string
    brand?: string
    price_min?: number
    price_max?: number
    rating_min?: number
    in_stock?: boolean
    featured?: boolean
    new?: boolean
    bestseller?: boolean
    sort?: "price_asc" | "price_desc" | "rating" | "newest" | "bestseller"
    limit?: number
    offset?: number
  }) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    return xanoClient.get<Product[]>(`/shop/products?${params.toString()}`)
  },

  getProduct: async (productId: number) => {
    return xanoClient.get<Product>(`/shop/products/${productId}`)
  },

  searchProducts: async (
    query: string,
    filters?: {
      category?: string
      price_min?: number
      price_max?: number
      sort?: string
      limit?: number
    },
  ) => {
    const params = new URLSearchParams({ query })
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    return xanoClient.get<Product[]>(`/shop/products/search?${params.toString()}`)
  },

  getCategories: async () => {
    return xanoClient.get<
      Array<{
        name: string
        slug: string
        product_count: number
        subcategories?: Array<{
          name: string
          slug: string
          product_count: number
        }>
      }>
    >("/shop/categories")
  },

  getBrands: async () => {
    return xanoClient.get<
      Array<{
        name: string
        slug: string
        logo?: string
        product_count: number
      }>
    >("/shop/brands")
  },

  getFeaturedProducts: async (limit = 10) => {
    return xanoClient.get<Product[]>(`/shop/products/featured?limit=${limit}`)
  },

  getNewProducts: async (limit = 10) => {
    return xanoClient.get<Product[]>(`/shop/products/new?limit=${limit}`)
  },

  getBestsellerProducts: async (limit = 10) => {
    return xanoClient.get<Product[]>(`/shop/products/bestsellers?limit=${limit}`)
  },

  getRelatedProducts: async (productId: number, limit = 6) => {
    return xanoClient.get<Product[]>(`/shop/products/${productId}/related?limit=${limit}`)
  },

  // Cart Management
  getCart: async () => {
    return xanoClient.get<Cart>("/shop/cart")
  },

  addToCart: async (
    productId: number,
    quantity = 1,
    options?: {
      size?: string
      color?: string
      customizations?: Record<string, string>
    },
  ) => {
    return xanoClient.post<CartItem>("/shop/cart/items", {
      product_id: productId,
      quantity,
      ...options,
    })
  },

  updateCartItem: async (itemId: number, quantity: number) => {
    return xanoClient.put<CartItem>(`/shop/cart/items/${itemId}`, { quantity })
  },

  removeFromCart: async (itemId: number) => {
    return xanoClient.delete(`/shop/cart/items/${itemId}`)
  },

  clearCart: async () => {
    return xanoClient.delete("/shop/cart")
  },

  applyCoupon: async (couponCode: string) => {
    return xanoClient.post("/shop/cart/coupon", { code: couponCode })
  },

  removeCoupon: async () => {
    return xanoClient.delete("/shop/cart/coupon")
  },

  // Orders
  createOrder: async (orderData: {
    shipping_address: Order["shipping_address"]
    billing_address: Order["billing_address"]
    payment_method: string
    notes?: string
  }) => {
    return xanoClient.post<Order>("/shop/orders", orderData)
  },

  getOrders: async (status?: string, limit = 20, offset = 0) => {
    const params = new URLSearchParams()
    if (status) params.append("status", status)
    params.append("limit", limit.toString())
    params.append("offset", offset.toString())

    return xanoClient.get<Order[]>(`/shop/orders?${params.toString()}`)
  },

  getOrder: async (orderId: number) => {
    return xanoClient.get<Order>(`/shop/orders/${orderId}`)
  },

  cancelOrder: async (orderId: number, reason?: string) => {
    return xanoClient.post(`/shop/orders/${orderId}/cancel`, { reason })
  },

  trackOrder: async (orderId: number) => {
    return xanoClient.get(`/shop/orders/${orderId}/tracking`)
  },

  // Reviews
  getProductReviews: async (productId: number, limit = 20, offset = 0) => {
    return xanoClient.get<Review[]>(`/shop/products/${productId}/reviews?limit=${limit}&offset=${offset}`)
  },

  addProductReview: async (
    productId: number,
    reviewData: {
      rating: number
      title: string
      comment: string
      images?: File[]
    },
  ) => {
    const formData = new FormData()
    formData.append("rating", reviewData.rating.toString())
    formData.append("title", reviewData.title)
    formData.append("comment", reviewData.comment)

    if (reviewData.images) {
      reviewData.images.forEach((image, index) => {
        formData.append(`image_${index}`, image)
      })
    }

    return xanoClient.post<Review>(`/shop/products/${productId}/reviews`, formData)
  },

  updateReview: async (
    reviewId: number,
    reviewData: {
      rating?: number
      title?: string
      comment?: string
    },
  ) => {
    return xanoClient.put<Review>(`/shop/reviews/${reviewId}`, reviewData)
  },

  deleteReview: async (reviewId: number) => {
    return xanoClient.delete(`/shop/reviews/${reviewId}`)
  },

  markReviewHelpful: async (reviewId: number) => {
    return xanoClient.post(`/shop/reviews/${reviewId}/helpful`)
  },

  // Wishlist
  getWishlists: async () => {
    return xanoClient.get<Wishlist[]>("/shop/wishlists")
  },

  createWishlist: async (wishlistData: {
    name: string
    description?: string
    is_public?: boolean
  }) => {
    return xanoClient.post<Wishlist>("/shop/wishlists", wishlistData)
  },

  getWishlist: async (wishlistId: number) => {
    return xanoClient.get<Wishlist>(`/shop/wishlists/${wishlistId}`)
  },

  addToWishlist: async (wishlistId: number, productId: number, notes?: string) => {
    return xanoClient.post(`/shop/wishlists/${wishlistId}/items`, {
      product_id: productId,
      notes,
    })
  },

  removeFromWishlist: async (wishlistId: number, productId: number) => {
    return xanoClient.delete(`/shop/wishlists/${wishlistId}/items/${productId}`)
  },

  deleteWishlist: async (wishlistId: number) => {
    return xanoClient.delete(`/shop/wishlists/${wishlistId}`)
  },

  // Recommendations
  getRecommendations: async (type: "for_you" | "trending" | "similar" = "for_you", limit = 10) => {
    return xanoClient.get<Product[]>(`/shop/recommendations?type=${type}&limit=${limit}`)
  },

  // Inventory
  checkAvailability: async (
    productId: number,
    quantity = 1,
    options?: {
      size?: string
      color?: string
    },
  ) => {
    return xanoClient.post(`/shop/products/${productId}/availability`, {
      quantity,
      ...options,
    })
  },

  // Shipping
  getShippingOptions: async (address: {
    country: string
    state: string
    city: string
    zip_code: string
  }) => {
    return xanoClient.post("/shop/shipping/options", address)
  },

  calculateShipping: async (
    items: Array<{
      product_id: number
      quantity: number
    }>,
    address: {
      country: string
      state: string
      city: string
      zip_code: string
    },
  ) => {
    return xanoClient.post("/shop/shipping/calculate", { items, address })
  },

  // Coupons
  validateCoupon: async (couponCode: string) => {
    return xanoClient.post("/shop/coupons/validate", { code: couponCode })
  },

  getAvailableCoupons: async () => {
    return xanoClient.get("/shop/coupons/available")
  },
}
