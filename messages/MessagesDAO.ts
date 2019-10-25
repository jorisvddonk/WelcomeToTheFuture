import { Message } from "./Message";

export class MessagesDAO {
    public messages: Message[] = [];
    constructor() {
        this.messages.push(new Message("Test", "Test message"));
    }

    public get(messageid: string) {
        const message = this.messages.find(message => message.id === messageid);
        if (message === undefined) {
            throw new Error("Message not found");
        }
        return message;
    }

    public markAsRead(messageid: string) {
        this.get(messageid).isRead = true;
    }


}

export const Messages = new MessagesDAO();