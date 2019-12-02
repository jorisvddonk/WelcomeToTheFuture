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
        body_orig: string,
        body_english?: string
    ) {
        this.title = title;
        this._body = body_orig;
        this._body_en = body_english !== undefined ? body_english : body_orig;
        this.id = generateMessageID();
        this.isRead = false;
    }

    @Field()
    title: string;

    @Field()
    id: string;

    @Field()
    isRead: boolean;

    public _body: string;
    public _body_en: string;
}
