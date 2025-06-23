import { useEffect, useState } from "react";
import DriverNav from "./DriverNav";
import api from "../../services/api";

function Profile() {
    const [driver, setDriver] = useState(null);

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const response = await api.get("/drivers/");
                setDriver(response.data[0]);
            } catch (error) {
                console.error("Error fetching driver details:", error);
            } 
        };
        fetchDriver();
    }, []);

    if (!driver) return <div className="text-center mt-10 text-red-500">Driver data not found.</div>;

    return (
        <>
            <DriverNav />
            <div className="max-w-4xl mx-auto p-6 mt-6 border-2 border-gray-300 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Driver Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Name</h3>
                        <p className="text-lg text-gray-800">{driver.name}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Email</h3>
                        <p className="text-lg text-gray-800">{driver.email}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Phone Number</h3>
                        <p className="text-lg text-gray-800">{driver.number}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Car Model</h3>
                        <p className="text-lg text-gray-800">{driver.car_model}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Car Number</h3>
                        <p className="text-lg text-gray-800">{driver.car_number}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Car Type</h3>
                        <p className="text-lg text-gray-800 capitalize">{driver.car_type}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">License Number</h3>
                        <p className="text-lg text-gray-800">{driver.license_number}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Status</h3>
                        <p className="text-lg text-gray-800">{driver.is_active ? "Active" : "Inactive"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Joined On</h3>
                        <p className="text-lg text-gray-800">{new Date(driver.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
