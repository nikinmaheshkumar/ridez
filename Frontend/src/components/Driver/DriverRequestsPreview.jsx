import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function DriverRequestsPreview() {
    const [trips, setTrips] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await api.get("/trips/");
                console.log("Fetched trips:", response.data);

                const filtered = response.data
                    .filter((trip) => trip.status === "requested")
                    .slice(0, 5);

                console.log("Filtered requested trips (up to 5):", filtered);
                setTrips(filtered);
            } catch (error) {
                console.error("Error fetching requested trips:", error);
            }
        };
        fetchTrips();
    }, []);

    const handleAccept = async (tripId) => {
        try {
            await api.post(`/trips/${tripId}/accept/`);
            toast.success("Trip Accepted successfully!");

            const refreshed = await api.get("/trips/");
            const filtered = refreshed.data
                .filter((trip) => trip.status === "requested")
                .slice(0, 5);
            setTrips(filtered);

            // 🔔 Notify other components (like DrivActiveRides)
            window.dispatchEvent(new Event("tripAccepted"));
        } catch (error) {
            toast.error(error.response?.data?.status || "Failed to accept trip.");
        }
    };


    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-6xl mx-auto mt-6">
            {trips.length === 0 ? (
                <div className="text-gray-500 text-sm">No ride requests found.</div>
            ) : (
                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full text-sm text-center">
                        <thead className="bg-black text-[#068fff] uppercase text-center">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Pickup</th>
                                <th className="px-4 py-3">Drop</th>
                                <th className="px-4 py-3">Distance</th>
                                <th className="px-4 py-3">Fare</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trips.map((trip) => (
                                <tr key={trip.tid} className="border-t text-center">
                                    <td className="px-6 py-4 font-medium text-gray-800 text-nowrap">{trip.user_name || "Unknown"}</td>
                                    <td className="px-6 py-4">{trip.pickup_location}</td>
                                    <td className="px-6 py-4">{trip.drop_location}</td>
                                    <td className="px-6 py-4">{trip.distance}</td>
                                    <td className="px-6 py-4">{trip.fare}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/driver/requests/${trip.tid}`)}
                                            className="text-blue-600 text-sm font-semibold"
                                        >
                                            👁 View
                                        </button>
                                        <button
                                            onClick={() => handleAccept(trip.tid)}
                                            className="text-green-600 text-sm font-semibold"
                                        >
                                            ✅ Accept
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="text-right mt-4">
                <button
                    onClick={() => navigate("/driver/requests")}
                    className="text-[#068fff] text-sm font-medium"
                >
                    [See All] →
                </button>
            </div>
            {/* Mobile Card View */}
            <div className="md:hidden w-full max-w-lg mx-auto mt-6 space-y-4">
                {trips.map((trip) => (
                    <div key={trip.tid} className="bg-white rounded-lg shadow-md p-4">
                        <div className="text-sm text-black">User Name</div>
                        <div className="font-semibold text-gray-800 mb-2">{trip.user_name || "Unknown"}</div>

                        <div className="text-sm text-black">Pickup</div>
                        <div className="text-gray-500 mb-2">{trip.pickup_location}</div>

                        <div className="text-sm text-black">Drop</div>
                        <div className="text-gray-500 mb-2">{trip.drop_location}</div>

                        <div className="text-sm text-black">Distance</div>
                        <div className="text-gray-500 mb-2">{trip.distance} km</div>

                        <div className="text-sm text-black">Fare</div>
                        <div className="text-gray-500 mb-2">₹{trip.fare}</div>

                        <div className="flex justify-between mt-3">
                            <button
                                onClick={() => navigate(`/driver/requests/${trip.tid}`)}
                                className="text-blue-600 text-sm font-semibold"
                            >
                                👁 View
                            </button>
                            <button
                                onClick={() => handleAccept(trip.tid)}
                                className="text-green-600 text-sm font-semibold"
                            >
                                ✅ Accept
                            </button>
                        </div>
                    </div>
                ))}

            </div>

        </div>
    );
}

export default DriverRequestsPreview;
