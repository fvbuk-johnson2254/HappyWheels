import Action from "@/com/totaljerkface/game/editor/actions/Action";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ActionRemoveKeyedIndex extends Action {
    private _key: {};
    private _property: string;
    private _index: number;
    private _tempObject: {};

    constructor(
        param1: RefSprite,
        param2: string,
        param3: {},
        param4: number,
        param5: {},
    ) {
        super(param1);
        this._property = param2;
        this._key = param3;
        this._index = param4;
        this._tempObject = param5;
    }

    public override undo() {
        var _loc4_: any[] = null;
        var _loc5_: number = 0;
        var _loc6_: string = null;
        var _loc7_: Dictionary<any, any> = null;
        var _loc8_: any[] = null;
        trace(
            "REMOVE KEYED INDEX UNDO " +
            this._property +
            " " +
            this._key +
            " " +
            this.refSprite.name,
        );
        var _loc1_: Dictionary<any, any> =
            this.refSprite.keyedPropertyObject[this._property];
        var _loc2_: any[] = _loc1_.get(this._key);
        _loc2_.splice(this._index, 0, this._tempObject[this._property]);
        var _loc3_: number = 0;
        while (_loc3_ < this.refSprite.triggerActionList.length) {
            _loc4_ = this.refSprite.triggerActionListProperties[_loc3_];
            if (_loc4_) {
                _loc5_ = 0;
                while (_loc5_ < _loc4_.length) {
                    _loc6_ = _loc4_[_loc5_];
                    _loc7_ = this.refSprite.keyedPropertyObject[_loc6_];
                    if (_loc7_) {
                        _loc8_ = _loc7_.get(this._key);
                        if (_loc8_) {
                            _loc8_.splice(
                                this._index,
                                0,
                                this._tempObject[_loc6_],
                            );
                        }
                    }
                    _loc5_++;
                }
            }
            _loc3_++;
        }
        this.refSprite.setAttributes();
    }

    public override redo() {
        var _loc4_: number = 0;
        var _loc5_: any[] = null;
        var _loc6_: number = 0;
        var _loc7_: string = null;
        var _loc8_: Dictionary<any, any> = null;
        var _loc9_: any[] = null;
        trace(
            "REMOVE KEYED INDEX REDO " +
            this._property +
            " " +
            this._key +
            " " +
            this.refSprite.name,
        );
        var _loc1_: Dictionary<any, any> =
            this.refSprite.keyedPropertyObject[this._property];
        var _loc2_: any[] = _loc1_.get(this._key);
        var _loc3_ = int(_loc2_.length);
        if (_loc3_ > 1) {
            _loc2_.splice(this._index, 1);
            _loc4_ = 0;
            while (_loc4_ < this.refSprite.triggerActionList.length) {
                _loc5_ = this.refSprite.triggerActionListProperties[_loc4_];
                if (_loc5_) {
                    _loc6_ = 0;
                    while (_loc6_ < _loc5_.length) {
                        _loc7_ = _loc5_[_loc6_];
                        _loc8_ = this.refSprite.keyedPropertyObject[_loc7_];
                        if (_loc8_) {
                            _loc9_ = _loc8_.get(this._key);
                            if (_loc9_) {
                                _loc9_.splice(this._index, 1);
                                trace(_loc9_);
                            }
                        }
                        _loc6_++;
                    }
                }
                _loc4_++;
            }
            this.refSprite.setAttributes();
        }
    }
}