import "reflect-metadata";

import { MapData, UQMPlanet } from "./data/uqm/map_sc2";
import { IStar } from "./interfaces/IStar"
import { writeFileSync } from "fs";
import { entries } from 'lodash'
import { IBodyJSON } from "./interfaces/IBody";
import { Hazard } from "./Hazard";
import { IObject } from "./interfaces/IObject";
import { Vector } from "../starship/Vector";
import murmurhash3 from "murmurhash3js";
import MersenneTwister from "mersenne-twister";

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
        const objects: IObject[] = [];
        if (starName === "Beta Giclas") {
            // add lots of ENEMIES!
            const seed = murmurhash3.x86.hash32(`${starName}_enemies`);
            const random = new MersenneTwister(seed);
            for (let i = 0; i < 10; i++) {
                objects.push({
                    position: new Vector((random.random() * 400) - 200, (random.random() * 400) - 200),
                    angle: random.random() * 360,
                    scannerData: Buffer.from('enemyShip').toString('base64')
                })
            }
        }
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
                    bioHazard: getHazard(planet.BioHazard),
                    weatherHazard: getHazard(planet.Weather),
                    tectonicsHazard: getHazard(planet.Tectonics),
                    thermalHazard: getHazard(planet.Thermal),
                    orbital_period: Math.PI * 2 * Math.sqrt(Math.pow(distance_from_parent, 3) / (starmass * 6.674e-11)) / 86400 * 31603 // todo: fix / improve; currently not accurate and uses a magic number `31603` to fix my math
                }
                return retPlanet;
            }),
            objects: objects
        };
        writeFileSync(`${__dirname}/data/${starName}.json`, JSON.stringify(exportStar, null, 2))
    })
})

function getHazard(i: string): Hazard {
    switch (i) {
        case "1":
            return Hazard.NONE
        case "2":
            return Hazard.MINIMUM
        case "3":
            return Hazard.LOW
        case "4":
            return Hazard.MODERATE
        case "5":
            return Hazard.HIGH
        case "6":
            return Hazard.SEVERE
        case "7":
            return Hazard.EXTREME
        case "8":
            return Hazard.INSTANT_DEATH
        default:
            throw new Error("Unknown hazard level: " + i)
    }
}