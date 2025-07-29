import Settings from "@/com/totaljerkface/game/Settings";
import LibraryButton from "@/com/totaljerkface/game/editor/ui/LibraryButton";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import BasicMenu from "@/com/totaljerkface/game/menus/BasicMenu";
import CustomizeKeyInput from "@/com/totaljerkface/game/menus/CustomizeKeyInput";
import { boundClass } from 'autobind-decorator';
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import TextField from "flash/text/TextField";

/* [Embed(source="/_assets/assets.swf", symbol="symbol462")] */
@boundClass
export default class CustomizeControlsMenu extends BasicMenu {
    public statusText: TextField;
    public restoreDefaultsButton: LibraryButton;
    private labels: any[];
    private keys: any[];
    private keyCodeNames: Dictionary<any, any>;
    private inputs: any[];
    private clickToChange: string = "Click on your settings to change the key.";
    private enterUniqueKey: string = "Press a key not associated with another action.";

    constructor() {
        super();
        var _loc2_: number = 0;
        var _loc4_ = null;
        var _loc5_: string = null;
        var _loc6_: string = null;
        var _loc7_: CustomizeKeyInput = null;
        this.labels = [
            "Accelerate",
            "Decelerate",
            "Lean forward",
            "Lean back",
            "Primary action",
            "Secondary action 1",
            "Secondary action 2",
            "Eject",
            "Switch Camera",
        ];
        this.keys = [
            "accelerate",
            "decelerate",
            "leanForward",
            "leanBack",
            "primaryAction",
            "secondaryAction1",
            "secondaryAction2",
            "eject",
            "switchCamera",
        ];
        this.inputs = [];

        this.keyCodeNames = new Dictionary();
        this.keyCodeNames[8] = "Backspace";
        this.keyCodeNames[9] = "Tab";
        this.keyCodeNames[13] = "Enter";
        this.keyCodeNames[16] = "Shift";
        this.keyCodeNames[17] = "Control";
        this.keyCodeNames[20] = "Caps Lock";
        this.keyCodeNames[27] = "Esc";
        this.keyCodeNames[32] = "Spacebar";
        this.keyCodeNames[33] = "Page Up";
        this.keyCodeNames[34] = "Page Down";
        this.keyCodeNames[35] = "End";
        this.keyCodeNames[36] = "Home";
        this.keyCodeNames[37] = "Left Arrow";
        this.keyCodeNames[38] = "Up Arrow";
        this.keyCodeNames[39] = "Right Arrow";
        this.keyCodeNames[40] = "Down Arrow";
        this.keyCodeNames[45] = "Insert";
        this.keyCodeNames[46] = "Delete";
        this.keyCodeNames[144] = "Num Lock";
        this.keyCodeNames[145] = "ScrLk";
        this.keyCodeNames[19] = "Pause/Break";
        this.keyCodeNames[65] = "A";
        this.keyCodeNames[66] = "B";
        this.keyCodeNames[67] = "C";
        this.keyCodeNames[68] = "D";
        this.keyCodeNames[69] = "E";
        this.keyCodeNames[70] = "F";
        this.keyCodeNames[71] = "G";
        this.keyCodeNames[72] = "H";
        this.keyCodeNames[73] = "I";
        this.keyCodeNames[74] = "J";
        this.keyCodeNames[75] = "K";
        this.keyCodeNames[76] = "L";
        this.keyCodeNames[77] = "M";
        this.keyCodeNames[78] = "N";
        this.keyCodeNames[79] = "O";
        this.keyCodeNames[80] = "P";
        this.keyCodeNames[81] = "Q";
        this.keyCodeNames[82] = "R";
        this.keyCodeNames[83] = "S";
        this.keyCodeNames[84] = "T";
        this.keyCodeNames[85] = "U";
        this.keyCodeNames[86] = "V";
        this.keyCodeNames[87] = "W";
        this.keyCodeNames[88] = "X";
        this.keyCodeNames[89] = "Y";
        this.keyCodeNames[90] = "Z";
        this.keyCodeNames[48] = "0";
        this.keyCodeNames[49] = "1";
        this.keyCodeNames[50] = "2";
        this.keyCodeNames[51] = "3";
        this.keyCodeNames[52] = "4";
        this.keyCodeNames[53] = "5";
        this.keyCodeNames[54] = "6";
        this.keyCodeNames[55] = "7";
        this.keyCodeNames[56] = "8";
        this.keyCodeNames[57] = "9";
        this.keyCodeNames[186] = ";";
        this.keyCodeNames[187] = "=";
        this.keyCodeNames[189] = "-";
        this.keyCodeNames[191] = "/?";
        this.keyCodeNames[192] = "~";
        this.keyCodeNames[219] = "[";
        this.keyCodeNames[220] = "|";
        this.keyCodeNames[221] = "]";
        this.keyCodeNames[222] = '"';
        this.keyCodeNames[188] = ",";
        this.keyCodeNames[190] = ".";
        this.keyCodeNames[191] = "/";
        this.keyCodeNames[96] = "Numpad 0";
        this.keyCodeNames[97] = "Numpad 1";
        this.keyCodeNames[98] = "Numpad 2";
        this.keyCodeNames[99] = "Numpad 3";
        this.keyCodeNames[100] = "Numpad 4";
        this.keyCodeNames[101] = "Numpad 5";
        this.keyCodeNames[102] = "Numpad 6";
        this.keyCodeNames[103] = "Numpad 7";
        this.keyCodeNames[104] = "Numpad 8";
        this.keyCodeNames[105] = "Numpad 9";
        this.keyCodeNames[106] = "Numpad *";
        this.keyCodeNames[107] = "Numpad +";
        this.keyCodeNames[109] = "Numpad -";
        this.keyCodeNames[110] = "Numpad .";
        this.keyCodeNames[111] = "Numpad /";
        this.keyCodeNames[112] = "F1";
        this.keyCodeNames[113] = "F2";
        this.keyCodeNames[114] = "F3";
        this.keyCodeNames[115] = "F4";
        this.keyCodeNames[116] = "F5";
        this.keyCodeNames[117] = "F6";
        this.keyCodeNames[118] = "F7";
        this.keyCodeNames[119] = "F8";
        this.keyCodeNames[120] = "F9";
        this.keyCodeNames[122] = "F11";
        this.keyCodeNames[123] = "F12";
        this.keyCodeNames[124] = "F13";
        this.keyCodeNames[125] = "F14";
        this.keyCodeNames[126] = "F15";
        var _loc1_: number = 369;
        _loc2_ = 102;
        var _loc3_: number = 0;
        while (_loc3_ < this.labels.length) {
            _loc4_ = this.labels[_loc3_] + ":";
            _loc5_ = this.keyCodeNames[Settings[this.keys[_loc3_] + "Code"]];
            _loc6_ =
                this.keyCodeNames[Settings[this.keys[_loc3_] + "DefaultCode"]];
            _loc7_ = new CustomizeKeyInput(_loc4_, _loc5_, _loc6_);
            _loc7_.keyCode = Settings[this.keys[_loc3_] + "Code"];
            _loc7_.addEventListener(
                ValueEvent.VALUE_CHANGE,
                this.handleValueChange,
            );
            _loc7_.addEventListener(
                CustomizeKeyInput.FOCUS_IN,
                this.handleFocusIn,
            );
            _loc7_.addEventListener(
                CustomizeKeyInput.FOCUS_OUT,
                this.handleFocusOut,
            );
            this.inputs.push(_loc7_);
            _loc7_.x = _loc1_;
            _loc7_.y = _loc2_ + _loc3_ * 32;
            this.addChild(_loc7_);
            _loc3_++;
        }
        this.statusText.text = this.clickToChange;
        this.addEventListener(MouseEvent.MOUSE_UP, this.handleMouseUp);
    }

