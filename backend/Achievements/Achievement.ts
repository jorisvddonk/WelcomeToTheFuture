import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Achievement {
    public silent: boolean;
    constructor(
        id: string,
        title: string,
        body: string,
        silent?: boolean
    ) {
        this.title = title;
        this.body = body;
        this.id = id;
        this.isUnlocked = false;
        this.silent = silent === undefined ? false : silent;
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
