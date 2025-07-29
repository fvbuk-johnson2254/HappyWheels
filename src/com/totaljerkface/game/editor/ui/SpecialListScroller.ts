import ListScroller from "@/com/totaljerkface/game/menus/ListScroller";
import { boundClass } from 'autobind-decorator';
import CapsStyle from "flash/display/CapsStyle";
import JointStyle from "flash/display/JointStyle";
import LineScaleMode from "flash/display/LineScaleMode";
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class SpecialListScroller extends ListScroller {
    constructor(param1: Sprite, param2: Sprite, param3: number = 10) {
        super(param1, param2, param3);
    }

    protected override createParts() {
        this.bg = new Sprite();
        this.addChild(this.bg);
        this.bg.graphics.beginFill(6710886);
        this.bg.graphics.drawRect(0, 0, 12, 100);
        this.bg.graphics.endFill();
        this.bg.scale9Grid = new Rectangle(2, 5, 8, 90);
        this.scrollTab = new Sprite();
        this.addChild(this.scrollTab);
        this.scrollTab.graphics.lineStyle(
            0,
            10066329,
            1,
            true,
            LineScaleMode.NONE,
            CapsStyle.NONE,
            JointStyle.MITER,
            3,
        );
        this.scrollTab.graphics.beginFill(13421772);
        this.scrollTab.graphics.drawRect(0, 0, 12, 100);
        this.scrollTab.graphics.endFill();
        this.scrollTab.scale9Grid = new Rectangle(2, 5, 8, 90);
    }

    protected override mouseUpHandler(param1: MouseEvent) {
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.updateContent,
        );
        this.stopScrollDrag();
    }
}