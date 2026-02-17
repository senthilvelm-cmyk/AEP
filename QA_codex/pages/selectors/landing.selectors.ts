export const landingSelectors = {
  logoLink: 'a[href="/"][data-status="active"]',
  logoLinkText: "Engagement Platform",
  logoImage: 'img[alt="Aziro"][src*="logo"][class*="rounded-xl"]',
  brandTitle: 'span:has-text("Aziro")',
  brandSubtitle: 'span:has-text("Engagement Platform")',
  merchandiseCardContainer:
    'div[class*="bg-card"][class*="rounded-2xl"][class*="p-6"][tabindex="0"]',
  merchandiseCardHeading: 'h3:has-text("Merchandise")',
  merchandiseIcon: 'svg.lucide-shopping-bag, svg[class*="lucide-shopping-bag"]',
  merchandiseSubtitle: 'p:has-text("Electronics & lifestyle")'
} as const;
