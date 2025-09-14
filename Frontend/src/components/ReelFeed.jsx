import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

// Reusable feed for vertical reels
// Props:
// - items: Array of video items { _id, video, description, likeCount, savesCount, commentsCount, comments, foodPartner }
// - onLike: (item) => void | Promise<void>
// - onSave: (item) => void | Promise<void>
// - emptyMessage: string
const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = 'No videos yet.' }) => {
  const videoRefs = useRef(new Map())
  const { addItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return
          // Play when sufficiently visible; pause otherwise.
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            // Active reel: play it
            video.play().catch(() => { /* ignore autoplay errors */ })
            // Reset all other videos so going back restarts from beginning
            videoRefs.current.forEach((vEl) => {
              if (vEl !== video) {
                try { vEl.pause() } catch {}
                try { vEl.currentTime = 0 } catch {}
              }
            })
          } else {
            // If the reel is no longer intersecting at all, reset to start
            if (!entry.isIntersecting || entry.intersectionRatio === 0) {
              try { video.pause() } catch {}
              try { video.currentTime = 0 } catch {}
            } else {
              // Partially visible but not the active one: just pause
              try { video.pause() } catch {}
            }
          }
        })
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    )

    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items])

  const setVideoRef = (id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return }
    videoRefs.current.set(id, el)
  }

  // Capture a poster frame from a given video element as data URL
  const captureFrame = (videoEl) => {
    try {
      const w = videoEl.videoWidth || 720
      const h = videoEl.videoHeight || 1280
      if (!w || !h) return null
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(videoEl, 0, 0, w, h)
      return canvas.toDataURL('image/jpeg', 0.7)
    } catch {
      return null
    }
  }

  const handleOrderNow = (item) => {
    // Try to enrich item with a thumbnail captured from the playing reel
    const vid = videoRefs.current.get(item._id)
    const shot = vid ? captureFrame(vid) : null
    const enriched = shot ? { ...item, thumbnail: item.thumbnail || item.image || shot } : item
    addItem(enriched, 1)
    navigate('/cart')
  }

  return (
    <div className="reels-page">
      <div className="reels-feed" role="list">
        {items.length === 0 && (
          <div className="empty-state">
            <p>{emptyMessage}</p>
          </div>
        )}

        {items.map((item) => (
          <section key={item._id} className="reel" role="listitem">
            <video
              ref={setVideoRef(item._id)}
              className="reel-video"
              src={item.video}
              crossOrigin="anonymous"
              muted
              playsInline
              loop
              preload="metadata"
            />

            <div className="reel-overlay">
              <div className="reel-overlay-gradient" aria-hidden="true" />
              <div className="reel-actions">
                <div className="reel-action-group">
                  <button
                    onClick={onLike ? () => onLike(item) : undefined}
                    className="reel-action"
                    aria-label="Like"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.likeCount ?? item.likesCount ?? item.likes ?? 0}</div>
                </div>

                <div className="reel-action-group">
                  <button
                    className="reel-action"
                    onClick={onSave ? () => onSave(item) : undefined}
                    aria-label="Bookmark"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.savesCount ?? item.bookmarks ?? item.saves ?? 0}</div>
                </div>

                <div className="reel-action-group">
                  <button className="reel-action" aria-label="Comments">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}</div>
                </div>
              </div>

              <div className="reel-content">
                {typeof item.price === 'number' && !Number.isNaN(item.price) && (
                  <div className="reel-price" aria-label="Price">₹ {item.price.toFixed(2)}</div>
                )}
                <p className="reel-description" title={item.description}>{item.description}</p>
                <div className="reel-btn-row">
                  {/* Add to cart then go to cart */}
                  <button
                    className="reel-btn"
                    onClick={() => handleOrderNow(item)}
                    aria-label="Order now"
                  >
                    Order now
                  </button>

                  {item.foodPartner && (
                    <Link className="reel-btn secondary" to={"/food-partner/" + item.foodPartner} aria-label="Visit store">Visit store</Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default ReelFeed