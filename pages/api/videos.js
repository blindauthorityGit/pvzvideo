import { firestore } from "../../firebase";

export default async function handler(req, res) {
    const snapshot = await firestore.collection("videos").get();
    const videos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(videos);
}
