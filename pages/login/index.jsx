import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleLogin = (event) => {
        event.preventDefault();
        console.log(email, process.env.NEXT_PUBLIC_EMAIL, password, process.env.NEXT_PUBLIC_PASSWORD);
        if (email === process.env.NEXT_PUBLIC_EMAIL && password === process.env.NEXT_PUBLIC_PASSWORD) {
            // Save authentication state to localStorage (or any client-side storage)
            localStorage.setItem("authenticated", "true");
            router.push("/dashboard"); // Redirect to dashboard after login
        } else {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-80">
                <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
                >
                    Login
                </button>
                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            </form>
        </div>
    );
}
