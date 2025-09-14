import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import '../../styles/checkout.css'

// Simple checkout page that receives `state.item` from navigation
// Contract:
// - input: location.state.item => { _id, title/description, price, thumbnail/video, foodPartner }
// - output: navigate to /payment with { order } in state
export default function Checkout() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { items: cartItems, setQty: setCartQty, removeItem: removeCartItem } = useCart()

  // Modes:
  // - From Cart route => state.items passed or fall back to context cartItems
  // - Legacy direct item => state.item
  const fromCart = Array.isArray(state?.items) && state.items.length > 0
  const legacy = state?.item

  const [localItem, setLocalItem] = useState(() => legacy ? {
    itemId: legacy._id,
    title: legacy.title || legacy.name || legacy.description || 'Food item',
    price: Number(legacy.price ?? 0),
    vendorId: legacy.foodPartner,
    image: legacy.thumbnail || legacy.image,
    qty: 1
  } : null)

  // Use cart context as the live source when coming from Cart,
  // so adjustments/removals reflect immediately.
  const items = fromCart ? cartItems : (localItem ? [localItem] : cartItems)

  if (!items || items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-card">
          <h1 className="checkout-title">No items to checkout</h1>
          <Link className="btn" to="/">Back to reels</Link>
        </div>
      </main>
    )
  }

  const subtotal = useMemo(() => items.reduce((s, i) => s + Number(i.price ?? 0) * Number(i.qty ?? 1), 0), [items])
  const shipping = subtotal >= 299 ? 0 : 29
  const total = subtotal + shipping
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  const adjustQty = (id, delta) => {
    if (localItem && localItem.itemId === id && !fromCart && cartItems.length === 0) {
      setLocalItem((prev) => ({ ...prev, qty: Math.max(1, Math.min(99, prev.qty + delta)) }))
    } else {
      const current = items.find(i => i.itemId === id)
      const nextQty = Math.max(1, Math.min(99, (current?.qty || 1) + delta))
      setCartQty(id, nextQty)
    }
  }

  const removeItem = (id) => {
    if (localItem && localItem.itemId === id && !fromCart && cartItems.length === 0) {
      setLocalItem(null)
    } else {
      removeCartItem(id)
    }
  }

  const onPlaceOrder = () => {
    if (!address.trim()) { setError('Please enter your delivery address.'); return }
    setError('')
    const order = {
      items: items.map(i => ({ itemId: i.itemId, title: i.title, price: Number(i.price), qty: Number(i.qty) })),
      subtotal,
      shipping,
      total,
      address: address.trim()
    }
    navigate('/payment', { state: { order } })
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">←</button>
        <h1>Checkout</h1>
        <span />
      </header>

      <section className="checkout-card">
        <h2 className="section-title">Delivery address</h2>
        <div className="form-group">
          <label>Address<span style={{color:'red'}}> *</span></label>
          <textarea
            className="textarea"
            rows={3}
            placeholder="House no, street, area, city, state, pincode"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        {error && <div className="error-text" role="alert" style={{marginTop:8}}>{error}</div>}
      </section>

      <section className="checkout-card">
        {items.map((it) => (
          <div key={it.itemId} className="checkout-item" style={{ marginBottom: 12 }}>
            <div className="checkout-item__media">
              {it.image ? <img src={it.image} alt="food" /> : <div className="placeholder">🍽️</div>}
            </div>
            <div className="checkout-item__info">
              <h2>{it.title}</h2>
              <div className="price-row">
                <span>₹ {Number(it.price).toFixed(2)}</span>
                <div className="qty">
                  <button onClick={() => adjustQty(it.itemId, -1)} aria-label="Decrease">-</button>
                  <span>{it.qty}</span>
                  <button onClick={() => adjustQty(it.itemId, 1)} aria-label="Increase">+</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn" onClick={() => removeItem(it.itemId)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="checkout-card">
        <div className="summary-row"><span>Subtotal</span><span>₹ {subtotal.toFixed(2)}</span></div>
        <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹ ${shipping.toFixed(2)}`}</span></div>
        <hr />
        <div className="summary-row total"><span>Total</span><span>₹ {total.toFixed(2)}</span></div>
      </section>

      <div className="checkout-footer">
        <button className="btn primary" onClick={onPlaceOrder}>Proceed to payment</button>
      </div>
    </main>
  )
}
