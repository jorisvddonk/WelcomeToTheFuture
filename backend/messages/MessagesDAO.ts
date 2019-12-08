import { Message } from "./Message";

export class MessagesDAO {
    public messages: Message[] = [];
    private messagesUpdateListeners = [];
    constructor() {
        this.messages.push(new Message("United Federation of Nations High Command", { orig: "How to pilot the starship" }, { orig: "Use the `setThrust`, `setDesiredAngle`, `halt` and `moveTo` GraphQL Mutations to pilot the ship! Use `markAllAsRead` to mark this message as read." }));
        //this.messages.push(new Message("United Federation of Nations High Command", { orig: "Your mission objectives" }, { orig: "Your mission is simple: save the human race, by establishing a colony on another world! First, you must test out the starship control systems and its hyperdrive. Further intructions will follow." }));
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
        this.messagesUpdateListeners.forEach(x => x());
    }

    public markAllAsRead() {
        this.messages.forEach(message => {
            this.markAsRead(message.id);
        });
    }

    public addMessage(message: Message) {
        this.messages.push(message);
        this.messagesUpdateListeners.forEach(x => x());
    }

    public getMessages() {
        return this.messages;
    }

    public addMessageUpdateListener(listener) {
        this.messagesUpdateListeners.push(listener);
    }

}

export const Messages = new MessagesDAO();