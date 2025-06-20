import { useEffect, useState } from "react";
import api from "../../services/api";
import UserNav from "./UserNav";
import { FaHistory } from "react-icons/fa";

function History() {
    const [trips, setTrips] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const tripsPerPage = 8;

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await api.get("/trips");
                setTrips(response.data);
            } catch (error) {
                console.error("Error fetching trips:", error);
            }
        };

        fetchTrips();
    }, []);

    const totalPages = Math.ceil(trips.length / tripsPerPage);
    const startIndex = (currentPage - 1) * tripsPerPage;
    const endIndex = startIndex + tripsPerPage;
    const currentTrips = trips.slice(startIndex, endIndex);

    const statusBadge = (status) => {
        const base = "px-3 py-1.5 rounded-full text-xs font-semibold ";
        if (status === "requested") return `${base} bg-yellow-400 text-black capitalize`;
        if (status === "accepted") return `${base} bg-blue-400 text-black capitalize`;
        if (status === "in_progress") return `${base} bg-green-400 text-black capitalize`;
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
            <UserNav />
            <div className="flex flex-row items-center justify-center mt-7 transition hover:-translate-y-1 hover:scale-105 duration-300">
                <h1 className="text-3xl font-semibold">History</h1>
                <FaHistory className="h-8 w-8 ml-3" />
            </div>

            {trips.length === 0 ? (
                <div className="text-center text-gray-600 text-lg font-medium mt-10">
                    No trips found in history.
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block w-full max-w-7xl mx-auto mt-7">
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
                                    {currentTrips.map((trip) => (
                                        <tr key={trip.booking_code} className="border-t hover:bg-gray-50">
                                            <td className="px-6 py-3 font-medium text-gray-800">{trip.booking_code}</td>
                                            <td className="px-6 py-3">{trip.pickup_location}</td>
                                            <td className="px-6 py-3">{trip.drop_location}</td>
                                            <td className="px-6 py-3">
                                                {new Date(trip.created_at).toLocaleString("en-IN", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                    hour12: true,
                                                })}
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={statusBadge(trip.status)}>{trip.status}</span>
                                            </td>
                                            <td className="px-6 py-3">{trip.fare}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {renderPagination()}
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden w-full max-w-md mx-auto space-y-4 mt-8">
                        {currentTrips.map((trip) => (
                            <div key={trip.trip_id} className="bg-white rounded-lg shadow-md p-4">
                                <div className="text-sm text-black">Booking ID</div>
                                <div className="font-semibold text-gray-800 mb-2">{trip.booking_code}</div>

                                <div className="text-sm text-black">Pickup Location</div>
                                <div className="text-gray-500 mb-2">{trip.pickup_location}</div>

                                <div className="text-sm text-black">Drop Location</div>
                                <div className="text-gray-500 mb-2">{trip.drop_location}</div>

                                <div className="text-sm text-black">Created At</div>
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
                        {renderPagination()}
                    </div>
                </>
            )}
        </>
    );

}

export default History;
