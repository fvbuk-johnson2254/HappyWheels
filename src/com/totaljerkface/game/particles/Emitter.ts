import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class Emitter extends Sprite {
    protected startX: number;
    protected startY: number;
    protected total: number;
    protected count: number;
    protected finished: boolean;

    constructor(param1: number = 1000) {
        super();
        this.total = param1;
        this.finished = false;
        this.count = 0;
    }

    protected createParticle() { }

    public step(): boolean {
        return true;
    }

    public stopSpewing() {
        this.total = this.count;
    }

    public get isFinished(): boolean {
        return this.finished;
    }

    public die() { }
}