import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ActionKeyedProperty extends Action {
    private _startVal;
    private _endVal;
    private _key: {};
    private _property: string;
    private _index: number;

    constructor(
        param1: RefSprite,
        param2: string,
        param3,
        param4,
        param5: {},
        param6: number,
    ) {
        super(param1);
        this._property = param2;
        this._startVal = param3;
        this._endVal = param4;
        this._key = param5;
        this._index = param6;
    }

    public override undo() {
        trace(
            "KEYED PROPERTY UNDO " +
            this._property +
            " " +
            this._key +
            " " +
            this.refSprite.name,
        );
        this.refSprite.keyedPropertyObject[this._property][this._key][
            this._index
        ] = this._startVal;
        this.refSprite.setAttributes();
    }

    public override redo() {
        trace(
            "KEYED PROPERTY REDO " +
            this._property +
            " " +
            this._key +
            " " +
            this.refSprite.name,
        );
        this.refSprite.keyedPropertyObject[this._property][this._key][
            this._index
        ] = this._endVal;
        this.refSprite.setAttributes();
    }

    public set endVal(param1) {
        this._endVal = param1;
    }

    public setEndVal() {
        this._endVal =
            this.refSprite.keyedPropertyObject[this._property][this._key][
            this._index
            ];
    }
}