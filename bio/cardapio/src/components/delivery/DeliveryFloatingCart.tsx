import { ShoppingBag, ArrowRight } from 'lucide-react';
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
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none animate-in slide-in-from-bottom-5">
      <button
        id="delivery-floating-cart-btn"
        onClick={onOpenCart}
        className="pointer-events-auto w-full max-w-md bg-gradient-to-r from-[#b21818] via-[#e54500] to-[#ff5e00] hover:brightness-110 active:scale-98 text-white rounded-2xl shadow-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 border-2 border-amber-300 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="relative bg-white/20 p-2 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#b21818] font-montserrat font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
              {totalCount}
            </span>
          </div>
          <div className="text-left">
            <span className="text-[10px] sm:text-xs font-montserrat font-bold uppercase tracking-wider text-white/90 block">
              Ver Pedido
            </span>
            <span className="font-montserrat font-black text-sm sm:text-base text-white">
              R$ {subtotal.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 font-montserrat font-black text-xs sm:text-sm uppercase tracking-wide bg-white text-[#b21818] px-3.5 py-2 rounded-xl shadow-xs">
          <span>Finalizar</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}
