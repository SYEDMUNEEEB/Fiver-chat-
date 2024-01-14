import React from "react";
import { UserCircleIcon, ChatAltIcon } from "@heroicons/react/solid";

const UserDetailsBox = ({ user }) => {
  // Format the creation time if available
  const formattedCreationTime = user.metadata
    ? new Date(user.metadata.creationTime).toLocaleString()
    : "N/A";

  return (
    <div className="boxx text-center">
      <div className="flex flex-col items-center mb-4">
      <UserCircleIcon className="h-8 w-8 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold text-blue-500">User Details</h2>
      </div>
      <div>
      <div className="flex items-center mb-2">
          <UserCircleIcon className="h-8 w-8 text-gray-500 mr-2" />
          <p className="text-blue-500">Username: {user.displayName}</p>
        </div>
        <p className="text-blue-500">
          User ID:
       {" "}
          {user.uid}
        </p>
        <br/>
        <p className="text-blue-500">
         Creation Time: {formattedCreationTime}
        </p>
        
        {/* Additional user details if needed */}
      </div>
      <div className="flex items-center justify-center mt-4">
        <ChatAltIcon className="h-6 w-6 text-gray-500 mr-2" />
        <p className="text-blue-500">"Act in the way you can succeed"</p>
      </div>
    </div>
  );
};

export default UserDetailsBox;
