import { Home, UtensilsCrossed, Receipt, User } from 'lucide-react';

export type DeliveryNavTab = 'inicio' | 'cardapio' | 'pedidos' | 'perfil';

interface DeliveryBottomNavProps {
  activeTab: DeliveryNavTab;
  onSelectTab: (tab: DeliveryNavTab) => void;
  ordersCount?: number;
}

export default function DeliveryBottomNav({
  activeTab,
  onSelectTab,
  ordersCount = 0,
}: DeliveryBottomNavProps) {
  const tabs: { id: DeliveryNavTab; label: string; icon: typeof Home }[] = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'cardapio', label: 'Cardápio', icon: UtensilsCrossed },
    { id: 'pedidos', label: 'Meus Pedidos', icon: Receipt },
    { id: 'perfil', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-2xl mx-auto h-16 px-2 grid grid-cols-4 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors cursor-pointer ${
                isActive ? 'text-[#FF5000] font-bold' : 'text-stone-400 hover:text-[#172B35]'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.id === 'pedidos' && ordersCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#FF5000] text-white text-[9px] font-bold px-1 rounded-full min-w-[15px] h-[15px] flex items-center justify-center">
                    {ordersCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
