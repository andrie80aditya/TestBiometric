"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleNavigateToEnrol = () => {
    router.push("/enrol");
  };

  const handleNavigateToIdentify = () => {
    router.push("/identify");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Welcome to the Home Page
      </h1>
      <div className="space-y-4 flex flex-col">
        <button
          onClick={handleNavigateToEnrol}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          disabled={true}
        >
          Go to Enrollment Page
        </button>
        <button
          onClick={handleNavigateToIdentify}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          disabled={true}
        >
          Go to Identify Page
        </button>
      </div>
    </div>
  );
}
