import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/profile.css'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [ profile, setProfile ] = useState(null)
    const [ videos, setVideos ] = useState([])
    const [ isCurrentFoodPartner, setIsCurrentFoodPartner ] = useState(false)

    // Check if the current user is the food partner viewing their own profile
    const checkCurrentFoodPartner = async () => {
        try {
            // Get current food partner info from server
            const response = await axios.get('http://localhost:3000/api/food-partner/me', { 
                withCredentials: true 
            })
            
            // If the profile ID matches the current food partner ID, they're the owner
            if (response.data.foodPartner && response.data.foodPartner._id === id) {
                setIsCurrentFoodPartner(true)
            }
        } catch (error) {
            // If there's an error, user is either not logged in or not a food partner
            setIsCurrentFoodPartner(false)
        }
    }

    const handleLogout = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/auth/food-partner/logout', { withCredentials: true })
            console.log(response.data.message)
            
            // Clear local storage and cookies
            localStorage.clear()
            sessionStorage.clear()
            
            // Redirect to login page
            navigate('/food-partner/login')
        } catch (error) {
            console.error('Logout failed:', error)
            navigate('/food-partner/login')
        }
    }

    useEffect(() => {
        // Get profile information
        axios.get(`http://localhost:3000/api/food-partner/${id}`, { withCredentials: true })
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems)
            })
        
        // Check if this is the current food partner's profile
        checkCurrentFoodPartner()
    }, [ id ])


    return (
        <main className="profile-page">
            <section className="profile-header">
                {isCurrentFoodPartner && (
                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                        aria-label="Logout"
                        title="Logout"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16,17 21,12 16,7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>
                )}
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
                        <span className="profile-stat-value">{profile?.totalMeals || 58}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">customer served</span>
                        <span className="profile-stat-value">{profile?.customersServed || 102}</span>
                    </div>
                </div>
            </section>

            <hr className="profile-sep" />

            {isCurrentFoodPartner && (
                <div className="flex item-right"> 
                    <Link to="/food-partner/create-food" className="add-food-btn">
                        Create Food
                    </Link>
                </div>
            )}

            <section className="profile-grid" aria-label="Videos">
                {videos.map((v) => (
                    <div key={v._id} className="profile-grid-item">
                        {/* Placeholder tile; replace with <video> or <img> as needed */}


                        <video
                            className="profile-grid-video"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            src={v.video} muted ></video>


                    </div>
                ))}
            </section>
        </main>
    )
}

export default Profile