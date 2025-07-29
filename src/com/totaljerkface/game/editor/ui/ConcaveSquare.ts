import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class ConcaveSquare extends Sprite {
    private topColor: number;
    private sideColor: number = 12040119;
    private bottomColor: number = 15132390;
    private centerColor: number;

    constructor(param1: number, param2: number, param3: number = 16777215) {
        super();
        this.centerColor = param3;
        this.graphics.beginFill(this.topColor);
        this.graphics.lineTo(10, 0);
        this.graphics.lineTo(8, 2);
        this.graphics.lineTo(2, 2);
        this.graphics.lineTo(0, 0);
        this.graphics.endFill();
        this.graphics.beginFill(this.sideColor);
        this.graphics.lineTo(2, 2);
        this.graphics.lineTo(2, 8);
        this.graphics.lineTo(0, 10);
        this.graphics.lineTo(0, 0);
        this.graphics.endFill();
        this.graphics.moveTo(10, 0);
        this.graphics.beginFill(this.sideColor);
        this.graphics.lineTo(10, 10);
        this.graphics.lineTo(8, 8);
        this.graphics.lineTo(8, 2);
        this.graphics.lineTo(10, 0);
        this.graphics.endFill();
        this.graphics.moveTo(0, 10);
        this.graphics.beginFill(this.bottomColor);
        this.graphics.lineTo(2, 8);
        this.graphics.lineTo(8, 8);
        this.graphics.lineTo(10, 10);
        this.graphics.lineTo(0, 10);
        this.graphics.endFill();
        this.graphics.beginFill(param3);
        this.graphics.drawRect(2, 2, 6, 6);
        this.graphics.endFill();
        this.scale9Grid = new Rectangle(2, 2, 6, 6);
        this.width = param1;
        this.height = param2;
    }
}