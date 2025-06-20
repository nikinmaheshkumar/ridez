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
                    .filter(trip => trip.status === "requested")
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
            const response = await api.post(`/trips/${tripId}/accept/`);
            toast.success("Trip Accepted successfully!");

            const refreshed = await api.get("/trips");
            const filtered = refreshed.data
                .filter(trip => ["in_progress"].includes(trip.status))
                .slice(-5)
                .reverse();
            setTrips(filtered);
        } catch (error) {
            console.error("Error cancelling trip:", error);
            toast.error("Failed to cancel trip.");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-3xl mx-auto mt-6">
            {trips.length === 0 ? (
                <div className="text-gray-500 text-sm">No ride requests found.</div>
            ) : (
                <div className="space-y-2">
                    {trips.map((trip) => (
                        <div key={trip.id} className="flex justify-between items-center border-b py-2">
                            <div className="text-sm font-medium">
                                • {trip.user.name || "Unknown"} | {trip.pickup_location} → {trip.drop_location} | ₹{trip.fare}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/driver/requests/${trip.id}`)}
                                    className="text-blue-600 text-sm font-semibold"
                                >
                                    👁 View
                                </button>
                                <button
                                    onClick={() => {
                                        handleAccept(trip.tid)
                                    }}
                                    className="text-green-600 text-sm font-semibold"
                                >
                                    ✅ Accept
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="text-right">
                        <button
                            onClick={() => navigate("/driver/requests")}
                            className="text-[#068fff] text-sm mt-2 font-medium"
                        >
                            [See All] →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DriverRequestsPreview;
