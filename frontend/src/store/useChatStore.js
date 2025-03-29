import {create} from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios.js";
import {useAuthStore} from "./useAuthStore.js"

export const useChatStore = create((set,get)=>({
    message: [],
    users: [],
    selectedUser: null,
    isUserLoading:false,
    isMessagesLoading:false,


    getUsers: async () => {
        set({isUserLoading:true});

        try {
            const res = await axiosInstance.get("/messages/users");
            set({users:res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({ isUserLoading:false });
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading:true});

        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({message:res.data})
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({ isMessagesLoading:false });
        }
    },

    sendMessages: async (messageData) => {
        const {selectedUser, message} = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

            set({message:[...message,res.data]})
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    setSelectedUsers: async (selectedUser) => {
        set({selectedUser:selectedUser})
    },
    
    subscribeToMessages: () => {
        const { selectedUser } = get();

        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        socket.on("getLiveMessages",(newMessage)=>{
            if(newMessage.senderId !== selectedUser._id) return
            set({message:[...get().message,newMessage]})
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("getLiveMessages")
    },
}))