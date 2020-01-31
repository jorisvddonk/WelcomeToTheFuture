import { Hazard } from "./Hazard";

export function hazardToNumber(hazard: Hazard) {
    switch (hazard) {
        case Hazard.NONE:
            return 0
        case Hazard.MINIMUM:
            return 1
        case Hazard.LOW:
            return 2
        case Hazard.MODERATE:
            return 3
        case Hazard.HIGH:
            return 4
        case Hazard.SEVERE:
            return 5
        case Hazard.EXTREME:
            return 6
        case Hazard.INSTANT_DEATH:
            return 7
    }
}