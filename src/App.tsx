import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AccountPage } from './pages/AccountPage';
import { OurStoryPage } from './pages/OurStoryPage';
import { WhyChooseUsPage } from './pages/WhyChooseUsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { FaqsPage } from './pages/FaqsPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PageRoute, ProductCategory, Product, OrderRecord } from './types';
import { CATALOG_PRODUCTS } from './data/products';
import { BUSINESS_INFO } from './data/businessInfo';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product>(CATALOG_PRODUCTS[0]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<OrderRecord | null>(null);

  // Auto-scroll to top and update dynamic SEO tags when route or product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let pageTitle = 'Katehranchal Agro Foods | Traditional Village Products for Modern Homes';
    let metaDescription = 'Traditional Village Products for Modern Homes. Part of Katehranchal Group. Official store for traditional Desi Ghee, Mustard Oils, and Natural Wheat.';
    let canonicalUrl = 'https://Katehranchal.org';
    let structuredData: any = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Katehranchal Agro Foods',
      url: 'https://Katehranchal.org',
      logo: 'https://Katehranchal.org/assets/katehranchal-agro-foods-logo.png',
      description: 'Traditional Village Products for Modern Homes. Part of Katehranchal Group.',
    };

    switch (currentRoute) {
      case 'shop':
        pageTitle = 'Shop the Essential Collection | Katehranchal Agro Foods';
        metaDescription = 'Explore our focused collection of four staple essentials: Desi Ghee, Black Mustard Oil, Yellow Mustard Oil, and Natural Wheat.';
        canonicalUrl = 'https://Katehranchal.org/shop';
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Shop the Essential Collection',
          url: canonicalUrl,
          description: metaDescription,
        };
        break;
      case 'product-detail':
        pageTitle = `${selectedProduct.name} | Katehranchal Agro Foods`;
        metaDescription = selectedProduct.shortDescription;
        canonicalUrl = `https://Katehranchal.org/product/${selectedProduct.slug}`;
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: selectedProduct.name,
          image: `https://Katehranchal.org${selectedProduct.primaryImage}`,
          description: selectedProduct.description,
          category: selectedProduct.categoryLabel,
          brand: {
            '@type': 'Brand',
            name: 'Katehranchal Agro Foods',
          },
        };
        break;
      case 'coming-soon':
        pageTitle = 'Upcoming Household & Traditional Essentials | Katehranchal Agro Foods';
        metaDescription = 'Explore 6 planned additions including Natural Wheat Flour, Cow Dung Cakes, Traditional Wood Ash, Natural Soil, Dry Neem Wood, and Dry Mango Wood.';
        canonicalUrl = 'https://Katehranchal.org/coming-soon';
        break;
      case 'why-choose-us':
        pageTitle = 'Why Choose Us | Katehranchal Agro Foods';
        metaDescription = 'Discover the five core pillars of Katehranchal Agro Foods: Focused Collection, Clear Product Information, Secure Shopping, Responsive Support, and Transparent Ordering.';
        canonicalUrl = 'https://Katehranchal.org/why-choose-us';
        break;
      case 'faqs':
        pageTitle = 'Frequently Asked Questions | Katehranchal Agro Foods';
        metaDescription = 'Clear and honest guidance on products, verified specifications, ordering schedules, delivery checking, and customer assistance.';
        canonicalUrl = 'https://Katehranchal.org/faqs';
        break;
      case 'our-story':
        pageTitle = 'Our Story | Katehranchal Agro Foods';
        metaDescription = 'Learn about our roots in Katehranchal, traditional village food staples, and the standards of the Katehranchal Group.';
        canonicalUrl = 'https://Katehranchal.org/our-story';
        break;
      case 'how-it-works':
        pageTitle = 'How It Works | Katehranchal Agro Foods';
        metaDescription = 'Our step-by-step commitment from responsible sourcing and protective packaging to customer support.';
        canonicalUrl = 'https://Katehranchal.org/how-it-works';
        break;
      case 'contact':
        pageTitle = 'Contact Customer Support | Katehranchal Agro Foods';
        metaDescription = 'Connect directly with Katehranchal Agro Foods via verified WhatsApp and official email support.';
        canonicalUrl = 'https://Katehranchal.org/contact';
        break;
      case 'account':
        pageTitle = 'Customer Account | Katehranchal Agro Foods';
        metaDescription = 'Manage your shipping addresses, view past orders, and configure notification preferences.';
        break;
      case 'checkout':
        pageTitle = 'Checkout | Katehranchal Agro Foods';
        metaDescription = 'Secure checkout with address validation and transparent order calculation.';
        break;
      case 'policy-shipping':
        pageTitle = 'Shipping & Delivery Policy | Katehranchal Agro Foods';
        break;
      case 'policy-returns':
        pageTitle = 'Returns & Refunds Policy | Katehranchal Agro Foods';
        break;
      case 'policy-cancellation':
        pageTitle = 'Cancellation Policy | Katehranchal Agro Foods';
        break;
      case 'policy-privacy':
        pageTitle = 'Privacy Policy | Katehranchal Agro Foods';
        break;
      case 'policy-terms':
        pageTitle = 'Terms & Conditions | Katehranchal Agro Foods';
        break;
      case 'policy-payment':
        pageTitle = 'Payment & Security Policy | Katehranchal Agro Foods';
        break;
      case 'admin':
        pageTitle = 'Store Administration Console | Katehranchal Agro Foods';
        break;
      case 'not-found':
        pageTitle = 'Page Not Found | Katehranchal Agro Foods';
        break;
    }

    document.title = pageTitle;

    // Update meta tags
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', metaDescription);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', metaDescription);

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute('href', canonicalUrl);

    // Update structured data script
    let scriptTag = document.getElementById('dynamic-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
  }, [currentRoute, selectedProduct]);

  const handleNavigate = (route: PageRoute, category?: ProductCategory) => {
    if (category) {
      setActiveCategory(category);
    }
    setCurrentRoute(route);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentRoute('product-detail');
  };

  const handleOrderSuccess = (order: OrderRecord) => {
    setLastPlacedOrder(order);
    setCurrentRoute('order-confirmation');
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#FBF9F4] text-[#132218] font-sans selection:bg-[#E0980B]/30 selection:text-[#124328]">
        {/* Persistent Site Header */}
        <Header
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAccount={() => setCurrentRoute('account')}
        />

        {/* Dynamic Route View Switching */}
        <main className="flex-1">
          {currentRoute === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {currentRoute === 'shop' && (
            <ShopPage
              initialCategory={activeCategory}
              onSelectProduct={handleSelectProduct}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'product-detail' && (
            <ProductDetailPage
              product={selectedProduct}
              onNavigate={handleNavigate}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {currentRoute === 'checkout' && (
            <CheckoutPage
              onNavigate={handleNavigate}
              onOrderSuccess={handleOrderSuccess}
            />
          )}

          {currentRoute === 'order-confirmation' && (
            <OrderConfirmationPage
              order={lastPlacedOrder}
              onNavigate={handleNavigate}
              onOpenAccount={() => setCurrentRoute('account')}
            />
          )}

          {currentRoute === 'account' && (
            <AccountPage onNavigate={handleNavigate} />
          )}

          {currentRoute === 'our-story' && (
            <OurStoryPage onNavigate={handleNavigate} />
          )}

          {currentRoute === 'why-choose-us' && (
            <WhyChooseUsPage onNavigate={handleNavigate} />
          )}

          {currentRoute === 'how-it-works' && (
            <HowItWorksPage onNavigate={handleNavigate} />
          )}

          {currentRoute === 'coming-soon' && (
            <ComingSoonPage onNavigate={handleNavigate} />
          )}

          {currentRoute === 'faqs' && (
            <FaqsPage onNavigate={handleNavigate} />
          )}

          {currentRoute === 'contact' && (
            <ContactPage onNavigate={handleNavigate} />
          )}

          {currentRoute === 'policy-shipping' && (
            <PoliciesPage initialPolicy="shipping" onNavigate={handleNavigate} />
          )}

          {currentRoute === 'policy-returns' && (
            <PoliciesPage initialPolicy="returns" onNavigate={handleNavigate} />
          )}

          {currentRoute === 'policy-cancellation' && (
            <PoliciesPage initialPolicy="cancellation" onNavigate={handleNavigate} />
          )}

          {currentRoute === 'policy-privacy' && (
            <PoliciesPage initialPolicy="privacy" onNavigate={handleNavigate} />
          )}

          {currentRoute === 'policy-terms' && (
            <PoliciesPage initialPolicy="terms" onNavigate={handleNavigate} />
          )}

          {currentRoute === 'policy-payment' && (
            <PoliciesPage initialPolicy="payment" onNavigate={handleNavigate} />
          )}

          {currentRoute === 'admin' && (
            <AdminPage onNavigate={handleNavigate} />
          )}

          {currentRoute === 'not-found' && (
            <NotFoundPage onNavigate={handleNavigate} />
          )}
        </main>

        {/* Global Cart Slide-Over Drawer */}
        <CartDrawer onNavigate={handleNavigate} />

        {/* Global Keyword Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectProduct={handleSelectProduct}
          onNavigate={handleNavigate}
        />

        {/* Floating Customer-Assistance WhatsApp Trigger */}
        <aside aria-label="Customer Support Channel" className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 sm:right-5 z-40">
          <a
            href={BUSINESS_INFO.whatsAppDirectLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact Customer Support on WhatsApp"
            className="group flex h-12 min-w-12 items-center justify-center gap-2.5 px-3 md:px-4 rounded-full bg-[#124328] text-[#FBF9F4] shadow-xl hover:bg-[#1A5A35] border border-[#E0980B]/40 transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 fill-current" />
            <span className="text-xs font-semibold tracking-wide pr-1 hidden md:inline-block">
              Need Help? WhatsApp Support
            </span>
          </a>
        </aside>

        {/* Global Footer */}
        <Footer
          onNavigate={handleNavigate}
          onOpenAccount={() => setCurrentRoute('account')}
        />
      </div>
    </CartProvider>
  );
}
