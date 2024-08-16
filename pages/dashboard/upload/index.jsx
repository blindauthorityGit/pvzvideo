import { useState } from "react";
import Link from "next/link";

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!videoFile) {
            setMessage("Please select a file to upload.");
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setMessage("");

        try {
            const response = await fetch("../api/upload", {
                method: "POST",
                headers: {
                    "file-name": videoFile.name, // Set the file name in the header
                    "content-type": videoFile.type, // Set the correct MIME type in the header
                },
                body: videoFile,
            });

            if (!response.ok) throw new Error("Upload failed");

            const result = await response.json();

            if (result.url) {
                setMessage(`File uploaded successfully: ${videoFile.name}`);
            } else {
                throw new Error("Failed to get the uploaded file URL.");
            }
        } catch (error) {
            setMessage("Error uploading file: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-80">
                <h1 className="text-2xl font-semibold mb-4 text-center">Upload File</h1>
                <input
                    type="file"
                    accept="video/*" // This restricts the file selection to video files
                    onChange={handleFileChange}
                    className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                <button
                    type="submit"
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
            </form>
            <Link href="/dashboard" className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                Zurück
            </Link>
        </div>
    );
}
