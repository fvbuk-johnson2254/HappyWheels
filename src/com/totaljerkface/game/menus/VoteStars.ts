import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2930")] */
@boundClass
export default class VoteStars extends Sprite {
    public filler: Sprite;
    private _rating: number;
    private maxRating: number = 5;

    constructor(param1: number = 0) {
        super();
        this.rating = param1;
        this.mouseChildren = false;
    }

    public get rating(): number {
        return this._rating;
    }

    public set rating(param1: number) {
        this._rating = param1;
        this.filler.scaleX = param1 / this.maxRating;
    }
}