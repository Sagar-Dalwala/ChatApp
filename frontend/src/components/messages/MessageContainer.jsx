import React, { useEffect } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { TiMessages } from "react-icons/ti";
import useConversation from "../../zustand/useConversation";
import { BiLogOut } from "react-icons/bi";
import { useAuthContext } from "../../context/AuthContext";


const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversation();

    useEffect(() => {
        // clear selected conversation on change
        return () => {
            setSelectedConversation(null);
        };
    }, [setSelectedConversation]);

    return (
        <div className="md:min-w-[450px] flex flex-col">
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    <div className="bg-slate-500 px-4 py-2 mb-2 flex items-center">
                        <img
                            src={selectedConversation.profilePic}
                            alt=""
                            width={35}
                            height={35}
                            className="mr-2"
                        />
                        <span className="text-slate-800 font-bold">
                            {selectedConversation.fullName}
                        </span>

                        <BiLogOut className="ml-auto cursor-pointer text-gray-300 w-5 h-5" onClick={() => setSelectedConversation(null)} />
                    </div>
                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    );
};

export default MessageContainer;

const NoChatSelected = () => {
    const {authUser} = useAuthContext()
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
                <p>Welcome {authUser?.fullName}</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className="text-3xl md:text-6xl text-center" />
            </div>
        </div>
    );
};
