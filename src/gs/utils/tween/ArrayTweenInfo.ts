import { boundClass } from 'autobind-decorator';

@boundClass
export default class ArrayTweenInfo {
    public index: number;
    public start: number;
    public change: number;

    constructor(param1: number, param2: number, param3: number) {
        this.index = param1;
        this.start = param2;
        this.change = param3;
    }
}