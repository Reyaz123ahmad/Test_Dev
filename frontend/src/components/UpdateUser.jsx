import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

export default function UpdateUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        mobileNumber: "",
        name: "",
        city: "",
        state: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${id}`);

                setFormData({
                    name: response.data.name || "",
                    city: response.data.city || "",
                    state: response.data.state || "",
                    email: response.data.email || "",
                    mobileNumber: response.data.mobileNumber || ""
                });
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to fetch user"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

  
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

  
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            await api.put(`/users/${id}`, formData);

            setSuccess("User updated successfully");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update user"
            );
        }
    };

    if (loading) {
        return <p className="p-6">Loading user...</p>;
    }

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm">
            <h1 className="text-2xl font-bold mb-6">
                Update User
            </h1>

            {error && (
                <p className="text-red-600 mb-4">
                    {error}
                </p>
            )}

            {success && (
                <p className="text-green-600 mb-4">
                    {success}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block mb-1 font-medium">
                        Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">
                        Email
                    </label>

                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">
                        Mobile Number
                    </label>

                    <input
                        type="text"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        City
                    </label>

                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        State
                    </label>

                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Update User
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    );
}