
import {
    Action, composeContext,
    elizaLogger,
    generateText,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State
} from "@ai16z/eliza";
import {weatherProvider} from "../weatherProvider.ts";

export const currentWeather: Action = {
    name: "GET_CURRENT_WEATHER",
    similes: [
        "WEATHER",
        "METEOROLOGY",
        "TEMPERATURE"
    ],
    description: "Get current weather for a specific location",
    async validate(runtime: IAgentRuntime, message: Memory, state: State | undefined) {
        return !!process.env.WEATHER_API_KEY;
    },
    async handler(runtime: IAgentRuntime, message: Memory, state: State | undefined, options: { [p: string]: unknown } | undefined, callback: HandlerCallback | undefined): Promise<unknown> {

        try {
            const result = await weatherProvider.get(runtime, message, state);

            console.log("DATA: ", result.data);

            const resultTextContext = composeContext({
                state,
                template: `Given the following weather data for ${result.data.location.name}:

                \`\`\`json
                ${JSON.stringify(result.data.data, undefined, "\t")}
                \`\`\`

                And the users initial request:
                ${message.content.text}

                Write a response to the users request.
                If the user has only requested temperature or some other value, only include those values.
                Otherwise if the user is requesting a general weather forecast, write a full summary based on the available data.
            `})

            const responseText = await generateText({
                runtime,
                context: resultTextContext,
                modelClass: ModelClass.SMALL,
                stop: ["\n"]
            })

            await callback({
                text: responseText,
            });

            return true;

        } catch (error: any) {
            elizaLogger.error("Error in Weather plugin handler:", error);
            await callback({
                text: `Sorry, I encountered an error fetching the weather: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's the weather in London?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "The current weather in London is cloudy with a temperature of 15°C, 75% humidity, and wind speed of 10 km/h",
                    action: "GET_WEATHER",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "How's the weather in New York?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "The current weather in New York is sunny with a temperature of 25°C, 60% humidity, and wind speed of 15 km/h",
                    action: "GET_WEATHER",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's the current temperature in Sydney?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "The current temperature in Sydney is 25°C, but it feels like 26°C",
                    action: "GET_WEATHER",
                },
            },
        ],
    ],
}
