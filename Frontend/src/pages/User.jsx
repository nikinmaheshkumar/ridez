import UserNav from "../components/User/UserNav";
import ActiveRides from "../components/User/ActiveRides";
import BookRides from "../components/User/BookRides";
import { FaRoute,FaCarSide } from "react-icons/fa";
function User() {


  return (
    <>
      <UserNav />
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 px-4 py-8 space-y-6">
        <div className="flex flex-row items-center transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ">
          <h1 className="text-2xl font-semibold">Active Rides</h1>
          <FaRoute className="h-8 w-8 ml-3" />
        </div>
        <ActiveRides />
        <div className="flex flex-row items-center transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ">
          <h1 className="text-2xl font-semibold">Book a Ride</h1>
          <FaCarSide className="h-8 w-8 ml-3" />
        </div>
        <BookRides />
        <h1 className="text-2xl font-bold">User Page</h1>
        <p className="text-gray-600">This is the user page.</p>
      </div>
    </>
  );
}

export default User;
