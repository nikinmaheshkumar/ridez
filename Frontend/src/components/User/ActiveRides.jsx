import { useEffect, useState } from "react";
import api from "../../services/api"

function ActiveRides() {

    const [trips, setTrips] = useState([]);
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await api.get("/trips");
                setTrips(response.data.slice(-5).reverse());
                console.log(trips);
            } catch (error) {
                console.error("Error fetching trips:", error);
            }
        };

        fetchTrips();
    }, []);
    const statusBadge = (status) => {
        const base = "px-3 py-1.5 rounded-full text-xs font-semibold ";

        if (status === "requested") return `${base} bg-yellow-400 text-black capitalize`;
        if (status === "accepted") return `${base} bg-blue-400 text-black capitalize`;
        if (status === "in_progress") return `${base} bg-green-400 text-black capitalize`;
        if (status === "completed") return `${base} bg-gray-400 text-black capitalize`;

        return `${base} bg-red-100 text-red-800`; // fallback for unexpected status
    };
    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block w-full max-w-5xl">
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white text-sm text-left">
                        <thead className="bg-black text-[#068fff] uppercase">
                            <tr>
                                <th className="px-4 py-3">Booking ID</th>
                                <th className="px-4 py-3">Pickup Location</th>
                                <th className="px-4 py-3">Drop Location</th>
                                <th className="px-4 py-3">Created At</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Fare</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trips.map((trip) => (
                                <tr key={trip.booking_code} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium text-gray-800">{trip.booking_code}</td>
                                    <td className="px-4 py-2">{trip.pickup_location}</td>
                                    <td className="px-4 py-2">{trip.drop_location}</td>
                                    <td className="px-4 py-2">
                                        {new Date(trip.created_at).toLocaleString("en-IN", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                            hour12: true,
                                        })}
                                    </td>

                                    <td className="px-4 py-2">
                                        <span className={statusBadge(trip.status)}>{trip.status}</span>
                                    </td>
                                    <td className="px-4 py-2">{trip.fare}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden w-full max-w-md space-y-4">
                {trips.map((trip) => (
                    <div key={trip.trip_id} className="bg-white rounded-lg shadow-md p-4">
                        <div className="text-sm text-black">Booking ID</div>
                        <div className="font-semibold text-gray-800 mb-2">{trip.booking_code}</div>

                        <div className="text-sm text-black">Pickup Location</div>
                        <div className="text-gray-500 mb-2">{trip.pickup_location}</div>

                        <div className="text-sm text-black">Drop Location</div>
                        <div className="text-gray-500 mb-2">{trip.drop_location}</div>
                        
                        <div className="text-sm text-black">Drop Location</div>
                        <div className="text-gray-500 mb-2">
                                        {new Date(trip.created_at).toLocaleString("en-IN", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                            hour12: true,
                                        })}
                                    </div>
                        <div className="text-sm text-black">Status</div>
                        <div className="mb-2">
                            <span className={statusBadge(trip.status)}>{trip.status}</span>
                        </div>

                        <div className="text-sm text-black">Fare</div>
                        <div className="text-gray-500">{trip.fare}</div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ActiveRides