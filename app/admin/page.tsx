"use client";
import {
  deleteUserForAdminPage,
  fetchDataForAdminPage,
  updateAccountHolderNameForAdminPage,
} from "@/lib/serverSideFunctions";
import { DeleteResponse, UpdateResponse, User } from "@/types/types";
import { useState, useEffect } from "react";

//mock data to simulate user accounts
const mockUsers = [
  { accountNumber: "123456", username: "John Doe" },
  { accountNumber: "654321", username: "Jane Doe" },
  { accountNumber: "112233", username: "Sam Smith" },
];

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Fetch all users data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const initialUsers = await fetchDataForAdminPage(); // Fetch from your API or backend

        setUsers(initialUsers); // Assuming fetchDataForAdminPage returns an array of users
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    setIsLoading(true);
    fetchInitialData();
    setIsLoading(false);
  }, []);

  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      username === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
      password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      setIsLoggedIn(true);
    } else {
      alert("Invalid login details");
    }
  };

  // Handle user edit submission
  const handleEditSubmit = async (
    accountNumber: string,
    newUsername: string
  ) => {
    try {
      const res: UpdateResponse = await updateAccountHolderNameForAdminPage(
        accountNumber,
        newUsername
      );
      alert(res.message);
      console.log(newUsername)
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.accountNo === accountNumber
            ? { ...user, accountHolderName: newUsername }
            : user
        )
      );
      setEditUser(null);
    } catch (error) {
        if (error instanceof Error) {
            setError(`Failed to update account: ${error.message}`);
          } else {
            setError("An unknown error occurred.");
          }
    }
  };

  // Handle user deletion
  const handleDelete = async (accountNumber: string) => {
    try {
      const res: DeleteResponse = await deleteUserForAdminPage(accountNumber);
      alert(res.message);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.accountNo !== accountNumber)
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(`Failed to delete account: ${error.message}`);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4 text-black">
            Admin Login
          </h1>
          <form onSubmit={handleLogin}>
            <div className="justify-between space-x-1 mb-2">
              <label className="text-left text-black text-lg ">
                Username:{" "}
              </label>
              <input
                className="text-lg text-black"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin name"
              />
            </div>
            <div className=" justify-between space-x-2 mb-2">
              <label className="text-left text-black text-lg ">
                Password:{" "}
              </label>
              <input
                className="text-lg text-black"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-xl w-full">
          <p>Loading accounts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-black">Admin Dashboard</h1>
        {users.length === 0 ? (
          <div className="text-center text-black">
            <p>No users available.</p>
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-300 shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-center text-sm font-semibold text-gray-600 border-b">
                  SN
                </th>
                <th className="py-2 px-4 text-center text-sm font-semibold text-gray-600 border-b">
                  Account Number
                </th>
                <th className="py-2 px-4 text-center text-sm font-semibold text-gray-600 border-b">
                  Username
                </th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.accountNo} className="border-t">
                  <td className="py-2 px-4 border-b text-black text-nowrap text-s text-center">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b text-black text-nowrap text-s text-center">
                    {user.accountNo}
                  </td>
                  <td className="py-2 px-4 border-b text-black text-nowrap text-s text-center">
                    {editUser && editUser.accountNo === user.accountNo ? (
                      <input
                        type="text"
                        className="border rounded px-2 py-1"
                        value={editUser.accountHolderName}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            accountHolderName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      user.accountHolderName
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {editUser &&
                    editUser.accountNo === user.accountNo ? (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() =>
                          handleEditSubmit(
                            user.accountNo,
                            editUser.accountHolderName
                          )
                        }
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2 mb-2"
                          onClick={() => setEditUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDelete(user.accountNo)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
