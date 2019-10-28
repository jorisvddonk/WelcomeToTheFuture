import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Achievement {
    constructor(
        id: string,
        title: string,
        body: string
    ) {
        this.title = title;
        this.body = body;
        this.id = id;
        this.isUnlocked = false;
    }

    @Field()
    title: string;

    @Field()
    body: string;

    @Field()
    id: string;

    @Field()
    isUnlocked: boolean;
}
