import { Message } from "./Message";

export class MessagesDAO {
    public messages: Message[] = [];
    private messagesUpdateListeners = [];
    constructor() { }

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

    public addMessage(message: Message) {
        this.messages.push(message);
        this.messagesUpdateListeners.forEach(x => x(message));
    }

    public getMessages() {
        return this.messages;
    }

    public addMessageUpdateListener(listener) {
        this.messagesUpdateListeners.push(listener);
    }

}

export const Messages = new MessagesDAO();