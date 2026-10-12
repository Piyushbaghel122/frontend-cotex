import api from "../../utils/axios"

export const togglePinConversation = async (conversationId) => {
    try {
        const { data } = await api.put(`/api/chat/toggle-pin/${conversationId}`);
        return data;
    } catch (error) {
        console.error("togglePinConversation error:", error);
        return null;
    }
};
