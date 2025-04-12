import { Link } from "react-router-dom";

function ProfileDeletePage() {
  return (
    <div className="relative flex h-dvh w-full items-center justify-center bg-gray-900 p-4">
      <div className="absolute inset-0 z-0">
        <img
          src="/bg.jpg"
          alt="Background"
          className="h-full w-full object-cover opacity-50"
        />
      </div>
      <div className="z-10 w-full max-w-md rounded-xl bg-white p-8 opacity-85 shadow-xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center">
            <img src="/icon.png" alt="logo" className="h-16 w-16" />
            <h1 className="mb-2 text-3xl font-bold text-blue-600">
              Stock Watch App
            </h1>
          </div>
          <p className="text-gray-800 italic">
            Your profile information has been deleted from our database
            successfully.
          </p>
          <Link className="text-blue-800 underline" to="/">
            Sign in again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfileDeletePage;
