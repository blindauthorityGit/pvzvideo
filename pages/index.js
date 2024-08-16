import { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../firebase";

export default function ActiveVideoPage() {
    const [activeVideo, setActiveVideo] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchActiveVideo = async () => {
            try {
                const activeVideoRef = doc(db, "settings", "activeVideo");
                const activeVideoSnap = await getDoc(activeVideoRef);

                if (activeVideoSnap.exists()) {
                    setActiveVideo(activeVideoSnap.data());
                } else {
                    console.log("No active video found");
                }
            } catch (error) {
                console.error("Error fetching active video:", error);
            }
        };

        fetchActiveVideo();
    }, []);

    useEffect(() => {
        if (activeVideo && videoRef.current) {
            videoRef.current.play();
            videoRef.current.loop = true; // Ensure the video loops
            videoRef.current.muted = false; // Unmute if desired

            // Request fullscreen mode
            const requestFullscreen = () => {
                if (videoRef.current.requestFullscreen) {
                    videoRef.current.requestFullscreen();
                } else if (videoRef.current.webkitRequestFullscreen) {
                    // Safari
                    videoRef.current.webkitRequestFullscreen();
                } else if (videoRef.current.msRequestFullscreen) {
                    // IE11
                    videoRef.current.msRequestFullscreen();
                }
            };

            requestFullscreen();
        }
    }, [activeVideo]);

    return (
        <div className="p-0">
            {activeVideo ? (
                <video
                    ref={videoRef}
                    src={activeVideo.url}
                    controls
                    autoPlay
                    loop
                    muted // Mute to ensure autoplay works across browsers
                    width="100%"
                    className="mt-4"
                />
            ) : (
                <p>No active video is currently set.</p>
            )}
        </div>
    );
}
