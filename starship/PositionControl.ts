import { InputType, Field } from "type-graphql";

@InputType({ description: "Target position input" })
export class PositionControl {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    @Field({ nullable: false })
    x: number;

    @Field({ nullable: false })
    y: number;
}
