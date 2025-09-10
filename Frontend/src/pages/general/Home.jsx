import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Home = () => {
    const [ videos, setVideos ] = useState([])
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {

                console.log(response.data);

                setVideos(response.data.food)
            })
            .catch((error) => { 
                console.error("Error fetching videos:", error);
            })
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {
        try {
            const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, {withCredentials: true});
            
            // Get the updated like status from response
            const isLiked = response.data.like;
            
            // Update videos state with the proper count
            setVideos((prev) => 
                prev.map((v) => {
                    if (v._id === item._id) {
                        // If backend provided the updated count, use it; otherwise calculate
                        if (response.data.likeCount !== undefined) {
                            return { ...v, likeCount: response.data.likeCount };
                        } else {
                            // Ensure likeCount is a number with default 0
                            const currentCount = typeof v.likeCount === 'number' ? v.likeCount : 0;
                            return { ...v, likeCount: isLiked ? currentCount + 1 : currentCount - 1 };
                        }
                    }
                    return v;
                })
            );
            
            console.log(isLiked ? "Video liked" : "Video unliked");
        } catch (error) {
            console.error("Error liking video:", error);
        }
    }

    async function saveVideo(item) {
        try {
            const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true });
            
            // Get the save status from response
            const isSaved = response.data.save;
            
            // Update videos state with the proper count
            setVideos((prev) => 
                prev.map((v) => {
                    if (v._id === item._id) {
                        // If backend provided the updated count, use it; otherwise calculate
                        if (response.data.savesCount !== undefined) {
                            return { ...v, savesCount: response.data.savesCount };
                        } else {
                            // Ensure savesCount is a number with default 0
                            const currentCount = typeof v.savesCount === 'number' ? v.savesCount : 0;
                            return { ...v, savesCount: isSaved ? currentCount + 1 : currentCount - 1 };
                        }
                    }
                    return v;
                })
            );
            
            console.log(isSaved ? "Video saved" : "Video unsaved");
        } catch (error) {
            console.error("Error saving video:", error);
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    )
}

export default Home