import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import '../../styles/checkout.css'

export default function Payment() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const order = state?.order

  if (!order) {
    return (
      <main className="checkout-page">
        <div className="checkout-card">
          <h1 className="checkout-title">No order found</h1>
          <Link className="btn" to="/">Back to reels</Link>
        </div>
      </main>
    )
  }

  const [method, setMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [error, setError] = useState('')
  const [card, setCard] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  })
  const [upiId, setUpiId] = useState('')

  const onMethodChange = (value) => {
    setMethod(value)
    setError('')
  }

  const payNow = async () => {
    // basic client-side validation (non-sensitive, demo level)
    if (method === 'card') {
      const num = card.number.replace(/\s+/g, '')
      const mmYy = card.expiry.trim()
      const cvv = card.cvv.trim()
      const name = card.name.trim()
      const expiryOk = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(mmYy)
      if (!name) return setError('Enter cardholder name')
      if (!/^\d{13,19}$/.test(num)) return setError('Enter a valid card number')
      if (!expiryOk) return setError('Enter expiry as MM/YY')
      if (!/^\d{3,4}$/.test(cvv)) return setError('Enter a valid CVV')
    }
    if (method === 'upi') {
      if (!/^\w+[.\-]?\w*@\w+$/.test(upiId.trim())) return setError('Enter a valid UPI ID')
    }

    setError('')
    setProcessing(true)
    // Simulate processing. In real app, call backend to create payment intent/session.
    setTimeout(() => {
      setProcessing(false)
      try { clearCart() } catch {}
      // Show ordered overlay, then navigate back to reels after short delay
      setShowOverlay(true)
      setTimeout(() => {
        navigate('/', { replace: true, state: { paid: true, orderId: Date.now() } })
      }, 1300)
    }, 1200)
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">←</button>
        <h1>Payment</h1>
        <span />
      </header>

      <section className="checkout-card">
        <h2 className="section-title">Order summary</h2>
        {Array.isArray(order.items) ? (
          <>
            {order.items.map((it) => (
              <div key={it.itemId} className="summary-row"><span>{it.title} × {it.qty}</span><span>₹ {(it.price * it.qty).toFixed(2)}</span></div>
            ))}
            {order.address && <div className="summary-row"><span>Address</span><span style={{maxWidth:'60ch',textAlign:'right'}}>{order.address}</span></div>}
            <div className="summary-row"><span>Subtotal</span><span>₹ {order.subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `₹ ${order.shipping.toFixed(2)}`}</span></div>
            <hr />
            <div className="summary-row total"><span>Total</span><span>₹ {order.total.toFixed(2)}</span></div>
          </>
        ) : (
          <>
            <div className="summary-row"><span>Item</span><span>{order.title}</span></div>
            <div className="summary-row"><span>Qty</span><span>{order.qty}</span></div>
            {order.address && <div className="summary-row"><span>Address</span><span style={{maxWidth:'60ch',textAlign:'right'}}>{order.address}</span></div>}
            <div className="summary-row"><span>Subtotal</span><span>₹ {order.subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `₹ ${order.shipping.toFixed(2)}`}</span></div>
            <hr />
            <div className="summary-row total"><span>Total</span><span>₹ {order.total.toFixed(2)}</span></div>
          </>
        )}
      </section>

      <section className="checkout-card">
        <h2 className="section-title">Payment methods</h2>
        <div className="pm-group">
          <label className="pm-option">
            <input type="radio" name="pm" value="card" checked={method==='card'} onChange={(e)=>onMethodChange(e.target.value)} />
            <span>Credit/Debit Card</span>
          </label>
          <label className="pm-option">
            <input type="radio" name="pm" value="cod" checked={method==='cod'} onChange={(e)=>onMethodChange(e.target.value)} />
            <span>Cash on Delivery</span>
          </label>
          <label className="pm-option">
            <input type="radio" name="pm" value="upi" checked={method==='upi'} onChange={(e)=>onMethodChange(e.target.value)} />
            <span>UPI</span>
          </label>
        </div>

        {/* Dynamic inputs based on selected method */}
        {method === 'card' && (
          <div className="form-grid" role="region" aria-label="Card details">
            <div className="form-group">
              <label>Cardholder name</label>
              <input
                className="input"
                type="text"
                placeholder="John Doe"
                value={card.name}
                onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Card number</label>
              <input
                className="input"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={card.number}
                onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
              />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Expiry (MM/YY)</label>
                <input
                  className="input"
                  type="text"
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  className="input"
                  inputMode="numeric"
                  placeholder="123"
                  value={card.cvv}
                  onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {method === 'upi' && (
          <div className="form-grid" role="region" aria-label="UPI details">
            <div className="form-group">
              <label>UPI ID</label>
              <input
                className="input"
                type="text"
                placeholder="username@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          </div>
        )}

        {method === 'cod' && (
          <div className="hint">Pay in cash when the order is delivered. No extra details needed.</div>
        )}

        {error && <div className="error-text" role="alert">{error}</div>}
      </section>

      <div className="checkout-footer">
        <button className="btn primary" onClick={payNow} disabled={processing}>
          {processing ? 'Processing…' : 'Pay now'}
        </button>
      </div>

      {showOverlay && (
        <div className="order-overlay" role="dialog" aria-live="assertive">
          <div className="order-burst">Ordered</div>
        </div>
      )}
    </main>
  )
}
