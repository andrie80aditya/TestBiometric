"use client";

import { useState, useEffect, useCallback } from "react";
import AccountNoInput from "../accountNoInput";
import AccountNameInput from "../userNameInput";
import { WebSocketData } from "@/types/types";

const EnrolPage = () => {
  const [accountNo, setAccountNo] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [guidanceMessage, setGuidanceMessage] = useState<string>("");
  const [workMessage, setWorkMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [bitmapUrl, setBitmapUrl] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const defaultMessage = {
    guidance: "Loading guidance message...",
    work: "Loading work message...",
    imageUrl:"/images/PalmSecureSample_GUIDELESS.bmp"
  };
  const handleConnect = () => {
    setErrorMessage("");
    if (!accountNo) {
      setErrorMessage("User ID is required.");
      return;
    }

    const newSocket = new WebSocket(
      `ws://localhost:5028/ws/enrol?accountNo=${accountNo}&accountName=${accountName}`
    );

    newSocket.onopen = () => {
      console.log("WebSocket connection established.");
      setConnected(true);
    };

    newSocket.onmessage = (event) => {
      const data:WebSocketData = JSON.parse(event.data);
      console.log(data);
      if (data.type === "guidance") {
        setGuidanceMessage(data.message);
      } else if (data.type === "work") {
        setWorkMessage(data.message);
      } else if (data.type === "error") {
        setErrorMessage(data.message);
      } else if (data.type === "image") {
        
        // Assuming the bitmap is sent as a base64 encoded string
        setBitmapUrl(`data:image/png;base64,${data.data}`);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed.");
      setConnected(false);
      setSocket(null); // Clear the socket when it's closed
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setErrorMessage("WebSocket error occurred.");
    };

    setSocket(newSocket); // Save the socket instance to state

    // Clean up the socket when the component unmounts
    return () => {
      newSocket.close();
    };
  };

  const handleAccountNoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAccountNo(e.target.value);
    },
    []
  );

  const handleAccountNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAccountName(e.target.value);
    },
    []
  );

  const handleEndConnection = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const endMessage = JSON.stringify({ type: "end" });
      socket.send(endMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">
          Palm Scan Enrollment
        </h1>

        {!connected && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConnect();
            }}
            className="mb-4"
          >
            <AccountNoInput
              accountNo={accountNo}
              onChange={handleAccountNoChange}
              disabled={
                (socket && socket.readyState === WebSocket.OPEN) || undefined
              }
            />
            <AccountNameInput
              accountName={accountName}
              onChange={handleAccountNameChange}
              disabled={
                (socket && socket.readyState === WebSocket.OPEN) || undefined
              }
            />

            <button
              type="submit"
              className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600
      ${
        socket && socket.readyState === WebSocket.OPEN
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
              disabled={
                (socket && socket.readyState === WebSocket.OPEN) || undefined
              }
            >
              Enroll
            </button>
          </form>
        )}

        {connected && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-green-500">Connected</h2>
            <p className="text-gray-700">
              You are now connected. Waiting for data...
            </p>
          </div>
        )}


          <div className="mb-4">
            <img
              src={bitmapUrl||defaultMessage.imageUrl}
              alt="Palm Bitmap"
              className="w-full h-auto rounded"
            />
          </div>
      

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-blue-500">
            Guidance Message:
          </h2>
          <p className="text-gray-700">{guidanceMessage|| defaultMessage.guidance}</p>
        </div>

        
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-green-500">
              Work Message:
            </h2>
            <p className="text-gray-700">{workMessage || defaultMessage.work}</p>
          </div>
        
        {errorMessage && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-red-500">
              Error Message:
            </h2>
            <p className="text-gray-700">{errorMessage}</p>
          </div>
        )}
        {connected && (
          <button
            type="button"
            onClick={handleEndConnection}
            className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600"
          >
            End
          </button>
        )}
      </div>
    </div>
  );
};

export default EnrolPage;
