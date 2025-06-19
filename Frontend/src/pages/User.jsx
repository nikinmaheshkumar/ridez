import UserNav from "../components/User/UserNav";
import ActiveRides from "../components/User/ActiveRides";
function User() {


  return (
    <>
      <UserNav />
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">Active Rides</h1>
        <ActiveRides />
        <h1 className="text-2xl font-bold">User Page</h1>
        <p className="text-gray-600">This is the user page.</p>
      </div>
    </>
  );
}

export default User;
