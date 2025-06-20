import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNav from "./UserNav";
import api from '../../services/api';

function JoinDriver() {
    const navigate = useNavigate();
    const [model, setModel] = useState("");
    const [carNumber, setcarNumber] = useState("");
    const [type, setType] = useState("");
    const [license, setLicense] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [user, setUser] = useState([])
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get("/users/");
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchDetails();
    }, []);
    useEffect(() => {
        console.log("User updated:", user);
    }, [user]);


    const carTypes = ["sedan", "suv", "hatchback", "luxury", "minivan"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            car_model: model.trim(),
            car_number: carNumber.trim().toUpperCase(),
            car_type: type,
            license_number: license.trim().toUpperCase()
        };

        console.log("Submitting payload:", payload);

        try {
            const response = await api.post("/drivers/", payload);

            if (response.status === 201 || response.status === 200) {
                setShowPopup(true);
            } else {
                console.error("Unexpected response:", response);
            }
        } catch (error) {
            if (error.response) {
                console.error("API Error Response:", error.response.data);
                alert("Error: " + JSON.stringify(error.response.data));
            } else {
                console.error("Unexpected Error:", error.message);
                alert("Unexpected Error: " + error.message);
            }
        }
    };


    const handlePopupClose = () => {
        setShowPopup(false);
        localStorage.clear();
        sessionStorage.clear();
        navigate('/');
    };

    return (
        <>
            <UserNav />
            <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto p-4">
                {/* User Details */}
                <div className="flex flex-col border-2 border-gray-300 shadow-lg w-full max-w-5xl mb-6 p-6 mt-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">User Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-600">Name</h3>
                            <p className="text-lg text-gray-800">{user[0]?.name}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-600">Email</h3>
                            <p className="text-lg text-gray-800">{user[0]?.email}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-600">Phone</h3>
                            <p className="text-lg text-gray-800">{user[0]?.number}</p>
                        </div>
                    </div>
                </div>

                {/* Driver Form */}
                <div className="w-full max-w-3xl">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Join as Driver</h2>
                    <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-300 shadow-lg p-6 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Car Model */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Car Model *</label>
                                <input
                                    type="text"
                                    name="car_model"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className={'w-full px-3 py-2 border rounded-md focus:outline-non border-gray-300'}
                                    placeholder="e.g., Toyota Camry"
                                    required
                                />
                            </div>

                            {/* Car Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Car Number *</label>
                                <input
                                    required
                                    type="text"
                                    name="car_number"
                                    value={carNumber}
                                    onChange={(e) => setcarNumber(e.target.value)}
                                    className={'w-full px-3 py-2 border rounded-md focus:outline-none border-gray-300'}
                                    placeholder="e.g., TN 01 AB 1234"
                                    pattern="^[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}$"


                                />

                            </div>

                            {/* Car Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Car Type *</label>
                                <select
                                    required
                                    name="car_type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className={'w-full px-3 py-2 border rounded-md focus:outline-none border-gray-300 capitalize'}
                                >
                                    <option value="">Select car type</option>
                                    {carTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* License Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
                                <input
                                    required
                                    type="text"
                                    name="license_number"
                                    value={license}
                                    onChange={(e) => setLicense(e.target.value)}
                                    className={'w-full px-3 py-2 border rounded-md focus:outline-none border-gray-300'}
                                    placeholder="e.g., DL12345678"
                                    pattern="^[A-Z]{2}\d{8,}$"

                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                            >
                                Join as Driver
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="mb-4">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Registration Successful!
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Thanks for registering as a driver. You will now be redirected to the login page.
                            </p>
                            <button
                                onClick={handlePopupClose}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none transition"
                            >
                                Continue to Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default JoinDriver;
