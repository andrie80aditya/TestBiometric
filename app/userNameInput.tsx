import React from "react";

const AccountNameInput = React.memo(
  ({
    accountName,
    onChange,
    disabled
  }: {
    accountName: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled:boolean|undefined
  }) => {
    return (
      <div className="mb-4">
        <label
          htmlFor="userId"
          className="block text-gray-700 font-medium mb-2"
        >
          Accont Name:
        </label>
        <input
          type="text"
          id="userId"
          disabled = {disabled}
          value={accountName}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-black"
          placeholder="Enter your Account Name"
          required
        />
      </div>
    );
  }
);
AccountNameInput.displayName = "AccountNameInput";
export default AccountNameInput;
