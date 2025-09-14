import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'frva_cart_v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
  }, [items])

  const addItem = (item, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.itemId === (item._id || item.itemId))
      if (idx !== -1) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: Math.min(99, next[idx].qty + qty) }
        return next
      }
      return [
        ...prev,
        {
          itemId: item._id || item.itemId,
          title: item.title || item.name || item.description || 'Food item',
          price: Number(item.price ?? 0),
          vendorId: item.foodPartner || item.vendorId,
          image: item.thumbnail || item.image,
          qty: Math.max(1, qty)
        }
      ]
    })
  }

  const removeItem = (itemId) => setItems((prev) => prev.filter((i) => i.itemId !== itemId))
  const setQty = (itemId, qty) => setItems((prev) => prev.map((i) => i.itemId === itemId ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i))
  const clearCart = () => setItems([])

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
    const shipping = subtotal >= 299 || subtotal === 0 ? 0 : 29
    return { subtotal, shipping, total: subtotal + shipping }
  }, [items])

  const value = { items, addItem, removeItem, setQty, clearCart, totals }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
