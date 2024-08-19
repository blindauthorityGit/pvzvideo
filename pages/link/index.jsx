import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../../firebase";

export async function getServerSideProps() {
    try {
        const activeVideoRef = doc(db, "settings", "activeVideo");
        const activeVideoSnap = await getDoc(activeVideoRef);

        if (activeVideoSnap.exists()) {
            const activeVideoData = activeVideoSnap.data();
            return {
                props: {
                    videoUrl: activeVideoData.url || null,
                },
            };
        } else {
            return {
                props: {
                    videoUrl: null,
                },
            };
        }
    } catch (error) {
        console.error("Error fetching active video:", error);
        return {
            props: {
                videoUrl: null,
            },
        };
    }
}

export default function VideoLinkPage({ videoUrl }) {
    return (
        <div style={{ padding: "20px" }}>
            {videoUrl ? (
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                    Click here to download or view the video
                </a>
            ) : (
                <p>No active video is currently set.</p>
            )}
        </div>
    );
}
