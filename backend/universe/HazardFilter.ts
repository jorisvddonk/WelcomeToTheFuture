import { ArgsType, Field, Int } from "type-graphql";
import { Hazard } from "./Hazard";

@ArgsType()
export class HazardsFilter {
    @Field(type => Hazard, { nullable: true })
    minBio: Hazard
    @Field(type => Hazard, { nullable: true })
    maxBio: Hazard

    @Field(type => Hazard, { nullable: true })
    minThermal: Hazard
    @Field(type => Hazard, { nullable: true })
    maxThermal: Hazard

    @Field(type => Hazard, { nullable: true })
    minWeather: Hazard
    @Field(type => Hazard, { nullable: true })
    maxWeather: Hazard

    @Field(type => Hazard, { nullable: true })
    minTectonics: Hazard
    @Field(type => Hazard, { nullable: true })
    maxTectonics: Hazard
}