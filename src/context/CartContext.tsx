"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customization?: {
    molhos?: string[];
    extras?: string[];
    obs?: string;
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemCustomization: (id: string, newCustomization: any, newPrice: number) => void;
  clearCart: () => void;
  // # ALTERAÇÃO SOLICITADA: Adicionado address aos parâmetros
  createOrder: (paymentMethod: string, address: string, notes?: string, restaurantId?: string, userId?: string) => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("pedro-burger-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erro ao carregar dados do carrinho:", e);
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pedro-burger-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => 
        item.productId === product.productId && 
        JSON.stringify(item.customization) === JSON.stringify(product.customization)
      );

      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + product.quantity } : item
        );
      }
      return [...prev, product];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  };

  const updateItemCustomization = (id: string, newCustomization: any, newPrice: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, customization: newCustomization, price: newPrice } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("pedro-burger-cart");
  };

  const createOrder = async (
    paymentMethod: string, 
    address: string, // # ALTERAÇÃO SOLICITADA: Novo parâmetro obrigatório
    notes: string = "", 
    restaurantId: string = "cmmcpmk4q000087yw0dvvdonb",
    userId?: string 
  ) => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const formattedItems = cart.map(item => {
      if (!item.productId) {
        throw new Error(`Produto ${item.name} inválido. Remova-o do carrinho.`);
      }
      return {
        id: item.productId, // O Mercado Pago e sua API esperam 'id' ou 'productId'
        productId: item.productId,
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price)
      };
    });

    try {
      // # ALTERAÇÃO SOLICITADA: Chamando a API de PIX que criamos, enviando o endereço
      const response = await fetch("/api/checkout/pix", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: formattedItems,
          total: Number(total),
          address, // # ALTERAÇÃO SOLICITADA: Enviando para salvar no Prisma
          notes,
          paymentMethod,
          restaurantId,
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar pedido");
      }

      // Nota: Não limpe o carrinho aqui se o pagamento for PIX, 
      // limpe apenas após a confirmação do pagamento se preferir, 
      // ou mantenha o clearCart se o redirecionamento for imediato.
      // clearCart(); 
      
      return data;
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      updateItemCustomization, 
      clearCart,
      createOrder 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
};