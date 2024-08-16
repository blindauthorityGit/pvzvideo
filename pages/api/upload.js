import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

export const config = {
    api: {
        bodyParser: false, // Disable Next.js's default body parser
    },
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const buffers = [];
            for await (const chunk of req) {
                buffers.push(chunk);
            }
            const buffer = Buffer.concat(buffers);
            const fileName = req.headers["file-name"];
            const mimeType = req.headers["content-type"]; // Get the content type from the headers

            const storageRef = ref(storage, "videos/" + fileName);

            // Add metadata to specify the content type
            const metadata = {
                contentType: mimeType,
            };

            // Upload the file with metadata
            await uploadBytes(storageRef, buffer, metadata);

            const downloadURL = await getDownloadURL(storageRef);
            res.status(200).json({ url: downloadURL });
        } catch (error) {
            console.error("Error uploading file:", error);
            res.status(500).json({ error: "Failed to upload file" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
