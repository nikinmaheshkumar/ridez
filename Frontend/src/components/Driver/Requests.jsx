import { useEffect, useState } from "react";
import api from "../../services/api";
import DriverNav from "./DriverNav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Requests() {
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const tripsPerPage = 8;

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await api.get("/trips");
                const filtered = response.data.filter(trip => trip.status === "requested");
                setTrips(filtered);
            } catch (error) {
                console.error("Error fetching trips:", error);
            }
        };

        fetchTrips();
    }, []);

    const handleAccept = async (tripId) => {
        try {
            await api.post(`/trips/${tripId}/accept/`);
            toast.success("Trip Accepted successfully!");

            const refreshed = await api.get("/trips");
            const filtered = refreshed.data.filter(trip => trip.status === "requested");
            setTrips(filtered);

            window.dispatchEvent(new Event("tripAccepted"));
        } catch (error) {
            toast.error(error.response?.data?.status || "Failed to accept trip.");
        }
    };

    const totalPages = Math.ceil(trips.length / tripsPerPage);
    const startIndex = (currentPage - 1) * tripsPerPage;
    const endIndex = startIndex + tripsPerPage;
    const currentTrips = trips.slice(startIndex, endIndex);

    const statusBadge = (status) => {
        const base = "px-3 py-1.5 rounded-full text-xs font-semibold ";
        if (status === "requested") return `${base} bg-yellow-400 text-black capitalize`;
        if (status === "accepted") return `${base} bg-blue-400 text-black capitalize`;
        if (status === "cancelled") return `${base} bg-red-400 text-black capitalize`;
        if (status === "completed") return `${base} bg-gray-400 text-black capitalize`;
        return `${base} bg-red-100 text-red-800`;
    };

    const renderPagination = () => (
        <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    className={`px-3 py-1 rounded border ${currentPage === i + 1
                        ? "bg-[#068fff] text-white"
                        : "bg-white text-black border-gray-300"
                        }`}
                    onClick={() => setCurrentPage(i + 1)}
                >
                    {i + 1}
                </button>
            ))}
        </div>
    );

    return (
        <>
            <DriverNav />
            <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-6xl mx-auto mt-6">
                {/* Desktop View */}
                {currentTrips.length === 0 ? (
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
                                {currentTrips.map((trip) => (
                                    <tr key={trip.tid} className="border-t text-center">
                                        <td className="px-6 py-4 font-medium text-gray-800 text-nowrap">
                                            {trip.user_name || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4">{trip.pickup_location}</td>
                                        <td className="px-6 py-4">{trip.drop_location}</td>
                                        <td className="px-6 py-4">{trip.distance} km</td>
                                        <td className="px-6 py-4">₹{trip.fare}</td>
                                        <td className="px-6 py-4 flex gap-2 justify-center">
                                            <button
                                                onClick={() => {
                                                    setSelectedTrip(trip);
                                                    document.getElementById("trip_modal").showModal();
                                                }}
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
                        {renderPagination()}
                    </div>
                )}
                {/* Mobile View */}
                <div className="md:hidden w-full max-w-lg mx-auto mt-6 space-y-4">
                    {currentTrips.map((trip) => (
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
                                    onClick={() => {
                                        setSelectedTrip(trip);
                                        document.getElementById("trip_modal").showModal();
                                    }}
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
                    {renderPagination()}
                </div>

                <dialog id="trip_modal" className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box w-full sm:max-w-lg overflow-y-auto max-h-[90vh]">
                        <h3 className="font-bold text-xl mb-4 text-gray-800">Trip Details</h3>
                        {selectedTrip ? (
                            <div className="space-y-3 text-sm">
                                <div className="text-center mb-2 bg-blue-100 py-2 rounded-lg">
                                    <div className="text-xs text-blue-600">Booking Code</div>
                                    <div className="text-lg font-semibold text-blue-800">{selectedTrip.booking_code}</div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">User:</span>
                                    <span className="font-medium">{selectedTrip.user_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Pickup:</span>
                                    <span className="font-medium text-right">{selectedTrip.pickup_location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Drop:</span>
                                    <span className="font-medium text-right">{selectedTrip.drop_location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Distance:</span>
                                    <span className="font-medium">{selectedTrip.distance} km</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Est. Duration:</span>
                                    <span className="font-medium">{selectedTrip.est_duration} min</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Fare:</span>
                                    <span className="text-green-600 font-bold">₹{parseFloat(selectedTrip.fare).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="capitalize">{selectedTrip.status}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200">
                                    <div className="text-xs text-gray-500">Created:</div>
                                    <div className="font-medium">
                                        {new Date(selectedTrip.created_at).toLocaleString("en-IN", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                            hour12: true,
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No trip selected.</p>
                        )}
                        <div className="modal-action mt-4">
                            <form method="dialog" className="w-full">
                                <button className="btn btn-block bg-[#068fff] hover:bg-blue-600 text-white">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </>
    );
}

export default Requests;
