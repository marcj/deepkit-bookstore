import { rpc } from '@deepkit/rpc';
import { t } from '@deepkit/type';
import { Subject } from 'rxjs';

class ChatMessage {
    @t created: Date = new Date;

    constructor(
        @t public sender: string,
        @t public message: string,
    ) {
    }
}

export class RpcController {
    chatRoom = new Subject<ChatMessage>();

    @rpc.action()
    chatSend(sender: string, message: string): void {
        this.chatRoom.next(new ChatMessage(sender, message));
    }

    @rpc.action()
    @t.generic(ChatMessage)
    chatWatch(): Subject<ChatMessage> {
        //we create a new subject and redirect to not close the original subject
        const subject = new Subject<ChatMessage>();

        const sub = this.chatRoom.subscribe((v) => {
            subject.next(v);
        });

        subject.subscribe().add(() => sub.unsubscribe());

        return subject;
    }

    @rpc.action().description('Emits for 10 seconds the current time each second, then closes the subject')
    @t.generic(Date)
    timesSubject(): Subject<Date> {
        const subject = new Subject<Date>();

        const interval = setInterval(() => {
            subject.next(new Date);
        }, 1000);

        setTimeout(() => {
            subject.complete();
        }, 10_000);

        subject.subscribe().add(() => {
            clearTimeout(interval);
        });

        return subject;
    }

}
