import DrivActiveRides from "../components/Driver/DrivActiveRides";
import DriverNav from "../components/Driver/DriverNav";
import { FaRoute, FaInbox} from "react-icons/fa";
import DriverRequestsPreview from "../components/Driver/DriverRequestsPreview";
function Driver() {
  return (
    <>
      <DriverNav />
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 px-4 py-8 space-y-6">
        <div className="flex flex-row items-center transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ">
          <h1 className="text-2xl font-semibold">Active Rides</h1>
          <FaRoute className="h-8 w-8 ml-3" />
        </div>
        <DrivActiveRides />
        <div className="flex flex-row items-center transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ">
          <h1 className="text-2xl font-semibold">Ride Requests </h1>
          <FaInbox className="h-8 w-8 ml-3" />
        </div>
        <DriverRequestsPreview />

      </div>
    </>
  );
}
export default Driver;