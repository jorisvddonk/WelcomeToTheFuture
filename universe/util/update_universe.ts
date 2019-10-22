import "reflect-metadata";

import { readFileSync, writeFileSync } from "fs";
import { IStar } from "../IStar";
import { sortBy } from "lodash";
import { IBody } from "../IBody";
import { Vector } from "../../starship/Vector";
import murmurhash3 from "murmurhash3js";
import MersenneTwister from "mersenne-twister";

const fixStarJson = (filename: string) => {
  const star: IStar = JSON.parse(readFileSync(filename).toString());

  const bodyUpdateOrder: IBody[] = sortBy(star.bodies, (body: IBody) => {
    return body.parent === undefined ? 0 : 1; // assuming that bodies with a parent don't have child bodies; otherwise we have to return the _number of parents in the chain_ here.
  });

  const getParentPosition = (parentName: string) => {
    const foundParent = bodyUpdateOrder.find(body => body.name === parentName);
    if (foundParent === undefined) {
      throw new Error(`Parent ${parentName} not found!`);
    }
    return foundParent.position;
  };

  star.bodies = bodyUpdateOrder.map((body: IBody) => {
    let parentpos = star.position;
    if (body.parent !== undefined) {
      parentpos = getParentPosition(body.parent);
    }

    const seed = murmurhash3.x86.hash32(`${star.name}_${body.name}`);
    const arc = new MersenneTwister(seed).random_long() * Math.PI * 2;
    let dist = body.distance_from_parent;
    if (dist < 20000000 && body.parent !== undefined) {
      dist = 20000000;
    }
    body.position = new Vector(
      parentpos.x + (Math.sin(arc) * dist) / 1.5e5,
      parentpos.y + (Math.cos(arc) * dist) / 1.5e5
    );

    return body;
  });

  writeFileSync(filename, JSON.stringify(star, null, 2));
};

fixStarJson(__dirname + "/../data/sol.json");
