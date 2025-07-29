import { boundClass } from 'autobind-decorator';

@boundClass
export default class TweenInfo {
    public target: {};
    public property: string;
    public start: number;
    public change: number;
    public name: string;
    public isPlugin: boolean;

    constructor(
        param1: {},
        param2: string,
        param3: number,
        param4: number,
        param5: string,
        param6: boolean,
    ) {
        this.target = param1;
        this.property = param2;
        this.start = param3;
        this.change = param4;
        this.name = param5;
        this.isPlugin = param6;
    }
}