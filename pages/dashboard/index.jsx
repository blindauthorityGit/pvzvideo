import { useState, useEffect } from "react";
import { storage, ref, listAll, getDownloadURL } from "../../firebase";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore/lite";
import { db } from "../../firebase";

export default function Dashboard() {
    const [videos, setVideos] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);

    // Fetch videos from Firebase Storage
    useEffect(() => {
        const fetchVideos = async () => {
            const listRef = ref(storage, "videos/");
            const videoList = [];

            try {
                const res = await listAll(listRef);
                for (const itemRef of res.items) {
                    const url = await getDownloadURL(itemRef);
                    videoList.push({
                        name: itemRef.name,
                        url: url,
                        date: new Date(), // Placeholder for upload date; consider storing this in Firestore if needed
                    });
                }
                setVideos(videoList);
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };

        fetchVideos();
    }, []);

    // Function to set a video as "Aktiv"
    const handleSetActiveVideo = async (video) => {
        try {
            // Save the active video information to Firestore
            const activeVideoRef = doc(db, "settings", "activeVideo");
            await setDoc(activeVideoRef, {
                name: video.name,
                url: video.url,
                date: video.date,
            });
            setActiveVideo(video); // Update local state as well
        } catch (error) {
            console.error("Error setting active video:", error);
        }
    };

    // Load the "Aktiv" video from localStorage on component mount
    useEffect(() => {
        const savedVideo = localStorage.getItem("activeVideo");
        if (savedVideo) {
            setActiveVideo(JSON.parse(savedVideo));
        }
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Video Selection</h1>
            <Link href="/upload" className="bg-blue-500 text-white py-2 px-4 rounded mb-4 inline-block">
                Upload Video
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                    <div key={video.url} className="border p-4 rounded-lg">
                        <video src={video.url} controls width="100%" className="mb-2" />
                        <h2 className="text-xl font-semibold">{video.name}</h2>
                        <p>{video.date.toLocaleDateString()}</p>
                        <button
                            onClick={() => handleSetActiveVideo(video)}
                            className={`mt-2 py-1 px-3 rounded ${
                                activeVideo?.url === video.url ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
                            }`}
                        >
                            {activeVideo?.url === video.url ? "Aktiv" : "Set as Aktiv"}
                        </button>
                    </div>
                ))}
            </div>
            {activeVideo && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold">Aktiv Video</h2>
                    <video src={activeVideo.url} controls width="100%" className="mt-2" />
                </div>
            )}
        </div>
    );
}