    private handleMouseUp(param1: MouseEvent) {
        var _loc2_: number = 0;
        var _loc3_ = 0;
        if (param1.target == this.restoreDefaultsButton) {
            _loc2_ = 0;
            while (_loc2_ < this.labels.length) {
                _loc3_ = uint(Settings[this.keys[_loc2_] + "DefaultCode"]);
                trace("default: " + _loc3_);
                Settings[this.keys[_loc2_] + "Code"] = _loc3_;
                Settings.sharedObject.data["keyCodes"][
                    this.keys[_loc2_] + "Code"
                ] = _loc3_;
                this.inputs[_loc2_].keyCode = _loc3_;
                this.inputs[_loc2_].text = this.keyCodeNames.get(_loc3_);
                _loc2_++;
            }
        }
    }

    private handleFocusIn(param1: Event) {
        var _loc4_: CustomizeKeyInput = null;
        this.statusText.text = this.enterUniqueKey;
        var _loc2_ = int(this.inputs.indexOf(param1.target));
        var _loc3_: number = 0;
        while (_loc3_ < this.inputs.length) {
            if (_loc3_ != _loc2_) {
                _loc4_ = this.inputs[_loc3_];
                _loc4_.disable();
                _loc4_.clearHighlight();
            }
            _loc3_++;
        }
    }

