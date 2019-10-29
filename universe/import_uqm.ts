import { MapData, UQMPlanet } from "./data/uqm/map_sc2";
import { IStar } from "./IStar"
import { writeFileSync } from "fs";
import { entries } from 'lodash'
import { IBodyJSON } from "./IBody";

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
        const starmass = (star.size + 1) * 1.989e+30; // todo: figure out?
        const exportStar: IStar = {
            name: starName,
            mass: starmass,
            position: {
                x: star.x,
                y: star.y
            },
            bodies: entries(star.planets).map((entry: [string, UQMPlanet]) => {
                const planet = entry[1];
                let parent = undefined;
                if (entry[0].indexOf('-') > -1) {
                    parent = entry[0].substr(0, entry[0].indexOf('-'));
                }
                let distance_from_parent = (parseInt(planet.DistFromStar) / 512) * 149600000;
                if (parent !== undefined) {
                    distance_from_parent = distance_from_parent * 0.01; // todo?
                }
                const retPlanet: IBodyJSON = {
                    position: {
                        x: 0, y: 0
                    },
                    name: entry[0],
                    distance_from_parent: distance_from_parent,
                    diameter: (parseInt(planet.Radius) / 100) * 12756,
                    gravity: (parseInt(planet.Gravity) / 100) * 9.8,
                    length_of_day: parseInt(planet.Day) / 10,
                    parent: parent,
                    mass: 0, // todo?,
                    type: planet.Type,
                    orbital_period: Math.PI * 2 * Math.sqrt(Math.pow(distance_from_parent, 3) / (starmass * 6.674e-11)) / 86400 * 31603 // todo: fix / improve; currently not accurate and uses a magic number `31603` to fix my math
                }
                return retPlanet;
            })
        };
        writeFileSync(`${__dirname}/data/${starName}.json`, JSON.stringify(exportStar, null, 2))
    })
})