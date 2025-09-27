import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import { apiRequest } from '../../config/axios.config'
import toastService from '../../services/toast.service'

const Saved = () => {
    const [ videos, setVideos ] = useState([])
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        loadSavedItems()
    }, [])

    const loadSavedItems = async () => {
        try {
            setLoading(true)
            const response = await apiRequest.get('/food/save')
            
            const savedFoods = response.data.savedFoods.map((item) => ({
                _id: item.food._id,
                video: item.food.video,
                description: item.food.description,
                price: item.food.price,
                likeCount: item.food.likeCount,
                savesCount: item.food.savesCount,
                commentsCount: item.food.commentsCount,
                foodPartner: item.food.foodPartner,
            }))
            
            setVideos(savedFoods)
            console.log('Saved items loaded successfully:', savedFoods.length, 'items')
            
        } catch (error) {
            console.error('Failed to load saved items:', error)
            // Error toast is handled by axios interceptor
        } finally {
            setLoading(false)
        }
    }

    const removeSaved = async (item) => {
        try {
            const { data } = await apiRequest.post('/food/save', { foodId: item._id })
            
            // If backend returns unsaved (no `save` entity), remove from list; otherwise just adjust count defensively
            if (!data.save) {
                setVideos((prev) => prev.filter((v) => v._id !== item._id))
                toastService.success('Removed from saved items')
            } else {
                setVideos((prev) => prev.map((v) => (
                    v._id === item._id
                        ? { ...v, savesCount: (typeof v.savesCount === 'number' ? v.savesCount : 0) + 1 }
                        : v
                )))
                toastService.success('Saved for later! 🔖')
            }
        } catch (error) {
            console.error('Failed to update saved status:', error)
            // Error toast is handled by axios interceptor
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
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔖</div>
                        <p>Loading your saved items...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
        />
    )
}

export default Saved