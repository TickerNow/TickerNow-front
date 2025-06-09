import useSWRMutation from "swr/mutation";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface AiChatArg {
    user_id: string;
    message: string;
    search: string;
}

async function fetchAiResponse(
    url: string,
    { arg }: { arg: AiChatArg }
) {
    const res = await axios.post(url, arg);
    return res.data.reply;
}

export function useAiChat() {
    return useSWRMutation(`${apiUrl}/chat`, fetchAiResponse);
}