import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Home = () => {
    const [ videos, setVideos ] = useState([])
    const navigate = useNavigate()
    const { logoutUser } = useAuth()
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {

                console.log(response.data);

                setVideos(response.data.foodItems)
            })
            .catch((err) => {
                const status = err?.response?.status
                if (status === 401) {
                    navigate('/user/login')
                }
            })
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {

        const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, {withCredentials: true})

        if(response.data.like){
            console.log("Video liked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
        }else{
            console.log("Video unliked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
        }
        
    }

    async function saveVideo(item) {
        const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })

        if (response.data.save) {
            // Saved
            setVideos((prev) => prev.map((v) => (
                v._id === item._id
                    ? { ...v, savesCount: (typeof v.savesCount === 'number' ? v.savesCount : 0) + 1 }
                    : v
            )))
        } else {
            // Unsaved
            setVideos((prev) => prev.map((v) => (
                v._id === item._id
                    ? { ...v, savesCount: Math.max(0, (typeof v.savesCount === 'number' ? v.savesCount : 1) - 1) }
                    : v
            )))
        }
    }

    async function handleLogout() {
        await logoutUser()
        navigate('/user/login')
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