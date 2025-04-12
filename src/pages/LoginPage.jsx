import React from "react";
import GoogleSignInButton from "../components/GoogleSignInButton";

function LoginPage() {
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
            Set your target price and receive email alerts when your tracked
            stocks reach it.
          </p>
        </div>
        <GoogleSignInButton />
        <div className="text-xs text-gray-800 italic">
          Note: This application is for demonstration purposes only. Your Google
          Account profile information is used solely within the app and is not
          shared externally. You may choose to delete your profile data from the
          database when logging out of the app.
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
