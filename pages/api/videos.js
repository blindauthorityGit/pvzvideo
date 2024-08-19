import { db } from "../../firebase";

export default async function handler(req, res) {
    const snapshot = await db.collection("videos").get(); // Changed from firestore to db
    const videos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(videos);
}
