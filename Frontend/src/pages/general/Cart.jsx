import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import '../../styles/checkout.css'

export default function Cart() {
  const { items, setQty, removeItem, totals } = useCart()
  const navigate = useNavigate()

  const goCheckout = () => {
    if (items.length === 0) return
    // Pass all cart items to checkout via location state
    navigate('/checkout', { state: { items } })
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <span />
        <h1>Cart</h1>
        <span />
      </header>

      <section className="checkout-card">
        {items.length === 0 ? (
          <div style={{display:'grid',gap:10,placeItems:'center',textAlign:'center'}}>
            <div className="placeholder" aria-hidden="true" style={{fontSize:36}}>🛒</div>
            <p className="hint">Your cart is empty. Add items from the reels.</p>
            <button className="btn" onClick={() => navigate('/')}>Browse reels</button>
          </div>
        ) : (
          items.map((it) => (
            <div key={it.itemId} className="checkout-item" style={{marginBottom:12}}>
              <div className="checkout-item__media">
                {it.image ? <img src={it.image} alt="food" /> : <div className="placeholder">🍽️</div>}
              </div>
              <div className="checkout-item__info">
                <h2>{it.title}</h2>
                <div className="price-row">
                  <span>₹ {it.price.toFixed(2)}</span>
                  <div className="qty">
                    <button onClick={() => setQty(it.itemId, it.qty - 1)}>-</button>
                    <span>{it.qty}</span>
                    <button onClick={() => setQty(it.itemId, it.qty + 1)}>+</button>
                  </div>
                </div>
                <div className="summary-row" style={{padding: '4px 0 0'}}>
                  <span className="hint">Line total</span>
                  <span>₹ {(it.price * it.qty).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button className="btn" onClick={() => removeItem(it.itemId)}>Remove</button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="checkout-card">
        <div className="summary-row"><span>Subtotal</span><span>₹ {totals.subtotal.toFixed(2)}</span></div>
        <div className="summary-row"><span>Shipping</span><span>{totals.shipping === 0 ? 'Free' : `₹ ${totals.shipping.toFixed(2)}`}</span></div>
        <hr />
        <div className="summary-row total"><span>Total</span><span>₹ {totals.total.toFixed(2)}</span></div>
      </section>

      <div className="checkout-footer">
        <button className="btn primary" onClick={goCheckout} disabled={items.length === 0}>Checkout</button>
      </div>
    </main>
  )
}
