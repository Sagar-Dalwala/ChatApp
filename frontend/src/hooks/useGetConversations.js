import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch("api/users");

                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                setConversations(data);

                // // Ensure data is an array before setting conversations
                // if (Array.isArray(data)) {
                //     setConversations(data);
                // } else {
                //     // If data is not an array, set conversations to an empty array
                //     setConversations([]);
                //     throw new Error("Data is not in expected format");
                // }

            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, []);

    return { loading, conversations };
};

export default useGetConversations;
