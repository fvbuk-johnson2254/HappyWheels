import { boundClass } from 'autobind-decorator';
import Event from "flash/events/Event";

@boundClass
export default class SessionEvent extends Event {
    public static PAUSE: string;
    public static COMPLETED: string = "completed";
    public static REPLAY_COMPLETED: string = "replaycompleted";

    constructor(param1: string) {
        super(param1);
    }
}