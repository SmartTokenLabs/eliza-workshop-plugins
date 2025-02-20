import {Plugin} from "@ai16z/eliza";
import {nasaPictureOfTheDay} from "./actions/nasaPictureOfTheDay.ts";

export const nasaPlugin: Plugin = {
    name: "NASA plugin",
    description: "A plugin to get NASA data",
    actions: [nasaPictureOfTheDay],
    providers: []
}
