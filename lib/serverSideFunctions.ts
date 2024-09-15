// File: lib/serverSideFunctions.ts

import { DeleteResponse, UpdateResponse, User } from "@/types/types";

export const fetchDataForAdminPage = async (): Promise<User[]> => {
  const res = await fetch("http://localhost:5028/api/PalmScan/getAllAccounts");
  const data: User[] = await res.json();
  return data;
};

export const deleteUserForAdminPage = async (
  accountNo: string
): Promise<DeleteResponse> => {
  try {
    const res = await fetch(
      `http://localhost:5028/api/PalmScan/deleteAccount/${accountNo}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response is OK
    if (!res.ok) {
      throw new Error(`Failed to delete account. Status: ${res.status}`);
    }
  
    const data: DeleteResponse = await res.json();
    return data;
  } catch (error) {
    // Catch any error that occurs during the fetch
    if (error instanceof Error) {
      console.error(`Error deleting account: ${error.message}`);
      throw new Error(`Error deleting account: ${error.message}`);
    } else {
      console.error("An unknown error occurred while deleting the account.");
      throw new Error("An unknown error occurred while deleting the account.");
    }
  }
};

export const updateAccountHolderNameForAdminPage = async (accountNo: string, accountHolderName: string): Promise<UpdateResponse> => {
    try {
        console.log(accountNo,accountHolderName)
      const res = await fetch('http://localhost:5028/api/PalmScan/updateAccount', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountNo, accountHolderName }),
      });
  
      if (!res.ok) {
        throw new Error(`Failed to update account. Status: ${res.status}`);
      }
  
      const data:UpdateResponse = await res.json();
      return data;
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  };
  