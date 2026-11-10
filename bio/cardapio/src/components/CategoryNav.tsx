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
    <div className="sticky top-0 z-30 bg-[var(--color-natural)]/95 backdrop-blur-md py-2.5 px-3 sm:px-4 border-y border-stone-200/80 shadow-2xs transition-all">
      <div
        ref={containerRef}
        className="max-w-3xl mx-auto flex items-center gap-2 overflow-x-auto hide-scrollbar scroll-smooth py-0.5 px-1"
      >
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;
          return (
            <button
              key={category.id}
              data-category-id={category.id}
              id={`nav-btn-${category.id}`}
              onClick={() => onSelectCategory(category.id)}
              className={`whitespace-nowrap font-montserrat font-bold text-xs sm:text-sm px-4 py-2 rounded-full transition-all duration-150 select-none flex-shrink-0 cursor-pointer min-h-[44px] flex items-center justify-center ${
                isActive
                  ? 'bg-[var(--color-forest)] text-white shadow-xs font-extrabold'
                  : 'bg-white text-[var(--color-river)] border border-stone-200 hover:border-[var(--color-forest)] hover:text-[var(--color-forest)] shadow-2xs'
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
