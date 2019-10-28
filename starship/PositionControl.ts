import { InputType, Field } from "type-graphql";

@InputType({ description: "Target position input" })
export class PositionControl {
    @Field({ nullable: true })
    x: number;

    @Field({ nullable: true })
    y: number;

    @Field({ nullable: true })
    planet: string;
}
