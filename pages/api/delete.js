import { firestore, storage } from "../../firebase";

export default async function handler(req, res) {
    if (req.method === "DELETE") {
        const { id, name } = req.body;
        const videoRef = firestore.collection("videos").doc(id);
        await videoRef.delete();
        const storageRef = storage.ref().child(`videos/${name}`);
        await storageRef.delete();
        res.status(200).end();
    } else {
        res.status(405).end();
    }
}
