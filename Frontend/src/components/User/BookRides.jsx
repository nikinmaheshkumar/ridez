import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import axios from "axios";
import { MdLocationPin } from "react-icons/md";
import { FaFlagCheckered } from "react-icons/fa";

function BookRides() {
    const [drop, setDrop] = useState(false);
    const [pickLoc, setPickLoc] = useState("");
    const [dropLoc, setDropLoc] = useState("");

    const [pickSuggestions, setPickSuggestions] = useState([]);
    const [dropSuggestions, setDropSuggestions] = useState([]);

    const [pickCoords, setPickCoords] = useState(null);
    const [dropCoords, setDropCoords] = useState(null);
    const [fareDetails, setFareDetails] = useState(null);

    const pickSelectedRef = useRef(false);
    const dropSelectedRef = useRef(false);

    const generateBookingCode = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const digits = Math.floor(1000 + Math.random() * 9000);
        const randomLetters = Array(3).fill(0).map(() => letters[Math.floor(Math.random() * letters.length)]).join('');
        return `TRIP-${randomLetters}${digits}`;
    };

    const fetchSuggestions = async (text, setter) => {
        if (!text.trim()) return setter([]);
        try {
            const res = await axios.get("https://api.openrouteservice.org/geocode/autocomplete", {
                params: {
                    api_key: import.meta.env.VITE_GEO_API_KEY,
                    text,
                    "boundary.country": "in",
                },
            });
            const suggestions = res.data.features.map((feature) => ({
                label: feature.properties.label,
                coords: feature.geometry.coordinates,
            }));
            setter(suggestions);
        } catch (err) {
            console.error("Autocomplete error:", err);
        }
    };

    useEffect(() => {
        if (!pickSelectedRef.current) {
            const timer = setTimeout(() => fetchSuggestions(pickLoc, setPickSuggestions), 300);
            return () => clearTimeout(timer);
        } else {
            pickSelectedRef.current = false;
        }
    }, [pickLoc]);

    useEffect(() => {
        if (!dropSelectedRef.current) {
            const timer = setTimeout(() => fetchSuggestions(dropLoc, setDropSuggestions), 300);
            return () => clearTimeout(timer);
        } else {
            dropSelectedRef.current = false;
        }
    }, [dropLoc]);

    const calFare = async (e) => {
        e.preventDefault();
        if (!pickCoords || !dropCoords) return alert("Please select both locations.");

        try {
            const response = await axios.post("https://api.openrouteservice.org/v2/directions/driving-car/json", {
                coordinates: [pickCoords, dropCoords],
                units: "km",
            }, {
                headers: {
                    Authorization: import.meta.env.VITE_GEO_API_KEY,
                    "Content-Type": "application/json",
                },
            });

            const route = response.data.routes[0];
            const distance = route.summary.distance;
            const durationSec = route.summary.duration;

            if (!durationSec || isNaN(durationSec)) {
                alert("Could not get travel time from routing API. Try again.");
                return;
            }

            const minutes = Math.ceil(durationSec / 60);
            const hours = Math.floor(minutes / 60);
            const durationFormatted = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes} min`;

            const baseFare = 50.00;
            const distanceFare = distance * 15.00;
            const timeFare = minutes * 0.25;
            const subtotal = baseFare + distanceFare + timeFare;
            const taxes = subtotal * 0.10;
            const total = subtotal + taxes;

            setFareDetails({
                distance: distance.toFixed(2),
                duration: durationFormatted,
                durationMinutes: minutes,
                distanceFare: distanceFare.toFixed(2),
                timeFare: timeFare.toFixed(2),
                subtotal: subtotal.toFixed(2),
                taxes: taxes.toFixed(2),
                total: total.toFixed(2),
            });

            setDrop(true);
        } catch (err) {
            console.error("Error calculating fare:", err);
        }
    };

    const handleTripConfirm = async () => {
        const booking_code = generateBookingCode();

        const payload = {
            booking_code,
            pickup_location: pickLoc,
            pickup_lat: parseFloat(pickCoords[1]),
            pickup_lng: parseFloat(pickCoords[0]),
            drop_location: dropLoc,
            drop_lat: parseFloat(dropCoords[1]),
            drop_lng: parseFloat(dropCoords[0]),
            distance: parseFloat(fareDetails.distance),
            est_duration: parseInt(fareDetails.durationMinutes),
            fare: parseFloat(fareDetails.total),
        };

        try {
            await api.post('/trips/', payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            alert(`Booking Confirmed! Code: ${booking_code}`);
            window.location.reload(); 
        } catch (err) {
            console.error("Trip booking failed:", err.response?.data || err);
            alert("Failed to confirm booking. Please try again.");
        }
    };

    return (
        <div className="flex flex-col max-w-2xl mx-auto w-full px-4">
            <form onSubmit={calFare} className="space-y-6 p-6 bg-white shadow-lg rounded-xl">
                <div className="relative">
                    <div className="flex flex-row gap-3 items-center">
                        <MdLocationPin className="h-5 w-5 text-black" />
                        <label className="block text-md font-medium text-black mb-1">Pickup Location</label>
                    </div>
                    <input
                        type="text"
                        value={pickLoc}
                        onChange={(e) => setPickLoc(e.target.value)}
                        placeholder="Enter Pickup Location"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {pickSuggestions.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 bg-white border z-10 max-h-60 overflow-y-auto shadow-md rounded-md mt-1">
                            {pickSuggestions.map((s, i) => (
                                <li
                                    key={i}
                                    onClick={() => {
                                        setPickLoc(s.label);
                                        setPickCoords(s.coords);
                                        pickSelectedRef.current = true;
                                        setPickSuggestions([]);
                                    }}
                                    className="p-3 hover:bg-blue-100 cursor-pointer text-sm"
                                >
                                    {s.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="relative">
                    <div className="flex flex-row gap-3 items-center">
                        <FaFlagCheckered className="h-5 w-5 text-black" />
                        <label className="block text-md font-medium text-black mb-1">Drop Location</label>
                    </div>
                    <input
                        type="text"
                        value={dropLoc}
                        onChange={(e) => setDropLoc(e.target.value)}
                        placeholder="Enter Drop Location"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {dropSuggestions.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 bg-white border z-10 max-h-60 overflow-y-auto shadow-md rounded-md mt-1">
                            {dropSuggestions.map((s, i) => (
                                <li
                                    key={i}
                                    onClick={() => {
                                        setDropLoc(s.label);
                                        setDropCoords(s.coords);
                                        dropSelectedRef.current = true;
                                        setDropSuggestions([]);
                                    }}
                                    className="p-3 hover:bg-blue-100 cursor-pointer text-sm"
                                >
                                    {s.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-3 bg-blue-600 text-white text-base font-semibold rounded-md hover:bg-blue-700 transition"
                >
                    Calculate Fare
                </button>
            </form>

            {drop && fareDetails && (
                <div className="mt-6 bg-white shadow-md p-6 rounded-lg text-sm text-gray-800">
                    <h3 className="text-lg font-bold text-green-600 mb-4">💰 Fare Breakdown</h3>
                    <div className="space-y-1">
                        <div className="flex justify-between"><span>Base fare:</span><span>₹50.00</span></div>
                        <div className="flex justify-between"><span>Distance:</span><span>₹{fareDetails.distanceFare} ({fareDetails.distance} km × ₹15.00/km)</span></div>
                        <div className="flex justify-between"><span>Time:</span><span>₹{fareDetails.timeFare} ({fareDetails.duration} × ₹0.25/min)</span></div>
                        <hr className="my-2 border-t border-gray-300" />
                        <div className="flex justify-between font-semibold"><span>Subtotal:</span><span>₹{fareDetails.subtotal}</span></div>
                        <div className="flex justify-between"><span>Taxes:</span><span>₹{fareDetails.taxes}</span></div>
                        <hr className="my-2 border-t border-gray-300" />
                        <div className="flex justify-between text-lg font-bold"><span>Total:</span><span>₹{fareDetails.total}</span></div>
                    </div>

                    <button
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
                        onClick={handleTripConfirm}
                    >
                        Confirm & Close
                    </button>
                </div>
            )}
        </div>
    );
}

export default BookRides;
