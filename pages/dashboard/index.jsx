import { useState, useEffect } from "react";
import { storage, ref, listAll, getDownloadURL, deleteObject } from "../../firebase";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore/lite";
import { db } from "../../firebase";
import { useRouter } from "next/router";

export default function Dashboard() {
    const [videos, setVideos] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const authenticated = localStorage.getItem("authenticated");

        if (!authenticated) {
            router.push("/login"); // Redirect to login if not authenticated
        }
    }, [router]);

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
                        id: itemRef.name, // Use the file name as an ID
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

    // Function to delete a video
    const handleDeleteVideo = async (video) => {
        const confirmDelete = confirm(`Are you sure you want to delete the video "${video.name}"?`);
        if (!confirmDelete) return;
        console.log(video.id);

        try {
            const response = await fetch("/api/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: video.id }),
            });

            if (response.ok) {
                // Remove video from UI after successful deletion
                setVideos(videos.filter((v) => v.id !== video.id));

                if (activeVideo?.id === video.id) {
                    setActiveVideo(null); // Clear active video if it's the one being deleted
                }

                console.log(`Video "${video.name}" deleted successfully.`);
            } else {
                const data = await response.json();
                console.error(`Failed to delete video: ${data.message}`);
            }
        } catch (error) {
            console.error("Error deleting video:", error);
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
            <Link href="/dashboard/upload" className="bg-blue-500 text-white py-2 px-4 rounded mb-4 inline-block">
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
                        <button
                            onClick={() => handleDeleteVideo(video)}
                            className="mt-2 py-1 px-3 rounded bg-red-500 text-white ml-2"
                        >
                            Delete
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
