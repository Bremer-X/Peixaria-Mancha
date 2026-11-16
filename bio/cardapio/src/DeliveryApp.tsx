import { useState, useEffect, useMemo } from 'react';
import DeliveryHeader from './components/delivery/DeliveryHeader';
import DeliveryMenuSection from './components/delivery/DeliveryMenuSection';
import DeliveryItemModal from './components/delivery/DeliveryItemModal';
import DeliveryCartDrawer from './components/delivery/DeliveryCartDrawer';
import DeliveryFloatingCart from './components/delivery/DeliveryFloatingCart';
import DeliveryBottomNav, { DeliveryNavTab } from './components/delivery/DeliveryBottomNav';
import {
  DELIVERY_HOURS,
  DELIVERY_MENU_CATEGORIES,
  DELIVERY_RESTAURANT_INFO,
  DeliveryCategory,
  DeliveryMenuItem,
  DeliveryCartItem,
  SUPABASE_CONFIG,
} from './data/deliveryMenuData';
import {
  UtensilsCrossed,
  Check,
  PhoneCall,
  Instagram,
  CheckCircle2,
  Fish,
  Flame,
  Utensils,
  X,
  Receipt,
  User,
  MapPin,
} from 'lucide-react';

interface LocalOrderHistoryItem {
  id: string;
  createdAt: string;
  totalAmount: number;
  modality: string;
  paymentMethod: string;
  items: { name: string; portion?: string; quantity: number; price: number }[];
}

