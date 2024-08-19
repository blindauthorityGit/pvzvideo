import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../firebase";

export async function getServerSideProps() {
    try {
        const activeVideoRef = doc(db, "settings", "activeVideo");
        const activeVideoSnap = await getDoc(activeVideoRef);

        if (activeVideoSnap.exists()) {
            return {
                props: {
                    activeVideo: activeVideoSnap.data(),
                },
            };
        } else {
            return {
                props: {
                    activeVideo: null,
                },
            };
        }
    } catch (error) {
        console.error("Error fetching active video:", error);
        return {
            props: {
                activeVideo: null,
            },
        };
    }
}

export default function NoJS({ activeVideo }) {
    return (
        <div style={{ padding: 0 }}>
            {activeVideo ? (
                <video src={activeVideo.url} controls autoPlay loop muted width="100%" style={{ marginTop: "16px" }}>
                    Your browser does not support the video tag.
                </video>
            ) : (
                <p>No active video is currently set.</p>
            )}
        </div>
    );
}