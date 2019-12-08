import { Message } from "./Message";

export class MessagesDAO {
    public messages: Message[] = [];
    private messagesUpdateListeners = [];
    constructor() {
        this.messages.push(new Message({ orig: "Hail, future of the human race!" }, { orig: "Glad you've accepted this important mission to save the human race! Under your command is our finest starship. Your mission is simple: find another habitable planet, go there, and colonize it! But first, you might want to figure out how to pilot this GraphQL-powered ship. Hint: use the 'manualControl', 'moveTo' and 'halt' GraphQL mutations to fly around! Good luck! P.S.: you can use the 'markAsRead' mutation to mark this message as read!" }));
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