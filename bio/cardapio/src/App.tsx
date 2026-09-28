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
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col items-center selection:bg-[#b21818] selection:text-white">
      {/* Container simulating authentic salon menu layout */}
      <div className="w-full max-w-3xl flex flex-col min-h-screen relative bg-[#FAF7F2]">
        {/* Header with Logo, Title, Search and Delivery Escape Link */}
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
        <main className="flex-1 px-3 sm:px-4 py-3 space-y-4">
          {/* Informative Table Sides Banner (Acompanhamentos inclusos na mesa) */}
          {!searchQuery && (
            <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs flex items-center gap-3">
              <div className="bg-amber-100/80 p-2.5 rounded-2xl flex-shrink-0 text-amber-800">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-montserrat font-black text-stone-900 text-xs sm:text-sm uppercase tracking-tight">
                  Acompanhamentos das Refeições
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-600 font-medium leading-relaxed mt-0.5">
                  Todos os pratos para 2 e 4 pessoas acompanham: <strong className="text-stone-900 font-bold">Arroz Soltinho, Farofa, Vinagrete e Pirão de Peixe</strong> (ou Feijão).
                </p>
              </div>
            </div>
          )}

          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
              <UtensilsCrossed className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bebas text-2xl uppercase text-stone-800">
                Nenhum prato encontrado
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Não encontramos nenhum item correspondente a "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 bg-[#b21818] hover:bg-[#8c1010] active:scale-95 text-white text-xs font-montserrat font-bold px-4 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all"
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

        {/* Bottom Banner, Fresh fish guarantee, and Drink Responsibly disclaimer */}
        <FooterBanner />
      </div>
    </div>
  );
}

