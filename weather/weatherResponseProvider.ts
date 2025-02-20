import {IAgentRuntime, Memory, Provider, State} from "@ai16z/eliza";

export const weatherResponseProvider: Provider = {
    async get(runtime: IAgentRuntime, message: Memory, state: State | undefined): Promise<any> {
        return `If the user asks about the current weather, do not attempt to respond to this request since the request will be handled externally.
        Instead write a message telling the user that you are checking the latest data.`
    }
}
