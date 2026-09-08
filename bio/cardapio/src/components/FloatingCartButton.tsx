import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface FloatingCartButtonProps {
  cart: CartItem[];
  onOpenCart: () => void;
}

export default function FloatingCartButton({ cart, onOpenCart }: FloatingCartButtonProps) {
  if (cart.length === 0) return null;

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
      <button
        id="floating-cart-btn"
        onClick={onOpenCart}
        className="pointer-events-auto w-full max-w-md bg-[#b21818] hover:bg-[#8f1212] active:scale-98 text-white py-3.5 px-5 rounded-full shadow-2xl flex items-center justify-between transition-all border-2 border-amber-300"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-900 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {totalQuantity}
            </span>
          </div>
          <div className="text-left leading-tight">
            <span className="font-montserrat font-black text-xs uppercase tracking-wider block text-amber-200">
              Ver Pedido
            </span>
            <span className="text-[11px] text-white/90 font-medium">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'itens'} adicionados
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-montserrat font-black text-base text-white">
            R$ {totalAmount.toFixed(2).replace('.', ',')}
          </span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </div>
      </button>
    </div>
  );
}
