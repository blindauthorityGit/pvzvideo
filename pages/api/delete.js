import { db, storage } from "../../firebase";
import { doc, deleteDoc } from "firebase/firestore/lite";
import { ref, deleteObject } from "firebase/storage";

export default async function handler(req, res) {
    if (req.method === "DELETE") {
        try {
            const { id } = req.body; // id is the filename in this case
            console.log("Received ID for deletion:", id);

            if (!id) {
                return res.status(400).json({ message: "Missing id in request body" });
            }

            // First, delete the document from Firestore
            const docRef = doc(db, "videos", id);
            await deleteDoc(docRef);
            console.log("Document deleted:", docRef.path);

            // Then, delete the file from Firebase Storage
            const fileRef = ref(storage, `videos/${id}`);
            await deleteObject(fileRef);
            console.log("File deleted from storage:", fileRef.fullPath);

            res.status(200).json({ message: `Document and file with id ${id} deleted successfully` });
        } catch (error) {
            console.error("Error deleting document or file:", error);
            res.status(500).json({ message: "Error deleting document or file", error: error.message });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
