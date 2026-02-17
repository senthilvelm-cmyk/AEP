export const merchandiseSelectors = {
  merchandisePagePath: "/merchandise",
  productCardLink: 'a[href*="/merchandise/product/"]',
  pickFromStoreText: 'text=/^\\s*Pick\\s+from\\s+store\\s*$/i',
  pickFromStoreIconInProductCard: 'a[href*="/merchandise/product/"] svg.lucide-store',
  responseTimeoutMs: 15000
} as const;
