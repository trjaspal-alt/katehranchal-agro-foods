import React, { useState, useEffect, useRef } from 'react';
import { PageRoute, ProductCategory } from '../types';
import { BrandLogo } from './BrandLogo';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  PhoneCall, 
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessInfo';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute, category?: ProductCategory) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { label: string; route: PageRoute; hasDropdown?: boolean }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Shop', route: 'shop', hasDropdown: true },
    { label: 'Our Story', route: 'our-story' },
    { label: 'Coming Soon', route: 'coming-soon' },
    { label: 'Why Choose Us', route: 'why-choose-us' },
    { label: 'How It Works', route: 'how-it-works' },
    { label: 'FAQs', route: 'faqs' },
    { label: 'Contact', route: 'contact' },
  ];

  const shopCategories: { label: string; category: ProductCategory }[] = [
    { label: 'All Products', category: 'all' },
    { label: 'Desi Ghee', category: 'desi-ghee' },
    { label: 'Black Mustard Oil', category: 'black-mustard-oil' },
    { label: 'Yellow Mustard Oil', category: 'yellow-mustard-oil' },
    { label: 'Natural Wheat', category: 'natural-wheat' },
  ];

  const handleNavClick = (route: PageRoute, category?: ProductCategory) => {
    setIsMobileMenuOpen(false);
    setIsShopDropdownOpen(false);
    onNavigate(route, category);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Subtle Top Utility Bar */}
      <div className="bg-[#0D301C] text-[#FBF9F4] text-xs py-2 px-4 sm:px-8 border-b border-[#E0980B]/20 hidden md:block">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#E0980B] font-medium tracking-wide">
              {BUSINESS_INFO.tagline}
            </span>
            <span className="text-[#E0980B]/40">•</span>
            <span className="text-[#FBF9F4]/80 text-[11px] font-light">
              {BUSINESS_INFO.parentGroupLine}
            </span>
          </div>

          <div className="flex items-center gap-5 text-[11px]">
            <a
              href={`mailto:${BUSINESS_INFO.officialEmail}`}
              className="text-[#FBF9F4]/80 hover:text-[#E0980B] transition-colors"
            >
              {BUSINESS_INFO.officialEmail}
            </a>
            <span className="text-[#E0980B]/40">•</span>
            <a
              href={BUSINESS_INFO.whatsAppDirectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#E0980B] hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#E0980B]" />
              <span>WhatsApp Support: {BUSINESS_INFO.supportWhatsAppDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full bg-[#FBF9F4]/95 backdrop-blur-md border-b transition-all duration-300 ${
          isScrolled
            ? 'py-2.5 shadow-sm border-[#124328]/10'
            : 'py-3 sm:py-4 border-[#124328]/10'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Official Logo and Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0980B] rounded-lg"
            aria-label="Katehranchal Agro Foods Home"
          >
            <BrandLogo size={isScrolled ? 'sm' : 'md'} showWordmark={true} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center justify-center gap-0.5 2xl:gap-1" aria-label="Primary Navigation">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.label} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                      className={`px-2.5 2xl:px-3 py-2 text-[13px] 2xl:text-sm font-medium tracking-normal transition-colors rounded-md inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0980B] ${
                        currentRoute === 'shop'
                          ? 'text-[#124328] font-semibold border-b-2 border-[#E0980B]'
                          : 'text-[#132218]/80 hover:text-[#124328] hover:bg-[#124328]/5'
                      }`}
                      aria-expanded={isShopDropdownOpen}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#E0980B] transition-transform duration-200 ${
                          isShopDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Shop Dropdown Menu */}
                    {isShopDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-56 rounded-md bg-white shadow-lg border border-[#124328]/10 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#E0980B] border-b border-[#124328]/5">
                          Catalog Categories
                        </div>
                        {shopCategories.map((cat) => (
                          <button
                            key={cat.category}
                            onClick={() => handleNavClick('shop', cat.category)}
                            className="w-full text-left px-4 py-2.5 text-sm text-[#132218] hover:bg-[#F5EFEB] hover:text-[#124328] transition-colors flex items-center justify-between"
                          >
                            <span>{cat.label}</span>
                            {cat.category === 'desi-ghee' && (
                              <span className="text-[10px] text-[#1C602A] bg-[#1C602A]/10 px-1.5 py-0.5 rounded font-medium">
                                Pure Ghee
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.route)}
                  className={`px-2.5 2xl:px-3 py-2 text-[13px] 2xl:text-sm font-medium tracking-normal transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0980B] ${
                    currentRoute === item.route
                      ? 'text-[#124328] font-semibold border-b-2 border-[#E0980B]'
                      : 'text-[#132218]/85 hover:text-[#124328] hover:bg-[#124328]/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Utility Actions: Search and Mobile Toggle */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:p-2.5 text-[#132218]/80 hover:text-[#124328] hover:bg-[#124328]/5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0980B]"
              aria-label="Search Catalog"
              title="Search products and policies"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-[#132218] hover:bg-[#124328]/5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0980B]"
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[68px] sm:top-[78px] bottom-0 bg-white/98 backdrop-blur-lg z-50 overflow-y-auto border-t border-[#124328]/10 px-6 py-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3 pb-8">
            <div className="text-xs uppercase font-semibold tracking-wider text-[#E0980B] px-2 mb-1">
              Store Navigation
            </div>

            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.route)}
                className={`text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  currentRoute === item.route
                    ? 'bg-[#124328] text-[#FBF9F4]'
                    : 'text-[#132218] hover:bg-[#F5EFEB]'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Mobile Catalog Categories */}
            <div className="pt-4 border-t border-[#124328]/10 space-y-2">
              <div className="text-xs uppercase font-semibold tracking-wider text-[#E0980B] px-2">
                Featured Categories
              </div>
              <div className="grid grid-cols-2 gap-2">
                {shopCategories.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => handleNavClick('shop', cat.category)}
                    className="text-left px-3 py-2 rounded bg-[#FBF9F4] text-xs font-medium text-[#124328] border border-[#124328]/10 hover:border-[#E0980B]"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Direct Support Box */}
            <div className="pt-4 border-t border-[#124328]/10">
              <div className="p-4 rounded-xl bg-[#124328] text-[#FBF9F4] space-y-2.5">
                <div className="text-[11px] font-bold text-[#E0980B] uppercase tracking-wider">
                  Customer Assistance Desk
                </div>
                <p className="text-xs text-[#FBF9F4]/80 leading-relaxed">
                  Connect with our dedicated team for product queries or order assistance.
                </p>
                <div className="flex flex-col gap-2 pt-1 text-xs">
                  <a
                    href={BUSINESS_INFO.whatsAppDirectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#E0980B] font-semibold"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp: {BUSINESS_INFO.supportWhatsAppDisplay}</span>
                  </a>
                  <a
                    href={`mailto:${BUSINESS_INFO.officialEmail}`}
                    className="text-[#FBF9F4]/70 hover:underline"
                  >
                    {BUSINESS_INFO.officialEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
