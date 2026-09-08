import { useEffect, useRef } from 'react';
import { MenuCategory } from '../types';

interface CategoryNavProps {
  categories: MenuCategory[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export default function CategoryNav({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active pill into view smoothly
  useEffect(() => {
    if (!containerRef.current) return;
    const activeButton = containerRef.current.querySelector(
      `[data-category-id="${activeCategoryId}"]`
    );
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeCategoryId]);

  return (
    <div className="sticky top-0 z-30 bg-[#f0ba35]/95 backdrop-blur-md py-2.5 px-3 border-b border-[#ddaa2e]/50 shadow-sm transition-all">
      <div
        ref={containerRef}
        className="max-w-3xl mx-auto flex items-center gap-2 overflow-x-auto hide-scrollbar scroll-smooth px-1"
      >
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;
          return (
            <button
              key={category.id}
              data-category-id={category.id}
              id={`nav-btn-${category.id}`}
              onClick={() => onSelectCategory(category.id)}
              className={`whitespace-nowrap font-montserrat font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full transition-all duration-150 select-none shadow-sm flex-shrink-0 ${
                isActive
                  ? 'bg-[#b21818] text-white ring-2 ring-[#7a0f0f] scale-105'
                  : 'bg-[#981414] text-white/95 hover:bg-[#b21818] hover:text-white'
              }`}
            >
              {category.title.split(' (')[0].replace('PRATOS ', '')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
