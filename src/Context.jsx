import { createContext, useCallback, useMemo, useState } from "react";
import { io } from "socket.io-client";

export const Context = createContext();

export const ContextProvider = ({ children }) => {

    const socket = useMemo(() => io(`${import.meta.env.VITE_API_URL}`), [])


    const formatDate = useCallback((timestamp, time = false, day = false, timeOnly = false) => {
        if (!timestamp) {
            return null;
        }

        const date = new Date(timestamp);
        const now = new Date();

        const dayOfWeek = date.toLocaleString("default", { weekday: "short" });
        const dayOfMonth = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        if (timeOnly) {
            return `${hours}:${minutes}`;
        }

        // Calculate the difference in days
        const isSameDay = (date1, date2) =>
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();

        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);

        let formattedDate = `${dayOfMonth} ${month} ${year}`;

        if (isSameDay(date, now)) {
            formattedDate = "Today";
        } else if (isSameDay(date, yesterday)) {
            formattedDate = "Yesterday";
        }

        if (time) {
            formattedDate += ` ${hours}:${minutes}`;
        }

        if (day && formattedDate !== "Today" && formattedDate !== "Yesterday") {
            formattedDate = `${dayOfWeek}, ${formattedDate}`;
        }

        return formattedDate;
    }, []);

    const [users, setUsers] = useState([])
    const getUsers = useCallback(async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/getUsers?user_id=${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem('token')
                }
            })
            const json = await response.json();
            if (json.success) {
                setUsers(json.data)
            }

        } catch (error) {
            console.log(error);
            showAlert("Internal error", 'error')
        }
    }, []);
    
    const [userDetails, setUserDetails] = useState(null)

    const getSearchUsers = useCallback(async (id, term) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/search?query=${term}&user_id=${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem('token')
                }
            })
            const json = await response.json();
            if (json.success) {
                return json.data
            }

        } catch (error) {
            console.log(error);
            showAlert("Internal error", 'error')
        }
    }, []);

    return (
        <Context.Provider value={{
            formatDate,
            socket,
            getUsers,
            users,
            setUsers,
            userDetails,
            setUserDetails,
            getSearchUsers,
        }}>
            {children}
        </Context.Provider>
    )
}