import {
    composeContext,
    elizaLogger,
    generateText,
    IAgentRuntime,
    Memory,
    ModelClass,
    Provider,
    State
} from "@ai16z/eliza";
import fetch from "node-fetch";

const BASE_URL = "https://api.tomorrow.io/v4/weather/realtime";

export const weatherProvider: Provider = {
    async get(runtime: IAgentRuntime, message: Memory, state: State | undefined): Promise<any> {

        const context = composeContext({
            state,
            template: `The user is asking for the weather at a specific location, their message is:
            {{recentMessages}}

            Extract the location from the users message and return it. Do not include anything else in your response`
        })

        const location = await generateText({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
            stop: ["\n"]
        })

        elizaLogger.info("Fetching the weather for: ", location);

        const reqUrl = `${BASE_URL}?apikey=${process.env.WEATHER_API_KEY}&location=${encodeURIComponent(location)}`;

        const weatherRes = await fetch(reqUrl);

        if (!weatherRes.ok) {
            const error = await weatherRes.json();
            throw new Error(error?.message || weatherRes.statusText);
        }

        return {
            success: true,
            data: await weatherRes.json()
        };
    }
}
