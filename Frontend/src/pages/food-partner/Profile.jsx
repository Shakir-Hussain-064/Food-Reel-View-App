import React, { useState, useEffect, useRef } from 'react'
import '../../styles/profile.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { logoutFoodPartner, foodPartner } = useAuth()
    const [ profile, setProfile ] = useState(null)
    const [ videos, setVideos ] = useState([])
    const [ deletingId, setDeletingId ] = useState(null)
    const [ viewerOpen, setViewerOpen ] = useState(false)
    const [ currentIndex, setCurrentIndex ] = useState(0)
    const viewerVideoRef = useRef(null)

    useEffect(() => {
        axios.get(`https://food-reel-view-app.onrender.com/api/food-partner/${id}`, { withCredentials: true })
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems)
            })
    }, [ id ])

    const handleLogout = async () => {
        await logoutFoodPartner()
        navigate('/food-partner/login')
    }

    const goToCreateFood = () => navigate('/create-food')

    const isOwner = Boolean(foodPartner?._id && foodPartner._id === id)

    const handleDelete = async (foodId) => {
        if (!isOwner) return;
        // Optimistic UI: mark deleting to disable button
        setDeletingId(foodId)
        try {
            await axios.delete(`https://food-reel-view-app.onrender.com/api/food/${foodId}`, { withCredentials: true })
            setVideos(prev => prev.filter(f => (f._id || f.id) !== foodId))
        } catch (err) {
            console.error('Delete failed', err)
            // Optionally show a toast/alert
        } finally {
            setDeletingId(null)
        }
    }


    const openViewer = (index) => {
        setCurrentIndex(index)
        setViewerOpen(true)
    }

    const closeViewer = () => {
        setViewerOpen(false)
        // Pause when closing to avoid audio leak
        try { viewerVideoRef.current?.pause() } catch {}
    }

    const playHover = (e) => {
        const v = e.currentTarget
        if (v && v.paused) {
            v.play().catch(() => {})
        }
    }
    const pauseHover = (e) => {
        const v = e.currentTarget
        if (v) {
            try { v.pause() } catch {}
            try { v.currentTime = 0 } catch {}
        }
    }

    return (
        <main className="profile-page">
            {/* Back button only for non-owners (hide for food-partner owner) */}
            {!isOwner && (
                <button className="icon-btn back-btn" title="Back" onClick={() => navigate(-1)} aria-label="Back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="15 18 9 12 15 6"/>
                        <line x1="9" y1="12" x2="21" y2="12"/>
                    </svg>
                </button>
            )}
            {isOwner && (
                <button className="icon-btn logout-btn" title="Logout" onClick={handleLogout} aria-label="Logout">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                </button>
            )}
            <section className="profile-header">
                <div className="profile-meta">

                    <img className="profile-avatar" src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D" alt="" />

                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile?.name}
                        </h1>
                        <p className="profile-pill profile-address" title="Address">
                            {profile?.address}
                        </p>
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">total meals</span>
                        <span className="profile-stat-value">{profile?.totalMeals}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">customer served</span>
                        <span className="profile-stat-value">{profile?.customersServed}</span>
                    </div>
                </div>
            </section>

            <hr className="profile-sep" />

            <section className="profile-grid" aria-label="Videos">
                {videos.map((v, idx) => (
                    <div key={v._id || v.id || v.video} className="profile-grid-item">
                        <video
                            className="profile-grid-video"
                            style={{ objectFit: 'cover', width: '100%', height: '100%', cursor: 'pointer' }}
                            src={v.video}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            onMouseEnter={playHover}
                            onMouseLeave={pauseHover}
                            onClick={() => openViewer(idx)}
                        />

                        {isOwner && (v._id || v.id) && (
                            <button
                                className="icon-btn delete-btn"
                                title="Delete"
                                aria-label="Delete"
                                onClick={(e) => { e.stopPropagation(); handleDelete(v._id || v.id) }}
                                disabled={deletingId === (v._id || v.id)}
                                style={{ position: 'absolute', top: 8, right: 8 }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                    <path d="M10 11v6M14 11v6"/>
                                    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </section>

            {viewerOpen && (
                <div className="reel-viewer" role="dialog" aria-modal="true" onClick={closeViewer}>
                    <div className="reel-viewer-content" onClick={(e) => e.stopPropagation()}>
                        <video
                            ref={viewerVideoRef}
                            src={videos[currentIndex]?.video}
                            className="reel-viewer-video"
                            controls
                            autoPlay
                            playsInline
                            loop
                            preload="metadata"
                        />
                        <button className="icon-btn reel-viewer-close" onClick={closeViewer} aria-label="Close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                        <div className="reel-viewer-nav">
                            <button className="icon-btn" onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} aria-label="Previous">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                            </button>
                            <button className="icon-btn" onClick={() => setCurrentIndex((i) => Math.min(videos.length - 1, i + 1))} aria-label="Next">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating upload action -> only owner can upload */}
            {isOwner && (
                <button className="fab-upload" title="Upload reel" onClick={goToCreateFood} aria-label="Upload reel">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                </button>
            )}
        </main>
    )
}

export default Profile