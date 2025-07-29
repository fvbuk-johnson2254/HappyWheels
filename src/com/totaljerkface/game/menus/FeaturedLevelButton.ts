import NewStar from "@/com/totaljerkface/game/menus/NewStar";
import TextUtils from "@/com/totaljerkface/game/utils/TextUtils";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";

/* [Embed(source="/_assets/assets.swf", symbol="symbol645")] */
@boundClass
export default class FeaturedLevelButton extends Sprite {
    public nameMC: Sprite;
    public bg: Sprite;
    public newStar: NewStar;
    private nameText: TextField;
    private _selected: boolean;

    constructor(param1: string, param2: boolean = false) {
        super();
        this.nameText = this.nameMC.getChildByName("nameText") as TextField;
        this.nameText.autoSize = TextFieldAutoSize.CENTER;
        this.nameText.wordWrap = false;
        this.nameText.selectable = false;
        this.nameText.embedFonts = true;
        if (param1 != null) {
            this.nameText.htmlText = "<b>" + TextUtils.trimWhitespace(param1) + "</b>";
        }
        this.buttonMode = true;
        this.mouseChildren = false;
        this.selected = false;
        if (this.nameMC.width > this.bg.width - 30) {
            this.nameMC.width = this.bg.width - 30;
            this.nameMC.scaleY = this.nameMC.scaleX;
        }
        if (!param2) {
            this.removeChild(this.newStar);
            this.newStar = null;
        }
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(param1: boolean) {
        this._selected = param1;
        if (this._selected) {
            this.nameText.textColor = 16777215;
        } else {
            this.nameText.textColor = 2050921;
        }
    }

    // @ts-expect-error
    public override get height(): number {
        return this.bg.height;
    }
}