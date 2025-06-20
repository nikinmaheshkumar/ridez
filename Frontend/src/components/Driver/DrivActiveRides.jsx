import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DrivActiveRides() {
    const [trips, setTrips] = useState([]);

    // Fetch trips that are in_progress only
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await api.get("/trips/");
                console.log("Fetched all trips:", response.data);

                const filtered = response.data.filter(trip => trip.status === "in_progress");
                console.log("Filtered in_progress trips:", filtered);

                setTrips(filtered);
            } catch (error) {
                console.error("Error fetching trips:", error);
                toast.error("Failed to fetch trips.");
            }
        };

        fetchTrips();
    }, []);

    // Handle completing the ride
    const handleComplete = async (tripId) => {
        console.log("Attempting to complete trip with ID:", tripId);

        try {
            const response = await api.post(`/trips/${tripId}/complete/`);
            console.log("Trip completion response:", response.data);

            toast.success("Trip marked as completed!");

            // Refresh trip list
            const refreshed = await api.get("/trips/");
            console.log("Refetched trips after completion:", refreshed.data);

            const filtered = refreshed.data.filter(trip => trip.status === "in_progress");
            setTrips(filtered);
        } catch (error) {
            console.error("Error completing trip:", error);

            if (error.response) {
                console.error("Backend error:", error.response.data);
                toast.error(error.response.data.status || "Failed to complete trip.");
            } else {
                toast.error("Failed to complete trip.");
            }
        }
    };

    const statusBadge = (status) => {
        const base = "px-3 py-1.5 rounded-full text-xs font-semibold text-center";
        if (status === "requested") return `${base} bg-yellow-400 text-black capitalize`;
        if (status === "accepted") return `${base} bg-blue-400 text-black capitalize`;
        if (status === "cancelled") return `${base} bg-red-400 text-black capitalize`;
        if (status === "completed") return `${base} bg-gray-400 text-black capitalize`;
        if (status === "in_progress") return `${base} bg-green-400 text-black capitalize`;
        return `${base} bg-red-100 text-red-800`;
    };

    return (
        <>
            {trips.length === 0 ? (
                <div className="text-center text-gray-600 text-lg font-medium my-10">
                    No active rides recently.
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block w-full max-w-6xl mx-auto mt-6">
                        <div className="overflow-x-auto rounded-lg shadow-md">
                            <table className="min-w-full bg-white text-sm text-center">
                                <thead className="bg-black text-[#068fff] uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Booking ID</th>
                                        <th className="px-4 py-3">Pickup</th>
                                        <th className="px-4 py-3">Drop</th>
                                        <th className="px-4 py-3">Created</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Complete</th>
                                        <th className="px-4 py-3">Fare</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trips.map((trip) => (
                                        <tr key={trip.id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-2 font-medium text-gray-800">{trip.booking_code}</td>
                                            <td className="px-4 py-2">{trip.pickup_location}</td>
                                            <td className="px-4 py-2">{trip.drop_location}</td>
                                            <td className="px-4 py-2">
                                                {new Date(trip.created_at).toLocaleString("en-IN", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                    hour12: true,
                                                })}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className={statusBadge(trip.status)}>{trip.status}</span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() => handleComplete(trip.tid)}
                                                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500 text-white"
                                                >
                                                    Complete
                                                </button>
                                            </td>
                                            <td className="px-4 py-2">{trip.fare}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden w-full max-w-lg mx-auto mt-6 space-y-4">
                        {trips.map((trip) => (
                            <div key={trip.id} className="bg-white rounded-lg shadow-md p-4">
                                <div className="text-sm text-black">Booking ID</div>
                                <div className="font-semibold text-gray-800 mb-2">{trip.booking_code}</div>

                                <div className="text-sm text-black">Pickup</div>
                                <div className="text-gray-500 mb-2">{trip.pickup_location}</div>

                                <div className="text-sm text-black">Drop</div>
                                <div className="text-gray-500 mb-2">{trip.drop_location}</div>

                                <div className="text-sm text-black">Time</div>
                                <div className="text-gray-500 mb-2">
                                    {new Date(trip.created_at).toLocaleString("en-IN", {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                        hour12: true,
                                    })}
                                </div>

                                <div className="text-sm text-black">Status</div>
                                <div className="mb-2">
                                    <span className={statusBadge(trip.status)}>{trip.status}</span>
                                </div>

                                <div className="text-sm text-black">Fare</div>
                                <div className="text-gray-500 mb-2">{trip.fare}</div>

                                <button
                                    onClick={() => handleComplete(trip.id)}
                                    className="w-full bg-green-500 text-white py-2 rounded text-sm"
                                >
                                    Complete Ride
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

export default DrivActiveRides;
