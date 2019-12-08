import { Field, ObjectType } from "type-graphql";
import { Translation } from "./Translation";

let lastMessageNum = 0;
function generateMessageID() {
    lastMessageNum += 1;
    return Buffer.from(`Message_${lastMessageNum}`).toString('base64');
}

export interface TranslatableString {
    orig: string,
    en?: string,
}

@ObjectType()
export class Message {
    private title: TranslatableString;
    private body: TranslatableString;

    constructor(
        title: TranslatableString,
        body: TranslatableString
    ) {
        this.title = title;
        this.body = body;
        this.id = generateMessageID();
        this.isRead = false;
    }

    @Field()
    id: string;

    @Field()
    isRead: boolean;

    public getTitle(translation: Translation) {
        if (translation === Translation.ENGLISH) {
            if (this.title.en !== undefined) {
                return this.title.en;
            }
        }
        return this.title.orig;
    }

    public getBody(translation: Translation) {
        if (translation === Translation.ENGLISH) {
            if (this.body.en !== undefined) {
                return this.body.en;
            }
        }
        return this.body.orig;
    }
}
