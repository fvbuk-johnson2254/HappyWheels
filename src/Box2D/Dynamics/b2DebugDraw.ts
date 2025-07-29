import b2Color from "@/Box2D/Common/b2Color";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2XForm from "@/Box2D/Common/Math/b2XForm";
import Sprite from "flash/display/Sprite";

export default class b2DebugDraw {
    public static e_shapeBit = 1;
    public static e_jointBit = 2;
    public static e_coreShapeBit = 4;
    public static e_aabbBit = 8;
    public static e_obbBit = 16;
    public static e_pairBit = 32;
    public static e_centerOfMassBit = 64;
    public m_drawFlags: number;
    public m_sprite: Sprite;
    public m_drawScale: number = 1;
    public m_lineThickness: number = 1;
    public m_alpha: number = 1;
    public m_fillAlpha: number = 1;
    public m_xformScale: number = 1;

    constructor() {
        this.m_drawFlags = 0;
    }

    public SetFlags(param1: number) {
        this.m_drawFlags = param1;
    }

    public GetFlags(): number {
        return this.m_drawFlags;
    }

    public AppendFlags(param1: number) {
        this.m_drawFlags |= param1;
    }

    public ClearFlags(param1: number) {
        this.m_drawFlags &= ~param1;
    }

    public DrawPolygon(param1: any[], param2: number, param3: b2Color) {
        this.m_sprite.graphics.lineStyle(
            this.m_lineThickness,
            param3.color,
            this.m_alpha,
        );
        this.m_sprite.graphics.moveTo(
            param1[0].x * this.m_drawScale,
            param1[0].y * this.m_drawScale,
        );
        var _loc4_: number = 1;
        while (_loc4_ < param2) {
            this.m_sprite.graphics.lineTo(
                param1[_loc4_].x * this.m_drawScale,
                param1[_loc4_].y * this.m_drawScale,
            );
            _loc4_++;
        }
        this.m_sprite.graphics.lineTo(
            param1[0].x * this.m_drawScale,
            param1[0].y * this.m_drawScale,
        );
    }

    public DrawSolidPolygon(param1: any[], param2: number, param3: b2Color) {
        this.m_sprite.graphics.lineStyle(
            this.m_lineThickness,
            param3.color,
            this.m_alpha,
        );
        this.m_sprite.graphics.moveTo(
            param1[0].x * this.m_drawScale,
            param1[0].y * this.m_drawScale,
        );
        this.m_sprite.graphics.beginFill(param3.color, this.m_fillAlpha);
        var _loc4_: number = 1;
        while (_loc4_ < param2) {
            this.m_sprite.graphics.lineTo(
                param1[_loc4_].x * this.m_drawScale,
                param1[_loc4_].y * this.m_drawScale,
            );
            _loc4_++;
        }
        this.m_sprite.graphics.lineTo(
            param1[0].x * this.m_drawScale,
            param1[0].y * this.m_drawScale,
        );
        this.m_sprite.graphics.endFill();
    }

    public DrawCircle(param1: b2Vec2, param2: number, param3: b2Color) {
        this.m_sprite.graphics.lineStyle(
            this.m_lineThickness,
            param3.color,
            this.m_alpha,
        );
        this.m_sprite.graphics.drawCircle(
            param1.x * this.m_drawScale,
            param1.y * this.m_drawScale,
            param2 * this.m_drawScale,
        );
    }

    public DrawSolidCircle(
        param1: b2Vec2,
        param2: number,
        param3: b2Vec2,
        param4: b2Color,
    ) {
        this.m_sprite.graphics.lineStyle(
            this.m_lineThickness,
            param4.color,
            this.m_alpha,
        );
        this.m_sprite.graphics.moveTo(0, 0);
        this.m_sprite.graphics.beginFill(param4.color, this.m_fillAlpha);
        this.m_sprite.graphics.drawCircle(
            param1.x * this.m_drawScale,
            param1.y * this.m_drawScale,
            param2 * this.m_drawScale,
        );
        this.m_sprite.graphics.endFill();
        this.m_sprite.graphics.moveTo(
            param1.x * this.m_drawScale,
            param1.y * this.m_drawScale,
        );
        this.m_sprite.graphics.lineTo(
            (param1.x + param3.x * param2) * this.m_drawScale,
            (param1.y + param3.y * param2) * this.m_drawScale,
        );
    }

    public DrawSegment(param1: b2Vec2, param2: b2Vec2, param3: b2Color) {
        this.m_sprite.graphics.lineStyle(
            this.m_lineThickness,
            param3.color,
            this.m_alpha,
        );
        this.m_sprite.graphics.moveTo(
            param1.x * this.m_drawScale,
            param1.y * this.m_drawScale,
        );
        this.m_sprite.graphics.lineTo(
            param2.x * this.m_drawScale,
            param2.y * this.m_drawScale,
        );
    }

    public DrawXForm(param1: b2XForm) {
        this.m_sprite.graphics.lineStyle(
            this.m_lineThickness,
            16711680,
            this.m_alpha,
        );
        this.m_sprite.graphics.moveTo(
            param1.position.x * this.m_drawScale,
            param1.position.y * this.m_drawScale,
        );
        this.m_sprite.graphics.lineTo(
            (param1.position.x + this.m_xformScale * param1.R.col1.x) *
            this.m_drawScale,
            (param1.position.y + this.m_xformScale * param1.R.col1.y) *
            this.m_drawScale,
        );
        this.m_sprite.graphics.lineStyle(
            this.m_lineThickness,
            65280,
            this.m_alpha,
        );
        this.m_sprite.graphics.moveTo(
            param1.position.x * this.m_drawScale,
            param1.position.y * this.m_drawScale,
        );
        this.m_sprite.graphics.lineTo(
            (param1.position.x + this.m_xformScale * param1.R.col2.x) *
            this.m_drawScale,
            (param1.position.y + this.m_xformScale * param1.R.col2.y) *
            this.m_drawScale,
        );
    }
}