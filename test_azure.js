const { OpenAI } = require("openai");
const envData = require('fs').readFileSync('.env.local', 'utf-8');

const env = {};
envData.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length > 0) {
        env[key.trim()] = val.join('=').trim();
    }
});

const deployment_name = env.AZURE_OPENAI_DEPLOYMENT_NAME; // "synapse-ai-core"
const endpoint = "https://synapse-ai-core.openai.azure.com/openai/v1";
const api_key = env.AZURE_OPENAI_API_KEY;

const client = new OpenAI({
    baseURL: endpoint,
    apiKey: api_key,
    defaultHeaders: {
        "api-key": api_key // Add Azure header just in case it's a direct Azure endpoint
    }
});

async function main() {
    console.log("Testing BaseURL Connection...");
    console.log("Endpoint:", endpoint);
    console.log("Deployment:", deployment_name);

    try {
        const response = await client.chat.completions.create({
            model: deployment_name,
            messages: [{ role: "user", content: "What is the capital of France? Return just the city name." }],
        });
        console.log("\nSuccess! Response:");
        console.log(response.choices[0].message.content);
    } catch (e) {
        console.error("\nConnection Failed!");
        console.error(e.message);
    }
}

main();
