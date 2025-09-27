import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { apiRequest } from '../../config/axios.config'
import toastService from '../../services/toast.service'

const Home = () => {
    const [ videos, setVideos ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const navigate = useNavigate()
    const { logoutUser } = useAuth()
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        loadFoodItems()
    }, [])

    const loadFoodItems = async () => {
        try {
            setLoading(true)
            const response = await apiRequest.get('/food')
            console.log('Food items loaded successfully:', response.data)
            setVideos(response.data.foodItems)
        } catch (err) {
            console.error('Failed to load food items:', err)
            const status = err?.response?.status
            if (status === 401) {
                toastService.info('Please login to view food items')
                navigate('/user/login')
            }
            // Other errors are handled by axios interceptor
        } finally {
            setLoading(false)
        }
    }

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {
        try {
            const response = await apiRequest.post('/food/like', { foodId: item._id })

            if(response.data.like){
                console.log("Video liked");
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
                toastService.success('Added to favorites! ❤️')
            }else{
                console.log("Video unliked");
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
                toastService.info('Removed from favorites')
            }
        } catch (error) {
            console.error('Failed to like/unlike video:', error)
            // Error toast is handled by axios interceptor
        }
    }

    async function saveVideo(item) {
        try {
            const response = await apiRequest.post('/food/save', { foodId: item._id })

            if (response.data.save) {
                // Saved
                setVideos((prev) => prev.map((v) => (
                    v._id === item._id
                        ? { ...v, savesCount: (typeof v.savesCount === 'number' ? v.savesCount : 0) + 1 }
                        : v
                )))
                toastService.success('Saved for later! 🔖')
            } else {
                // Unsaved
                setVideos((prev) => prev.map((v) => (
                    v._id === item._id
                        ? { ...v, savesCount: Math.max(0, (typeof v.savesCount === 'number' ? v.savesCount : 1) - 1) }
                        : v
                )))
                toastService.info('Removed from saved items')
            }
        } catch (error) {
            console.error('Failed to save/unsave video:', error)
            // Error toast is handled by axios interceptor
        }
    }

    async function handleLogout() {
        try {
            await logoutUser()
            toastService.success('Logged out successfully')
            navigate('/user/login')
        } catch (error) {
            console.error('Logout failed:', error)
            toastService.error('Failed to logout. Please try again.')
        }
    }

    if (loading) {
        return (
            <div className="reels-page">
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100vh',
                    color: 'var(--color-text-secondary)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍽️</div>
                        <p>Loading delicious content...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <button className="icon-btn logout-btn-fixed" onClick={handleLogout} title="Logout" aria-label="Logout">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
            </button>
            <ReelFeed
                items={videos}
                onLike={likeVideo}
                onSave={saveVideo}
                emptyMessage="No videos available."
            />
        </>
    )
}

export default Home