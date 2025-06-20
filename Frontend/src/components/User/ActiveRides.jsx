import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ActiveRides() {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await api.get("/trips");
                const filtered = response.data
                    .filter(trip => ["requested", "in_progress", "cancelled"].includes(trip.status))
                    .sort((a, b) => {
                        const priority = { requested: 3, in_progress: 2, cancelled: 1 };
                        return priority[a.status] - priority[b.status];
                    })
                    .slice(-5)
                    .reverse();

                setTrips(filtered);
                //console.log(filtered);
            } catch (error) {
                console.error("Error fetching trips:", error);
            }
        };

        fetchTrips();
    }, [trips]);


    const handleCancel = async (tripId) => {
        try {
            const response = await api.post(`/trips/${tripId}/cancel/`);
            toast.success("Trip cancelled successfully!");

            const refreshed = await api.get("/trips");
            const filtered = refreshed.data
                .filter(trip => ["requested", "in_progress"].includes(trip.status))
                .slice(-5)
                .reverse();
            setTrips(filtered);
        } catch (error) {
            console.error("Error cancelling trip:", error);
            toast.error("Failed to cancel trip.");
        }
    };

    const statusBadge = (status) => {
        const base = "px-3 py-1.5 rounded-full text-xs font-semibold text-center";

        if (status === "requested") return `${base} bg-yellow-400 text-black capitalize`;
        if (status === "accepted") return `${base} bg-blue-400 text-black capitalize`;
        if (status === "cancelled") return `${base} bg-red-400 text-black capitalize`;
        if (status === "completed") return `${base} bg-gray-400 text-black capitalize`;

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
                    <div className="hidden md:block w-full max-w-6xl">
                        <div className="overflow-x-auto rounded-lg shadow-md">
                            <table className="min-w-full bg-white text-sm text-left">
                                <thead className="bg-black text-[#068fff] uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Booking ID</th>
                                        <th className="px-4 py-3">Pickup</th>
                                        <th className="px-4 py-3">Drop</th>
                                        <th className="px-4 py-3">Created</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Cancel</th>
                                        <th className="px-4 py-3">Fare</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trips.map((trip) => (
                                        <tr key={trip.tid} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-2 font-medium text-gray-800 text-nowrap">{trip.booking_code}</td>
                                            <td className="px-4 py-2 items-center">{trip.pickup_location}</td>
                                            <td className="px-4 py-2">{trip.drop_location}</td>
                                            <td className="px-4 py-2 text-nowrap">
                                                {new Date(trip.created_at).toLocaleString("en-IN", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                    hour12: true,
                                                })}

                                            </td>
                                            <td className="px-4 py-2 ">
                                                <span className={statusBadge(trip.status)}>{trip.status}</span>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                {trip.status === "requested" ? (
                                                    <button
                                                        onClick={() => handleCancel(trip.tid)}
                                                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500 text-white"
                                                    >
                                                        Cancel
                                                    </button>
                                                ) : (
                                                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-300 text-black text-nowrap">
                                                        Not Available
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">{trip.fare}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden w-full max-w-lg space-y-4">
                        {trips.map((trip) => (
                            <div key={trip.tid} className="bg-white rounded-lg shadow-md p-4">
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

                                {trip.status === "requested" && (
                                    <button
                                        onClick={() => handleCancel(trip.tid)}
                                        className="w-full bg-red-500 text-white py-2 rounded text-sm"
                                    >
                                        Cancel Ride
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

export default ActiveRides;
