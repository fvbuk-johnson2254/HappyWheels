import b2Body from "@/Box2D/Dynamics/b2Body";
import Settings from "@/com/totaljerkface/game/Settings";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import TextBoxRef from "@/com/totaljerkface/game/editor/specials/TextBoxRef";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFieldType from "flash/text/TextFieldType";
import TextFormat from "flash/text/TextFormat";

@boundClass
export default class TextBox extends LevelItem {
    protected textField: TextField;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc4_: TextBoxRef = param1 as TextBoxRef;
        var _loc5_ = new TextFormat(
            TextBoxRef.getFontName(_loc4_.font),
            _loc4_.fontSize,
            _loc4_.color,
            TextBoxRef.getFontBold(_loc4_.font),
            null,
            null,
            null,
            null,
            // @ts-expect-error
            TextBoxRef.getAlignment(_loc4_.align),
        );
        this.textField = new TextField();
        this.textField.defaultTextFormat = _loc5_;
        this.textField.type = TextFieldType.DYNAMIC;
        this.textField.multiline = true;
        this.textField.autoSize = TextFieldAutoSize.LEFT;
        this.textField.wordWrap = false;
        this.textField.selectable = false;
        this.textField.embedFonts = true;
        // @ts-expect-error
        this.textField.antiAliasType = AntiAliasType.ADVANCED;
        this.textField.text = _loc4_.caption;
        this.textField.x = _loc4_.x;
        this.textField.y = _loc4_.y;
        this.textField.rotation = _loc4_.rotation;
        if (Settings.currentSession.levelVersion > 1.68) {
            this.textField.alpha = _loc4_.opacity * 0.01;
            this.textField.visible = this.textField.alpha == 0 ? false : true;
        }
        var _loc6_: Sprite = Settings.currentSession.level.background;
        _loc6_.addChild(this.textField);
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.textField;
    }

    public override prepareForTrigger() {
        if (Settings.currentSession.levelVersion < 1.69) {
            this.textField.visible = false;
        }
        trace("setting textfield to invisible");
    }

    public override triggerSingleActivation(
        param1: Trigger,
        param2: string,
        param3: any[],
    ) {
        this.textField.visible = true;
    }

    public override triggerRepeatActivation(
        param1: Trigger,
        param2: string,
        param3: any[],
        param4: number,
    ): boolean {
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        var _loc9_: number = NaN;
        var _loc10_: number = NaN;
        var _loc11_: number = NaN;
        var _loc12_: number = NaN;
        var _loc13_: number = NaN;
        var _loc14_: number = NaN;
        switch (param2) {
            case "change opacity":
                _loc5_ = Number(param3[0]);
                _loc6_ = Number(param3[1]);
                _loc5_ *= 0.01;
                _loc6_ = Math.round(_loc6_ * 30);
                if (param4 == _loc6_) {
                    this.textField.visible = _loc5_ == 0 ? false : true;
                    this.textField.alpha = _loc5_;
                    return true;
                }
                _loc7_ = this.textField.alpha;
                _loc8_ = _loc5_ - _loc7_;
                this.textField.alpha = _loc7_ + _loc8_ / (_loc6_ - param4);
                this.textField.visible =
                    this.textField.alpha == 0 ? false : true;
                break;
            case "slide":
                _loc6_ = Number(param3[0]);
                _loc9_ = Number(param3[1]);
                _loc10_ = Number(param3[2]);
                _loc6_ = Math.round(_loc6_ * 30);
                if (param4 == _loc6_) {
                    this.textField.x = _loc9_;
                    this.textField.y = _loc10_;
                    return true;
                }
                _loc11_ = this.textField.x;
                _loc12_ = this.textField.y;
                _loc13_ = _loc9_ - _loc11_;
                _loc14_ = _loc10_ - _loc12_;
                this.textField.x = _loc11_ + _loc13_ / (_loc6_ - param4);
                this.textField.y = _loc12_ + _loc14_ / (_loc6_ - param4);
                break;
        }
        return false;
    }
}