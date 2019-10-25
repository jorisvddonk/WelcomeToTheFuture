import "reflect-metadata";

import { readFileSync, writeFileSync } from "fs";
import { IStarJSON } from "../IStar";
import { sortBy } from "lodash";
import { IBodyJSON } from "../IBody";
import { Vector } from "../../starship/Vector";
import murmurhash3 from "murmurhash3js";
import MersenneTwister from "mersenne-twister";
import glob from "glob";

const fixStarJson = (filename: string) => {
  const star: IStarJSON = JSON.parse(readFileSync(filename).toString());

  const bodyUpdateOrder: IBodyJSON[] = sortBy(star.bodies, (body: IBodyJSON) => {
    return body.parent === undefined ? 0 : 1; // assuming that bodies with a parent don't have child bodies; otherwise we have to return the _number of parents in the chain_ here.
  });

  const getParent = (parentName: string) => {
    const foundParent = bodyUpdateOrder.find(body => body.name === parentName);
    if (foundParent === undefined) {
      throw new Error(`Parent ${parentName} not found in ${filename}`);
    }
    return foundParent;
  };

  star.bodies = bodyUpdateOrder.map((body: IBodyJSON) => {
    let parentpos = star.position;
    let parent;
    if (body.parent !== undefined) {
      parent = getParent(body.parent);
      parentpos = parent.position;
    }

    const seed = murmurhash3.x86.hash32(`${star.name}_${body.name}`);
    const arc = new MersenneTwister(seed).random_long() * Math.PI * 2;
    let dist = body.distance_from_parent;
    if (body.parent !== undefined && dist < parent.diameter * 900) {
      dist = parent.diameter * 900;
    }
    body.position = new Vector(
      parentpos.x + (Math.sin(arc) * dist) / 1.5e5,
      parentpos.y + (Math.cos(arc) * dist) / 1.5e5
    );

    return body;
  });

  writeFileSync(filename, JSON.stringify(star, null, 2));
};

glob.sync(__dirname + '/../data/*.json').forEach(path => {
  fixStarJson(path);
})
