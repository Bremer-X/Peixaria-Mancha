import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import MenuSection from './components/MenuSection';
import FooterBanner from './components/FooterBanner';
import { MENU_CATEGORIES } from './data/menuData';
import { UtensilsCrossed } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(MENU_CATEGORIES[0].id);

  // Intersection observer or scroll listener to update active category tab
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      for (const cat of MENU_CATEGORIES) {
        const el = document.getElementById(`section-${cat.id}`);
        if (el) {
          const top = el.offsetTop - 120;
          const bottom = top + el.offsetHeight;
          if (scrollY >= top && scrollY < bottom) {
            setActiveCategoryId(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter categories and items based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return MENU_CATEGORIES;

    const term = searchQuery.toLowerCase().trim();
    return MENU_CATEGORIES.map((category) => {
      const matchingItems = category.items.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          (item.description && item.description.toLowerCase().includes(term)) ||
          (item.preparation && item.preparation.toLowerCase().includes(term))
      );
      return {
        ...category,
        items: matchingItems,
      };
    }).filter((category) => category.items.length > 0);
  }, [searchQuery]);

  const handleSelectCategory = (id: string) => {
    setActiveCategoryId(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f0ba35] text-stone-900 flex flex-col items-center">
      {/* Container simulating the authentic physical printed cardápio flyer proportions */}
      <div className="w-full max-w-3xl flex flex-col min-h-screen relative shadow-2xl bg-[#f0ba35]">
        {/* Header with Logo, Title and Search */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Sticky Horizontal Categories Pill Navigation */}
        <CategoryNav
          categories={MENU_CATEGORIES}
          activeCategoryId={activeCategoryId}
          onSelectCategory={handleSelectCategory}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-3 sm:px-4 py-4 space-y-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 px-4 bg-[#fffdec] rounded-2xl border border-[#ecd596] shadow-sm">
              <UtensilsCrossed className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <h3 className="font-bebas text-2xl uppercase text-stone-800">
                Nenhum prato encontrado
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
                Não encontramos nenhum prato correspondente a "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 bg-[#b21818] text-white text-xs font-montserrat font-bold px-4 py-2 rounded-full shadow-sm cursor-pointer"
              >
                Ver Cardápio Completo
              </button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <MenuSection
                key={category.id}
                category={category}
              />
            ))
          )}
        </main>

        {/* Bottom Banner, WhatsApp Order CTA, and Drink Responsibly disclaimer */}
        <FooterBanner />
      </div>
    </div>
  );
}

