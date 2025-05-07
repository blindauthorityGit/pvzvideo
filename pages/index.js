import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../firebase";

export async function getServerSideProps() {
    try {
        const activeVideoRef = doc(db, "settings", "activeVideo");
        const activeVideoSnap = await getDoc(activeVideoRef);

        if (activeVideoSnap.exists()) {
            const activeVideoData = activeVideoSnap.data();

            // Convert the date object (or any other non-serializable data) to a string
            if (activeVideoData.date) {
                activeVideoData.date = activeVideoData.date.toDate().toISOString();
            }

            return {
                props: {
                    activeVideo: activeVideoData,
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
                <video
                    src={"https://atelierbuchner.at/pvz/WartezimmerTV070525.mp4"}
                    controls
                    autoPlay
                    loop
                    muted
                    width="100%"
                    style={{ marginTop: "16px" }}
                >
                    Your browser does not support the video tag.
                </video>
            ) : (
                <p>No active video is currently set.</p>
            )}
        </div>
    );
}
