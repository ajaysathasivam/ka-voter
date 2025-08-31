'use client'

import apiCall from "@/api/apiCall";
import { API_URL } from "@/lib/common";
import { useEffect, useState } from "react";

export default function StateDistrictAssemblyValidate() {
    const [stateInput, setStateInput] = useState("");
    const [districtInput, setDistrictInput] = useState("");
    const [assemblyInput, setAssemblyInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const [token, setToken] = useState(null);

    useEffect(() => {
        const cookies = document.cookie.split('; ');
        const myCookie = cookies.find(row => row.startsWith('token='));
        if (myCookie) {
            setToken(myCookie.split('=')[1]);
        }
    }, []);
    const canSubmit = districtInput && assemblyInput && stateInput;

    const handleSubmit = async () => {
        if (!canSubmit) return;

        setLoading(true);
        setMessage(null);

        // Create payload in your desired structure
        const payload = {
            name: stateInput,
            districts: [
                {
                    name: districtInput,
                    assemblies: [
                        { name: assemblyInput }
                    ]
                }
            ]
        };

        try {
            const res = await apiCall({
                url: `${API_URL}/api/admin/states`,
                method: "POST",
                body: payload,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setMessage({ type: 'error', text: data.error || 'Something went wrong' });
            } else {
                setMessage({ type: 'success', text: 'State added successfully!' });
                // Optionally clear inputs
                setStateInput('');
                setDistrictInput('');
                setAssemblyInput('');
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md space-y-6">
            {/* State Input */}
            <div>
                <label className="block mb-2 font-semibold text-gray-700">State</label>
                <input
                    type="text"
                    value={stateInput}
                    onChange={(e) => setStateInput(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                    placeholder="Enter state"
                />
            </div>

            {/* District Input */}
            <div>
                <label className="block mb-2 font-semibold text-gray-700">District</label>
                <input
                    type="text"
                    value={districtInput}
                    onChange={(e) => setDistrictInput(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                    placeholder="Enter district"
                />
            </div>

            {/* Assembly Input */}
            <div>
                <label className="block mb-2 font-semibold text-gray-700">Assembly</label>
                <input
                    type="text"
                    value={assemblyInput}
                    onChange={(e) => setAssemblyInput(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                    placeholder="Enter assembly"
                />
            </div>

            {/* Submit Button */}
            <button
                className={`w-full py-2 rounded text-white font-semibold ${canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                disabled={!canSubmit || loading}
                onClick={handleSubmit}
            >
                {loading ? 'Submitting...' : 'Submit'}
            </button>

            {/* Message */}
            {message && (
                <p className={`mt-4 font-semibold ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                    {message.text}
                </p>
            )}
        </div>
    );
}
