import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import RefTrigger from "@/com/totaljerkface/game/editor/trigger/RefTrigger";
import InputObject from "@/com/totaljerkface/game/editor/ui/InputObject";
import ListMenu from "@/com/totaljerkface/game/editor/ui/ListMenu";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import Point from "flash/geom/Point";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

@boundClass
export default class ListInput extends InputObject {
    protected labelText: TextField;
    protected valueText: TextField;
    private entryArray: any[];
    private listMenu: ListMenu;
    private _entry: string = "UHH";
    private playSound: boolean;
    private arrowSprite: Sprite;
    private plusSprite: Sprite;
    private minusSprite: Sprite;

    constructor(
        param1: string,
        param2: string,
        param3: any[],
        param4: boolean,
        param5: boolean,
        param6: boolean = false,
    ) {
        super();
        this.attribute = param2;
        this.entryArray = param3;
        this.childInputs = new Array();
        this.editable = param5;
        this.playSound = param4;
        this._expandable = param6;
        this.createLabel(param1);
        this.init();
    }

    private init() {
        this.arrowSprite = new Sprite();
        this.addChild(this.arrowSprite);
        this.arrowSprite.x = 110;
        this.arrowSprite.y = 7;
        this.arrowSprite.graphics.beginFill(4032711);
        this.arrowSprite.graphics.lineTo(10, 8);
        this.arrowSprite.graphics.lineTo(0, 16);
        this.arrowSprite.graphics.lineTo(0, 0);
        this.arrowSprite.graphics.endFill();
        this.arrowSprite.buttonMode = true;
        this.arrowSprite.addEventListener(
            MouseEvent.MOUSE_UP,
            this.arrowUpHandler,
        );
        if (this._expandable) {
            this.drawExpandButton();
        }
    }

    private drawExpandButton() {
        if (!this.plusSprite) {
            this.plusSprite = new Sprite();
            this.addChild(this.plusSprite);
            this.plusSprite.x = 100.5;
            this.plusSprite.y = 14.5;
            this.plusSprite.buttonMode = true;
            this.plusSprite.addEventListener(
                MouseEvent.MOUSE_UP,
                this.expandUpHandler,
            );
            this.plusSprite.addEventListener(
                MouseEvent.ROLL_OVER,
                this.expandOverHandler,
            );
        }
        this.plusSprite.graphics.clear();
        this.plusSprite.graphics.beginFill(16777215);
        this.plusSprite.graphics.drawCircle(0, 0, 4.5);
        this.plusSprite.graphics.endFill();
        if (this.multipleIndex == 0) {
            this.plusSprite.graphics.beginFill(4032711);
            this.plusSprite.graphics.drawRect(-2.5, -0.5, 5, 1);
            this.plusSprite.graphics.endFill();
            this.plusSprite.graphics.beginFill(4032711);
            this.plusSprite.graphics.drawRect(-0.5, -2.5, 1, 5);
            this.plusSprite.graphics.endFill();
        } else {
            this.plusSprite.graphics.beginFill(16613761);
            this.plusSprite.graphics.drawRect(-2.5, -0.5, 5, 1);
            this.plusSprite.graphics.endFill();
        }
    }

    protected createLabel(param1: string) {
        var _loc2_ = new TextFormat(
            "HelveticaNeueLT Std",
            11,
            16777215,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.LEFT,
        );
        this.labelText = new TextField();
        this.labelText.defaultTextFormat = _loc2_;
        this.labelText.autoSize = TextFieldAutoSize.LEFT;
        this.labelText.width = 10;
        this.labelText.height = 17;
        this.labelText.x = 0;
        this.labelText.y = 0;
        this.labelText.multiline = false;
        this.labelText.selectable = false;
        this.labelText.embedFonts = true;
        // @ts-expect-error
        this.labelText.antiAliasType = AntiAliasType.ADVANCED;
        this.labelText.text = param1 + ":";
        this.addChild(this.labelText);
        _loc2_ = new TextFormat(
            "HelveticaNeueLT Std",
            11,
            7895160,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.LEFT,
        );
        this.valueText = new TextField();
        this.valueText.defaultTextFormat = _loc2_;
        this.valueText.autoSize = TextFieldAutoSize.LEFT;
        this.valueText.width = 10;
        this.valueText.height = 17;
        this.valueText.x = 0;
        this.valueText.y =
            Math.ceil(this.labelText.y + this.labelText.height) - 5;
        this.valueText.multiline = false;
        this.valueText.selectable = false;
        this.valueText.embedFonts = true;
        // @ts-expect-error
        this.valueText.antiAliasType = AntiAliasType.ADVANCED;
        this.valueText.text = "";
        this.addChild(this.valueText);
    }

