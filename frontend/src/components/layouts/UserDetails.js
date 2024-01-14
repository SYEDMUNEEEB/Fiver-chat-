import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline"; // Import the setting (cog) icon

const UserDetails = ({ user, onlineUsersId, handleToggleStatus }) => {
  const isOnline = onlineUsersId.includes(user.uid);
  const firstNameInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : '';

  const [isChecked, setIsChecked] = useState(true);

  return (
    <div className="border-blue-500 border p-4 rounded mb-4 text-blue-500">
      <div className="flex flex-col items-center mb-2">
        {user.profilePicUrl ? (
          <img
            src={user.profilePicUrl}
            alt={`${user.displayName}'s profile`}
            className="w-8 h-8 rounded-full mb-2"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mb-2">
            <span className="text-gray-600">{firstNameInitial}</span>
          </div>
        )}
        <span className="font-bold mb-2">
          {user.displayName}
          <span className="float-right">
            <Link to="/profile">
              <CogIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Link>
          </span>
        </span>
        <p className="mb-2 text-gray-700 dark:text-gray-400">
          hello, do you want coffee ?
        </p>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer ${
            isChecked ? 'peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white' : ''
          } after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`} />
          <span className={`ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 ${isChecked ? 'text-blue-600' : 'text-red-600'}`}>
            {isChecked ? 'Online' : 'Offline'}
          </span>
        </label>
      </div>
    </div>
  );
};

export default UserDetails;
