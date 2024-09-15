import React from "react";

const AccountNoInput = React.memo(
  ({
    accountNo,
    onChange,
    disabled
  }: {
    accountNo: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled:boolean|undefined
  }) => {
    return (
      <div className="mb-4">
        <label
          htmlFor="accountNo"
          className="block text-gray-700 font-medium mb-2"
        >
          Account No:
        </label>
        <input
          type="text"
          id="accountNo"
          disabled = {disabled}
          value={accountNo}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-black"
          placeholder="Enter your Account No"
          required
        />
      </div>
    );
  }
);
AccountNoInput.displayName = "UserIAccountNoInputdInput";
export default AccountNoInput;
