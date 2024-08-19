import { db } from "../../firebase";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { id } = req.body;
        const videoRef = db.collection("selected").doc("current"); // Changed from firestore to db
        await videoRef.set({ id });
        res.status(200).end();
    } else {
        res.status(405).end();
    }
}