export default function DeliveryApp() {
  const [categories, setCategories] = useState<DeliveryCategory[]>(() => {
    try {
      if (localStorage.getItem('mancha_supabase_ref') !== 'qnandyuygrilgptnpaeb') {
        localStorage.removeItem('peixaria_mancha_catalog_cache');
        localStorage.setItem('mancha_supabase_ref', 'qnandyuygrilgptnpaeb');
      }
      const cached = localStorage.getItem('peixaria_mancha_catalog_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed.categories) && parsed.categories.length > 0) {
          return parsed.categories
            .filter((c: DeliveryCategory) => c.isActive !== false)
            .map((c: DeliveryCategory) => ({
              ...c,
              items: (c.items || []).filter((it: DeliveryMenuItem) => it.isAvailable !== false),
            }));
        }
      }
    } catch {
      // ignore
    }
    return DELIVERY_MENU_CATEGORIES;
  });

  const [catalogRevision, setCatalogRevision] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    () => categories[0]?.id || DELIVERY_MENU_CATEGORIES[0].id
  );
  const [activeNavTab, setActiveNavTab] = useState<DeliveryNavTab>('inicio');
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [myOrders, setMyOrders] = useState<LocalOrderHistoryItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('peixaria_mancha_my_orders') || '[]');
    } catch {
      return [];
    }
  });

  const [profile, setProfile] = useState<{
    name: string;
    whatsapp: string;
    email: string;
    neighborhood: string;
    street: string;
    number: string;
    reference: string;
  }>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem('peixaria_mancha_customer_profile') || 'null') || {
          name: '',
          whatsapp: '',
          email: '',
          neighborhood: '',
          street: '',
          number: '',
          reference: '',
        }
      );
    } catch {
      return {
        name: '',
        whatsapp: '',
        email: '',
        neighborhood: '',
        street: '',
        number: '',
        reference: '',
      };
    }
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [cart, setCart] = useState<DeliveryCartItem[]>(() => {
    try {
      const saved = localStorage.getItem('peixaria_mancha_delivery_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalItem, setModalItem] = useState<{
    item: DeliveryMenuItem;
    defaultPortion?: '250g' | '500g';
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sincronização em tempo real com Supabase ("Cardápio Digital" / peixaria-mancha)
  useEffect(() => {
    const applyCatalog = (data: any) => {
      if (!data) return;
      if (data.config) {
        Object.assign(DELIVERY_RESTAURANT_INFO, data.config);
        if (data.config.openHour !== undefined) DELIVERY_HOURS.openHour = Number(data.config.openHour);
        if (data.config.closeHour !== undefined) DELIVERY_HOURS.closeHour = Number(data.config.closeHour);
        if (data.config.scheduleLabel) DELIVERY_HOURS.label = data.config.scheduleLabel;
        if (data.config.manualStatus) DELIVERY_HOURS.manualStatus = data.config.manualStatus;
        if (data.config.estimatedTime) DELIVERY_HOURS.estimatedTime = data.config.estimatedTime;
      }

      if (Array.isArray(data.categories) && data.categories.length > 0) {
        const activeCats: DeliveryCategory[] = data.categories
          .filter((c: any) => c.isActive !== false)
          .map((c: any) => ({
            ...c,
            items: (c.items || []).filter((it: any) => it.isAvailable !== false),
          }));
        setCategories(activeCats);
        setActiveCategoryId((prev) =>
          activeCats.some((c) => c.id === prev) ? prev : activeCats[0]?.id || ''
        );
      }
      setCatalogRevision((v) => v + 1);
    };

    const fetchCatalog = () => {
      fetch(`${SUPABASE_CONFIG.url}/rest/v1/rpc/get_delivery_catalog`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_CONFIG.anonKey,
          Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`,
        },
        body: JSON.stringify({
          p_store_slug: SUPABASE_CONFIG.storeSlug,
          p_include_unavailable: false,
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.categories) && data.categories.length > 0) {
            applyCatalog(data);
            try {
              localStorage.setItem('peixaria_mancha_catalog_cache', JSON.stringify(data));
            } catch {
              // ignore
            }
          }
        })
        .catch(() => {});
    };

    fetchCatalog();
    const pollTimer = window.setInterval(fetchCatalog, 8000);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('mancha-sync');
      bc.onmessage = () => fetchCatalog();
    } catch {
      // ignore
    }

    const onStorageSync = (e: StorageEvent) => {
      if (!e.key || e.key.includes('mancha')) {
        fetchCatalog();
      }
    };
    window.addEventListener('storage', onStorageSync);

    const onOrdersUpdated = () => {
      try {
        setMyOrders(JSON.parse(localStorage.getItem('peixaria_mancha_my_orders') || '[]'));
      } catch {
        // ignore
      }
    };
    window.addEventListener('mancha-orders-updated', onOrdersUpdated);

    return () => {
      window.clearInterval(pollTimer);
      window.removeEventListener('storage', onStorageSync);
      window.removeEventListener('mancha-orders-updated', onOrdersUpdated);
      try {
        if (bc) bc.close();
      } catch {
        // ignore
      }
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('peixaria_mancha_delivery_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      for (const cat of categories) {
        const el = document.getElementById(`delivery-section-${cat.id}`);
        if (el) {
          const top = el.offsetTop - 130;
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
  }, [categories]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const term = searchQuery.toLowerCase().trim();
    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.name.toLowerCase().includes(term) ||
            (item.description && item.description.toLowerCase().includes(term)) ||
            (item.badge && item.badge.toLowerCase().includes(term))
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [searchQuery, categories]);

  const handleSelectCategory = (id: string) => {
    setActiveCategoryId(id);
    const element = document.getElementById(`delivery-section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenItem = (item: DeliveryMenuItem, defaultPortion?: '250g' | '500g') => {
    setModalItem({ item, defaultPortion });
  };

  const handleAddToCart = (newItem: DeliveryCartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.menuItemId === newItem.menuItemId && i.portion === newItem.portion && i.notes === newItem.notes
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
    setToastMessage(`✓ ${newItem.name} adicionado à sacola!`);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleBottomTab = (tab: DeliveryNavTab) => {
    setActiveNavTab(tab);
    if (tab === 'inicio') {
      setIsOrdersOpen(false);
      setIsProfileOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'cardapio') {
      setIsOrdersOpen(false);
      setIsProfileOpen(false);
      const el = document.getElementById('delivery-categories-strip');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'pedidos') {
      setIsProfileOpen(false);
      setIsOrdersOpen(true);
    } else if (tab === 'perfil') {
      setIsOrdersOpen(false);
      setIsProfileOpen(true);
    }
  };

  const handleSaveProfile = async () => {
    const cleanPhone = profile.whatsapp.replace(/\D/g, '');
    if (!profile.name.trim()) {
      setProfileError('Informe seu nome completo.');
      return;
    }
    if (cleanPhone.length < 10) {
      setProfileError('Informe seu WhatsApp com DDD (ex: 91988887777).');
      return;
    }

    setProfileError('');
    setProfileSaving(true);
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/rpc/upsert_delivery_customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_CONFIG.anonKey,
          Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`,
        },
        body: JSON.stringify({
          p_store_slug: SUPABASE_CONFIG.storeSlug,
          p_name: profile.name.trim(),
          p_phone: profile.whatsapp.trim(),
          p_email: (profile.email || '').trim(),
          p_neighborhood: (profile.neighborhood || '').trim(),
          p_street: (profile.street || '').trim(),
          p_number: (profile.number || '').trim(),
          p_complement: '',
          p_reference: (profile.reference || '').trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Não foi possível salvar seu cadastro no momento.');
      }

      try {
        localStorage.setItem('peixaria_mancha_customer_profile', JSON.stringify(profile));
      } catch {
        // ignore
      }
      setIsProfileOpen(false);
      setToastMessage('✓ Cadastro salvo com sucesso!');
    } catch (err: any) {
      setProfileError(err?.message || 'Erro ao salvar cadastro.');
    } finally {
      setProfileSaving(false);
    }
  };

  const renderCategoryTileIcon = (iconName?: string, isActive?: boolean) => {
    const cls = `w-6 h-6 ${isActive ? 'text-white' : 'text-[#FF5000]'}`;
    switch (iconName) {
      case 'Flame':
        return <Flame className={cls} />;
      case 'Utensils':
        return <Utensils className={cls} />;
      case 'Fish':
      default:
        return <Fish className={cls} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#172B35] flex flex-col items-center selection:bg-[#FF5000] selection:text-white">
      <div className="w-full max-w-2xl flex flex-col min-h-screen relative bg-[#F8F6F0]">
        {/* Topo Fixo (Banner, Info Card, Busca e Carrossel Horizontal de Categorias) */}
        <div className="sticky top-0 z-30 bg-[#F8F6F0] pb-1 shadow-[0_4px_14px_rgba(255,80,0,0.08)]">
          <DeliveryHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenProfile={() => handleBottomTab('perfil')}
            catalogRevision={catalogRevision}
          />

          {/* Carrossel Horizontal de Categorias em Cards com Ícone */}
          <div id="delivery-categories-strip" className="px-3 sm:px-4 pt-3 pb-1.5">
            <div className="flex items-stretch gap-2.5 overflow-x-auto hide-scrollbar py-1">
              {categories.map((category) => {
                const isActive = activeCategoryId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleSelectCategory(category.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 min-w-[96px] sm:min-w-[108px] px-3 py-2.5 rounded-2xl transition-all cursor-pointer flex-shrink-0 border ${
                      isActive
                        ? 'bg-[#FF5000] text-white border-[#FF5000] shadow-md'
                        : 'bg-white text-[#172B35] border-stone-200/80 hover:border-[#FF5000]/40 shadow-2xs'
                    }`}
                  >
                    {renderCategoryTileIcon(category.iconName, isActive)}
                    <span className="text-[11px] font-bold leading-tight text-center whitespace-nowrap">
                      {category.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lista de Categorias e Produtos */}
        <main className="flex-1 px-3 sm:px-4 pt-2 pb-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-14 px-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
              <UtensilsCrossed className="w-11 h-11 text-stone-300 mx-auto mb-3" />
              <h3 className="font-heading text-xl font-bold text-[#172B35]">
                Nenhum prato encontrado
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Não encontramos nenhum item correspondente a "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 bg-[#FF5000] hover:bg-[#E04600] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xs cursor-pointer transition-all"
              >
                Ver Cardápio Completo
              </button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <DeliveryMenuSection
                key={category.id}
                category={category}
                onSelectItem={handleOpenItem}
              />
            ))
          )}
        </main>

        {/* Rodapé institucional antes da barra fixa */}
        <footer className="w-full max-w-2xl mx-auto px-3 sm:px-4 pb-36 pt-2 space-y-3 text-center">
          <div className="bg-[#FF5000] text-white py-4 px-5 rounded-2xl shadow-xs border border-white/20">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <h3 className="font-heading text-base sm:text-lg tracking-tight uppercase font-extrabold text-white">
                {DELIVERY_RESTAURANT_INFO.freshFishBadge}
              </h3>
            </div>
            <p className="text-xs text-orange-100 font-medium">
              {DELIVERY_RESTAURANT_INFO.qualityGuarantee}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-2xs border border-stone-200/80 flex flex-col sm:flex-row items-center justify-center gap-2">
            <a
              href={`https://wa.me/${DELIVERY_RESTAURANT_INFO.whatsapp}?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#FF5000] hover:bg-[#E04600] text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-2xs transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp {DELIVERY_RESTAURANT_INFO.phoneFormatted}</span>
            </a>

            <a
              href={DELIVERY_RESTAURANT_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#F15A24] hover:opacity-95 text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-2xs transition-all"
            >
              <Instagram className="w-4 h-4" />
              <span>{DELIVERY_RESTAURANT_INFO.instagram}</span>
            </a>
          </div>
        </footer>

        {/* Sacola Flutuante acima da barra inferior */}
        <DeliveryFloatingCart cart={cart} onOpenCart={() => setIsCartOpen(true)} />

        {/* Barra de Navegação Inferior Fixa */}
        <DeliveryBottomNav
          activeTab={activeNavTab}
          onSelectTab={handleBottomTab}
          ordersCount={myOrders.length}
        />

        {/* Modal de Customização do Prato */}
        <DeliveryItemModal
          item={modalItem?.item || null}
          defaultPortion={modalItem?.defaultPortion}
          onClose={() => setModalItem(null)}
          onAddToCart={handleAddToCart}
        />

        {/* Drawer da Sacola / Checkout */}
        <DeliveryCartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />

        {/* Modal Meus Pedidos */}
        {isOrdersOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
            <div className="bg-[#F8F6F0] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[82vh] flex flex-col overflow-hidden">
              <div className="bg-[#FF5000] text-white px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-orange-100" />
                  <h3 className="font-heading font-extrabold text-base">Meus Pedidos</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOrdersOpen(false)}
                  className="p-1 rounded-full hover:bg-white/15 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto space-y-3">
                {myOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
                    <Receipt className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#172B35]">Nenhum pedido neste aparelho</p>
                    <p className="text-xs text-stone-500 mt-1">
                      Seus pedidos enviados pelo cardápio aparecerão aqui.
                    </p>
                  </div>
                ) : (
                  myOrders.map((ord) => (
                    <div key={ord.id} className="bg-white rounded-2xl p-3.5 border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#FF5000]">
                          {new Date(ord.createdAt).toLocaleString('pt-BR')}
                        </span>
                        <span className="font-extrabold text-[#FF5000]">
                          R$ {Number(ord.totalAmount || 0).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div className="text-xs text-stone-600 space-y-0.5">
                        {ord.items.map((it, idx) => (
                          <p key={idx}>
                            {it.quantity}x {it.name} {it.portion ? `(${it.portion})` : ''}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Perfil / Cadastro de Cliente */}
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
            <div className="bg-[#F8F6F0] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
              <div className="bg-[#FF5000] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-100" />
                  <div>
                    <h3 className="font-heading font-extrabold text-base leading-tight">Cadastro do Cliente</h3>
                    <span className="text-[10px] text-orange-100 block">Agilize seus pedidos na Peixaria Mancha</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="p-1 rounded-full hover:bg-white/15 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-3 overflow-y-auto">
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-500 block mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Seu nome completo"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF5000]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-stone-500 block mb-1">WhatsApp *</label>
                    <input
                      type="tel"
                      value={profile.whatsapp}
                      onChange={(e) => setProfile((p) => ({ ...p, whatsapp: e.target.value }))}
                      placeholder="(91) 98888-8888"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF5000]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-stone-500 block mb-1">E-mail (Opcional)</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                      placeholder="seu@email.com"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF5000]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-500 block mb-1">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    Bairro (Belém / Ananindeua)
                  </label>
                  <input
                    type="text"
                    value={profile.neighborhood}
                    onChange={(e) => setProfile((p) => ({ ...p, neighborhood: e.target.value }))}
                    placeholder="Ex: Marco, Batista Campos, Cidade Nova..."
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF5000]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2">
                    <label className="text-[11px] font-bold uppercase text-stone-500 block mb-1">Rua / Avenida</label>
                    <input
                      type="text"
                      value={profile.street}
                      onChange={(e) => setProfile((p) => ({ ...p, street: e.target.value }))}
                      placeholder="Nome da rua ou travessa"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF5000]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-stone-500 block mb-1">Número</label>
                    <input
                      type="text"
                      value={profile.number}
                      onChange={(e) => setProfile((p) => ({ ...p, number: e.target.value }))}
                      placeholder="Ex: 123"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF5000]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-500 block mb-1">Ponto de Referência</label>
                  <input
                    type="text"
                    value={profile.reference}
                    onChange={(e) => setProfile((p) => ({ ...p, reference: e.target.value }))}
                    placeholder="Ex: Próximo à praça, portão branco"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF5000]"
                  />
                </div>

                {profileError && (
                  <p className="text-xs font-bold text-[#F15A24] bg-[#F15A24]/10 border border-[#F15A24]/30 rounded-xl px-3 py-2">
                    {profileError}
                  </p>
                )}

                <button
                  type="button"
                  disabled={profileSaving}
                  onClick={handleSaveProfile}
                  className="w-full bg-[#FF5000] hover:bg-[#E04600] disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl cursor-pointer transition-all"
                >
                  {profileSaving ? 'Salvando no sistema...' : 'Cadastrar / Salvar Meus Dados'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast de Confirmação */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#FF5000] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-full shadow-xl flex items-center gap-1.5 border border-white/25">
            <Check className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
