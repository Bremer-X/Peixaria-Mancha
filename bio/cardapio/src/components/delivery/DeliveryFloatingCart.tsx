import { ArrowRight } from 'lucide-react';
import { DeliveryCartItem } from '../../data/deliveryMenuData';

interface DeliveryFloatingCartProps {
  cart: DeliveryCartItem[];
  onOpenCart: () => void;
}

export default function DeliveryFloatingCart({
  cart,
  onOpenCart,
}: DeliveryFloatingCartProps) {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-3 sm:px-4 flex justify-center pointer-events-none">
      <button
        id="delivery-floating-cart-btn"
        onClick={onOpenCart}
        className="pointer-events-auto w-full max-w-lg bg-[#FF5000] hover:bg-[#E04600] active:scale-[0.98] text-white rounded-2xl shadow-xl px-3.5 py-3 flex items-center justify-between gap-3 border border-white/20 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-white/20 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
            {totalCount}
          </span>
          <div className="text-left">
            <span className="text-[11px] font-semibold text-orange-100 block leading-none">
              Ver Sacola
            </span>
            <span className="font-heading font-extrabold text-base text-white mt-0.5 block leading-tight">
              R$ {subtotal.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-white text-[#FF5000] font-bold text-xs sm:text-sm px-4 py-2 rounded-full shadow-xs">
          <span>Avançar</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}
