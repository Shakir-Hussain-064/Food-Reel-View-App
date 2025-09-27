import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import toastService from '../../services/toast.service'
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
      if (!name) {
        setError('Enter cardholder name')
        toastService.error('Please enter cardholder name')
        return
      }
      if (!/^\d{13,19}$/.test(num)) {
        setError('Enter a valid card number')
        toastService.error('Please enter a valid card number')
        return
      }
      if (!expiryOk) {
        setError('Enter expiry as MM/YY')
        toastService.error('Please enter expiry as MM/YY')
        return
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError('Enter a valid CVV')
        toastService.error('Please enter a valid CVV')
        return
      }
    }
    if (method === 'upi') {
      if (!/^\w+[.\-]?\w*@\w+$/.test(upiId.trim())) {
        setError('Enter a valid UPI ID')
        toastService.error('Please enter a valid UPI ID')
        return
      }
    }

    setError('')
    setProcessing(true)
    
    try {
      // Show processing toast
      const processingToast = toastService.loading('Processing payment...')
      
      // Simulate processing. In real app, call backend to create payment intent/session.
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Dismiss processing toast
      toastService.dismiss(processingToast)
      
      // Clear cart
      try { clearCart() } catch (error) {
        console.error('Failed to clear cart:', error)
      }
      
      // Show success message
      toastService.success('Payment successful! 🎉')
      
      // Show ordered overlay, then navigate back to reels after short delay
      setShowOverlay(true)
      setTimeout(() => {
        navigate('/', { replace: true, state: { paid: true, orderId: Date.now() } })
      }, 1300)
      
    } catch (error) {
      console.error('Payment processing failed:', error)
      toastService.error('Payment failed. Please try again.')
      setError('Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
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
