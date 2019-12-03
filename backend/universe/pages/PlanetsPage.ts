import { Page, Entry } from "../../lib/Page";
import { ObjectType, Field } from "type-graphql";
import { Planet } from "../Planet";

@ObjectType()
class PlanetEntry extends Entry(Planet) { }

@ObjectType()
export class PlanetsPage extends Page(Planet, PlanetEntry) { }