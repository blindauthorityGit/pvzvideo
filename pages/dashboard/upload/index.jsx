import { useState } from "react";
import Link from "next/link";
import { storage } from "../../../firebase"; // Adjust the path according to your project structure
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function VideoUpload() {
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check if the file is a video
            if (!file.type.startsWith("video/")) {
                setMessage("Please select a valid video file.");
                setVideoFile(null);
                return;
            }

            // Check if the file size is under 400MB
            const maxSizeInMB = 400;
            if (file.size > maxSizeInMB * 1024 * 1024) {
                setMessage("File size must be under 400MB.");
                setVideoFile(null);
                return;
            }

            setVideoFile(file);
            setMessage("");
        }
    };

    const handleUpload = () => {
        if (!videoFile) {
            setMessage("Please select a file to upload.");
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setMessage("");

        const storageRef = ref(storage, `videos/${videoFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                setUploading(false);
                setMessage("Error uploading file: " + error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setMessage(`File uploaded successfully: ${videoFile.name}`);
                    console.log("File available at", downloadURL);
                    setUploading(false);
                });
            }
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-80">
                <h1 className="text-2xl font-semibold mb-4 text-center">Upload File</h1>
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                <button
                    onClick={handleUpload}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none flex justify-center items-center"
                    disabled={uploading}
                >
                    {uploading ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 text-white mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                                ></path>
                            </svg>
                            Uploading...
                        </>
                    ) : (
                        "Upload"
                    )}
                </button>
                {uploading && (
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}
                {message && (
                    <p className={`mt-4 text-center ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
                        {message}
                    </p>
                )}
            </div>
            <Link href="/dashboard" className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                Zurück
            </Link>
        </div>
    );
}