    private handleFocusOut(param1: Event) {
        var _loc3_: CustomizeKeyInput = null;
        var _loc2_: number = 0;
        while (_loc2_ < this.inputs.length) {
            _loc3_ = this.inputs[_loc2_];
            _loc3_.enable();
            _loc2_++;
        }
        this.statusText.text = this.clickToChange;
    }

    private handleValueChange(param1: ValueEvent) {
        var _loc4_: number = 0;
        var _loc9_: CustomizeKeyInput = null;
        var _loc2_: number = param1.value;
        var _loc3_: CustomizeKeyInput = param1.target as CustomizeKeyInput;
        if (_loc2_ == 27 || _loc2_ == 9) {
            _loc3_.text = _loc3_.lastInput;
            return;
        }
        var _loc5_ = int(this.inputs.indexOf(_loc3_));
        var _loc6_: boolean = true;
        var _loc7_: boolean = true;
        var _loc8_: number = 0;
        while (_loc8_ < this.inputs.length) {
            if (_loc8_ != _loc5_) {
                _loc9_ = this.inputs[_loc8_];
                if (_loc2_ == _loc9_.keyCode) {
                    _loc9_.highlight(true);
                    _loc6_ = false;
                    _loc4_ = _loc8_;
                } else {
                    _loc9_.clearHighlight();
                }
            }
            _loc8_++;
        }
        if (_loc6_) {
            _loc3_.text = this.keyCodeNames.get(_loc2_);
            Settings[this.keys[_loc5_] + "Code"] = _loc2_;
            Settings.sharedObject.data["keyCodes"][this.keys[_loc5_] + "Code"] =
                _loc2_;
        } else {
            this.statusText.text = "The \'" +
                this.keyCodeNames[_loc2_] +
                "\' is associated with \'" +
                this.labels[_loc4_] +
                "\'. Please press another key.";
        }
    }

    public override die() {
        var _loc1_: CustomizeKeyInput = null;
        this.removeEventListener(MouseEvent.MOUSE_UP, this.handleMouseUp);
        var _loc2_: number = 0;
        while (_loc2_ < this.inputs.length) {
            _loc1_ = this.inputs[_loc2_];
            _loc1_.removeEventListener(
                ValueEvent.VALUE_CHANGE,
                this.handleValueChange,
            );
            _loc1_.removeEventListener(
                CustomizeKeyInput.FOCUS_IN,
                this.handleFocusIn,
            );
            _loc1_.removeEventListener(
                CustomizeKeyInput.FOCUS_OUT,
                this.handleFocusOut,
            );
            _loc1_.die();
            _loc2_++;
        }
        super.die();
    }
}