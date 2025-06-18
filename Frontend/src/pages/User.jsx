import UserNav from "../components/User/UserNav";

function User() {
  return (
    <>
    <UserNav />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">User Page</h1>
        <p className="text-gray-600">This is the user page.</p>
      </div>
    </>
  );
}
export default User;