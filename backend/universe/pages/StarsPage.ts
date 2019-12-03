import { Page, Entry } from "../../lib/Page";
import { Star } from "../Star";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
class StarEntry extends Entry(Star) { }

@ObjectType()
export class StarsPage extends Page(Star, StarEntry) { }