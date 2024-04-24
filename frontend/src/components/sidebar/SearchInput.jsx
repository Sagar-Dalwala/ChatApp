import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
    const [search, setSearch] = useState("");
    const { setSelectedConversation } = useConversation();
    const { conversations } = useGetConversations();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!search) return;

        if (search.length <= 2) {
            return toast.error("Search term must be at least 3 characters");
        }

        const conversation = conversations.find((c) =>
            c.fullName.toLowerCase().includes(search.toLowerCase())
        );

        if (conversation) {
            setSelectedConversation(conversation);
            setSearch("");
        }
        else {
            setSearch("");
        }
    };
    return (
        <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search..."
                className="input input-bordered rounded-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button
                type="submit"
                className="btn btn-circle bg-sky-500 text-white"
            >
                <IoSearch className="w-5 h-5 outline-none" />
            </button>
        </form>
    );
};

export default SearchInput;

