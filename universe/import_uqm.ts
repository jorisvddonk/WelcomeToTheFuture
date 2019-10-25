import { MapData, UQMPlanet } from "./data/uqm/map_sc2";
import { IStar } from "./IStar"
import { writeFileSync } from "fs";
import { entries } from 'lodash'
import { IBody } from "./IBody";

function getStarPrefix(prefixShort) {
    switch (prefixShort) {
        case "A":
            return "Alpha";
        case "B":
            return "Beta";
        case "C":
            return "Gamma";
        case "D":
            return "Delta";
        case "E":
            return "Epsilon";
        case "F":
            return "Zeta";
        case "G":
            return "Eta";
        case "H":
            return "Theta";
        case "I":
            return "Iota";
        case "J":
            return "Kappa";
        case "K":
            return "Lambda";
        case "L":
            return "Mu";
        case "M":
            return "Nu";
        case "N":
            return "Xi";
        case "*":
            return "";
    }
}

MapData.forEach(constellation => {
    constellation.stars.forEach(star => {
        const starPrefix = getStarPrefix(star.id)
        const starName = `${starPrefix}${starPrefix.length > 0 ? ' ' : ''}${constellation.name}`
        const exportStar: IStar = {
            name: starName,
            mass: (star.size + 1) * 3e+24, // todo: figure out?
            position: {
                x: star.x,
                y: star.y
            },
            bodies: entries(star.planets).map((entry: [string, UQMPlanet]) => {
                const planet = entry[1];
                const retPlanet: IBody = {
                    position: {
                        x: 0, y: 0
                    },
                    name: entry[0],
                    distance_from_parent: (parseInt(planet.DistFromStar) / 512) * 149600000,
                    diameter: (parseInt(planet.Radius) / 100) * 12756,
                    gravity: (parseInt(planet.Gravity) / 100) * 9.8,
                    length_of_day: parseInt(planet.Day) / 10,
                    mass: 0, // todo?,
                    orbital_period: 0 // todo?
                }
                return retPlanet;
            })
        };
        writeFileSync(`${__dirname}/data/${starName}.json`, JSON.stringify(exportStar, null, 2))
    })
})