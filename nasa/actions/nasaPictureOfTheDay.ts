import {Action, elizaLogger, HandlerCallback, IAgentRuntime, Memory, State} from "@ai16z/eliza";
import fetch from "node-fetch";

const BASE_URL = "https://api.nasa.gov/planetary/apod\?api_key\=";

export const nasaPictureOfTheDay: Action = {
    name: "NASA_GET_APOD",
    similes: [
        "ASTRONOMY",
        "SPACE",
        "NASA",
        "PLANETS"
    ],
    description: "Get the Nasa Astronomy Picture of the Day.",
    async validate(runtime: IAgentRuntime, message: Memory, state: State | undefined) {
        return !!process.env.NASA_API_KEY;
    },
    async handler(runtime: IAgentRuntime, message: Memory, state: State | undefined, options: { [p: string]: unknown } | undefined, callback: HandlerCallback | undefined): Promise<unknown> {

        try {
            const url = BASE_URL + process.env.NASA_API_KEY
            const response = await fetch(url);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }

            const data = await response.json();

            await callback({
                text: `Here is the NASA Astronomy Picture of the Day: ${data.url}`
            });
            return true;

        } catch (error: any) {
            elizaLogger.error("Error in NASA plugin handler:", error);
            await callback({
                text: `Error fetching APOD: ${error.message}`,
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
                    text: "What's the nasa Astronomy picture of the day?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Let me get the nasa image of the day.",
                    action: "NASA_GET_APOD",
                },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I love space.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Oh really, then let me get the nasa image of the day to make your day even better.",
                    action: "NASA_GET_APOD",
                },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I am in love with space and space travel.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Space is beautiful, dark, scary, and vast. Would you like to see a current photo of space from NASA?",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "yes",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Here is the NASA Astronomy Picture of the Day.",
                    action: "NASA_GET_APOD",
                },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Space is beautiful, dark, scary, and unfathomably vast.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Indeed! Would you like to see a current photo from the NASA astronomy database?",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "yes",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Here is the NASA Astronomy Picture of the Day.",
                    action: "NASA_GET_APOD",
                },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I'm a big fan of space and astronomy.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Would you like to see the Nasa Astronomy Picture of the Day?",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "yes",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Here is the NASA Astronomy Picture of the Day.",
                    action: "NASA_GET_APOD",
                },
            }
        ]
    ],
}
