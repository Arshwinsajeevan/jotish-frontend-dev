import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backend.jotish.in/backend_dev',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getTableData = async () => {
    try {
        const response = await api.post('/gettabledata.php', {
            username: 'test',
            password: '123456'
        });
        // Note: The requirement says username: "test", password: "123456" for API
        // but the prompt also says "test", "123456" for API POST body.
        // Wait, let me re-read the prompt.
        // "password":"123456"
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export default api;
