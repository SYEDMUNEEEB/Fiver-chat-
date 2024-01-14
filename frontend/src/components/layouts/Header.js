import { LogoutIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import Logout from "../accounts/Logout";
import ThemeToggler from "./ThemeToggler";

export default function Header() {
  const [modal, setModal] = useState(false);
  const { currentUser } = useAuth();

  const isDarkMode = document.documentElement.classList.contains("dark");

  return (
    <>
      <nav className="px-2 sm:px-4 py-2.5 bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-900 text-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span
              className={`text-lg font-bold ${
                isDarkMode ? "text-white" : "text-blue"
              }`}
            >
              <i className="fa fa-commenting-o" aria-hidden="true"></i> Reanime Chat
            </span>
          </Link>

          <div className="flex items-center">
            <ThemeToggler />

            {currentUser && (
              <div className="flex items-center space-x-3 ml-4">
                <button
                  className={`text-gray-500 focus:outline-none rounded-lg p-2.5`}
                  onClick={() => setModal(true)}
                >
                  <LogoutIcon className="h-8 w-8" aria-hidden="true" />
                </button>

                <Link
                  to="/profile"
                  className={`text-gray-500 focus:outline-none rounded-full p-2.5`}
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser.photoURL}
                    alt=""
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {modal && <Logout modal={modal} setModal={setModal} />}
    </>
  );
}