    public get entry(): string {
        return this._entry;
    }

    public set entry(param1: string) {
        if (!this.editable) {
            return;
        }
        this._ambiguous = false;
        this._entry = param1;
        this.valueText.text = this._entry;
    }

    public override setValue(param1) {
        this.entry = param1;
    }

    public override setToAmbiguous() {
        this.valueText.text = "-";
        this._ambiguous = true;
    }

    private arrowUpHandler(param1: MouseEvent) {
        if (this.listMenu) {
            return;
        }
        this.listMenu = new ListMenu(
            this.entryArray,
            this.entry,
            this.playSound,
            this._ambiguous,
        );
        this.stage.addChild(this.listMenu);
        var _loc2_: Point = this.localToGlobal(
            new Point(this.arrowSprite.x, this.arrowSprite.y),
        );
        this.listMenu.x = _loc2_.x;
        this.listMenu.y = Math.round(_loc2_.y - this.listMenu.height * 0.5) + 8;
        var _loc3_: number = Math.round(this.listMenu.y + this.listMenu.height);
        if (this.listMenu.y + this.listMenu.height > 500) {
            this.listMenu.y = Math.ceil(500 - this.listMenu.height);
        }
        this.listMenu.addEventListener(
            ListMenu.ITEM_SELECTED,
            this.itemSelected,
        );
        this.listMenu.addEventListener(MouseEvent.ROLL_OUT, this.closeListMenu);
    }

    private expandUpHandler(param1: MouseEvent) {
        if (this.stage) {
            this.stage.focus = this.stage;
        }
        if (this.multipleIndex == 0) {
            this.dispatchEvent(
                new ValueEvent(ValueEvent.ADD_INPUT, this, this.entry),
            );
        } else {
            this.dispatchEvent(
                new ValueEvent(ValueEvent.REMOVE_INPUT, this, this.entry),
            );
        }
    }

    private expandOverHandler(param1: MouseEvent) {
        var _loc2_: RefTrigger = null;
        var _loc3_: number = 0;
        var _loc4_: number = 0;
        if (this.multipleIndex == 0) {
            _loc2_ = this.multipleKey as RefTrigger;
            _loc3_ = _loc2_.parent.getChildIndex(_loc2_);
            _loc4_ = _loc3_ + 1;
            MouseHelper.instance.show(
                "add another action for trigger " + _loc4_,
                this,
            );
        }
    }

    private itemSelected(param1: Event) {
        this.entry = this.listMenu.selectedEntry;
        this.dispatchEvent(
            new ValueEvent(ValueEvent.VALUE_CHANGE, this, this.entry, true),
        );
    }

    public closeListMenu(param1: MouseEvent = null) {
        if (!this.listMenu) {
            return;
        }
        this.listMenu.die();
        this.listMenu.removeEventListener(
            ListMenu.ITEM_SELECTED,
            this.itemSelected,
        );
        this.stage.removeChild(this.listMenu);
        this.listMenu = null;
    }

    // @ts-expect-error
    public override get height(): number {
        return 31;
    }

    public override set multipleIndex(param1: number) {
        this._multipleIndex = param1;
        this.drawExpandButton();
    }

    public override die() {
        super.die();
        this.closeListMenu();
        this.arrowSprite.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.arrowUpHandler,
        );
        if (this.plusSprite) {
            this.plusSprite.removeEventListener(
                MouseEvent.MOUSE_UP,
                this.expandUpHandler,
            );
            this.plusSprite.removeEventListener(
                MouseEvent.ROLL_OVER,
                this.expandOverHandler,
            );
        }
    }
}