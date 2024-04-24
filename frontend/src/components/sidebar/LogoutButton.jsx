import React from "react";
import { BiLogOut } from "react-icons/bi";
import useLogOut from "../../hooks/useLogOut";

const LogoutButton = () => {
    const { loading, logout } = useLogOut();
    return (
        <div className="absolute bottom-2 left-2 mx-auto">
            <button>
                {!loading ? (
                    <BiLogOut
                        className="w-6 h-6 cursor-pointer text-gray-300"
                        onClick={logout}
                    />
                ) : (
                    <span className="loading loading-spinner"></span>
                )}
            </button>
        </div>
    );
};

export default LogoutButton;
