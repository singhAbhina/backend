const axios = require('axios');

const getLanguageById = (lang) => {
    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63
    };
    return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: { base64_encoded: 'false' },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: { submissions }
    };

    try {
        const response = await axios.request(options);
        console.log("Batch Submission Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("submitBatch Error:", error.response?.data || error.message);
        throw new Error("Batch Submission Failed");
    }
};

const waiting = (timer) => {
    return new Promise(resolve => setTimeout(resolve, timer));
};

const submitToken = async (resultToken) => {
    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error("submitToken API Error:", error.response?.data || error.message);
            throw new Error("Failed to Fetch Submission Tokens");
        }
    }

    while (true) {
        const result = await fetchData();

        const IsResultObtained = result.submissions.every((r) => r.status_id > 2);

        if (IsResultObtained) {
            console.log("Final Judge0 Submission Results:", result.submissions);
            return result.submissions;
        }

        await waiting(1000); // Proper wait here
    }
};

module.exports = { getLanguageById, submitBatch, submitToken };
