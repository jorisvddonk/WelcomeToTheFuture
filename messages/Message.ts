import { Field, ObjectType } from "type-graphql";

let lastMessageNum = 0;
function generateMessageID() {
    lastMessageNum += 1;
    return Buffer.from(`Message_${lastMessageNum}`).toString('base64');
}

@ObjectType()
export class Message {
    constructor(
        title: string,
        body: string
    ) {
        this.title = title;
        this.body = body;
        this.id = generateMessageID();
        this.isRead = false;
    }

    @Field()
    title: string;

    @Field()
    body: string;

    @Field()
    id: string;

    @Field()
    isRead: boolean;
}
