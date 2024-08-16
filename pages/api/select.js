import { firestore } from "../../firebase";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { id } = req.body;
        const videoRef = firestore.collection("selected").doc("current");
        await videoRef.set({ id });
        res.status(200).end();
    } else {
        res.status(405).end();
    }
}
