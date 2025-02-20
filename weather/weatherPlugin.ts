import {Plugin} from "@ai16z/eliza";
import {currentWeather} from "./actions/currentWeather.ts";

export const weatherPlugin: Plugin = {
    name: "Weather plugin",
    description: "A plugin to get current weather data",
    actions: [currentWeather],
    providers: []
}
