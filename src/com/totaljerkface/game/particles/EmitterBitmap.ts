import Emitter from "@/com/totaljerkface/game/particles/Emitter";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class EmitterBitmap extends Emitter {
    protected bmdArray: any[];
    protected bmdLength: number;

    constructor(param1: any[], param2: number = 1000) {
        super(param2);
        this.bmdArray = param1;
        this.bmdLength = param1.length;
    }
}