import { boundClass } from 'autobind-decorator';

@boundClass
export default class MouseData {
    public clickTriggerIndex: number;
    public rollOutTriggerIndex: number;
    public click: boolean;
    public rollOut: boolean;
    public first: number = 0;

    public mouseData() { }
}