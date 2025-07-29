import TweenLite from "@/gs/TweenLite";
import Strong from "@/gs/easing/Strong";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import assets from "@assets/json/assets.json";

/* [Embed(source="/_assets/assets.swf", symbol="symbol430")] */
@boundClass
export default class OldMan extends Sprite {
    public body: Sprite;
    public arm: Sprite;
    public foreArm: Sprite;
    public head: Sprite;
    public jaw: Sprite;
    public eyes: MovieClip;
    public eye1: Sprite;
    public eye2: Sprite;
    protected bodyMinAngle: number = -6;
    protected bodyRange: number = 8;
    protected headMinAngle: number = -6;
    protected headRange: number = 6;
    protected armMinAngle: number = -10;
    protected armRange: number = 40;
    protected foreArmMinAngle: number = -15;
    protected foreArmRange: number = 30;
    protected jawTopY: number = -65.5;
    protected jawRangeY: number = 15;
    protected eye1LeftX: number = -24;
    protected eye1RangeX: number = 16;
    protected eye2LeftX: number = 34;
    protected eye2RangeX: number = 13;
    protected eye1TopY: number = -10;
    protected eye1RangeY: number = 6;
    protected eye2TopY: number = -3;
    protected eye2RangeY: number = 6;
    protected timeRange: number = 2.5;
    protected jawMoving: boolean = false;
    protected _jawTween: number = 0;

    constructor() {
        super();

        // const symbol430 = (assets as any).tags.find((asset) => asset.id === 430);
        // const bodyTag = symbol430.tags.find((tag) => tag.name === 'body');
        // const bodySymbol = (assets as any).tags.find((asset) => asset.id === bodyTag.character_id);
        // const armTag = bodySymbol.tags.find((tag) => tag.name === 'arm');
        // const headTag = bodySymbol.tags.find((tag) => tag.name === 'head');
        // const headSymbol = (assets as any).tags.find((asset) => asset.id === headTag.character_id);
        // const jawTag = headSymbol.tags.find((tag) => tag.name === 'jaw');
        // const eyesTag = headSymbol.tags.find((tag) => tag.name === 'eyes');
        // const eyesSymbol = (assets as any).tags.find((asset) => asset.id === eyesTag.character_id);
        // const eye1Tag = eyesSymbol.tags.find((tag) => tag.name === 'eye1');
        // const eye2Tag = eyesSymbol.tags.find((tag) => tag.name === 'eye2');

        // console.log({ symbol430, bodyTag, bodySymbol });

        // this.body = new Sprite();
        // this.body.name = 'body';
        // this.body.x = bodyTag.matrix.translate_x;
        // this.body.y = bodyTag.matrix.translate_y;

        // this.arm = new Sprite();
        // this.arm.name = 'arm';
        // this.arm.x = armTag.matrix.translate_x;
        // this.arm.y = armTag.matrix.translate_y;

        // this.head = new Sprite();
        // this.head.name = 'head';
        // this.head.x = headTag.matrix.translate_x;
        // this.head.y = headTag.matrix.translate_y;

        // this.jaw = new Sprite();
        // this.jaw.name = 'jaw';
        // this.jaw.x = jawTag.matrix.translate_x;
        // this.jaw.y = jawTag.matrix.translate_y;

        // this.eyes = new MovieClip();
        // this.eyes.name = 'eyes';
        // this.eyes.x = eyesTag.matrix.translate_x;
        // this.eyes.y = eyesTag.matrix.translate_y;

        // this.eye1 = new Sprite();
        // this.eye1.name = 'eye1';
        // this.eye1.x = eye1Tag.matrix.translate_x;
        // this.eye1.y = eye1Tag.matrix.translate_y;

        // this.eye2 = new Sprite();
        // this.eye2.name = 'eye2';
        // this.eye2.x = eye2Tag.matrix.translate_x;
        // this.eye2.y = eye2Tag.matrix.translate_y;

        // this.eyes.addChild(this.eye2);
        // this.eyes.addChild(this.eye1);
        // this.head.addChild(this.eyes);
        // this.head.addChild(this.jaw);
        // this.body.addChild(this.head);
        // this.body.addChild(this.arm);
        // this.addChild(this.body);

        // @ts-ignore
        embedRecursive(this, {
            body: Sprite,
            arm: Sprite,
            foreArm: Sprite,
            head: Sprite,
            jaw: Sprite,
            eyes: MovieClip,
            eye1: Sprite,
            eye2: Sprite
        }, 430);

        console.log(this);

        this.arm = this.body.getChildByName("arm") as Sprite;
        this.foreArm = this.arm.getChildByName("foreArm") as Sprite;
        this.head = this.body.getChildByName("head") as Sprite;
        this.jaw = this.head.getChildByName("jaw") as Sprite;
        this.eyes = this.head.getChildByName("eyes") as MovieClip;
        this.eye1 = this.eyes.getChildByName("eye1") as Sprite;
        this.eye2 = this.eyes.getChildByName("eye2") as Sprite;
        this._jawTween = (this.jaw.y - this.jawTopY) / this.jawRangeY;
    }

    public slideIn() {
        var _loc1_: number = NaN;
        _loc1_ = this.rotation;
        var _loc2_: number = this.x;
        var _loc3_: number = this.y;
        this.rotation = -45;
        this.x = -54;
        this.y = 575;
        TweenLite.to(this, 2, {
            rotation: _loc1_,
            x: _loc2_,
            y: _loc3_,
            ease: Strong.easeOut,
            delay: 1,
        });
    }

    public step() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        if (Math.random() < 0.02) {
            _loc1_ = this.armMinAngle + Math.random() * this.armRange;
            _loc2_ = Math.random() * this.timeRange + 0.5;
            TweenLite.to(this.arm, _loc2_, {
                rotation: _loc1_,
                ease: Strong.easeInOut,
            });
        }
        if (Math.random() < 0.02) {
            _loc1_ = this.foreArmMinAngle + Math.random() * this.foreArmRange;
            _loc2_ = Math.random() * this.timeRange + 0.5;
            TweenLite.to(this.foreArm, _loc2_, {
                rotation: _loc1_,
                ease: Strong.easeInOut,
            });
        }
        if (Math.random() < 0.02) {
            _loc1_ = this.bodyMinAngle + Math.random() * this.bodyRange;
            _loc2_ = Math.random() * this.timeRange + 0.5;
            TweenLite.to(this.body, _loc2_, {
                rotation: _loc1_,
                ease: Strong.easeInOut,
            });
        }
        if (Math.random() < 0.02) {
            _loc1_ = this.headMinAngle + Math.random() * this.headRange;
            _loc2_ = Math.random() * this.timeRange + 0.5;
            TweenLite.to(this.head, _loc2_, {
                rotation: _loc1_,
                ease: Strong.easeInOut,
            });
        }
        if (Math.random() < 0.1) {
            if (this.jawMoving) {
                return;
            }
            _loc3_ = this.jawTopY + Math.random() * this.jawRangeY;
            _loc2_ = Math.random() * this.timeRange + 0.05;
            _loc4_ = _loc3_ - this.jaw.y;
            this.jawMoving = true;
            TweenLite.to(this, _loc2_, {
                jawTween: Math.random(),
                ease: Strong.easeInOut,
                overwrite: 0,
                onComplete: this.jawFinished,
            });
        }
        if (Math.random() < 0.005) {
            _loc5_ = Math.random();
            _loc6_ = this.eye1LeftX + _loc5_ * this.eye1RangeX;
            _loc2_ = Math.random() * this.timeRange + 0.5;
            TweenLite.to(this.eye1, _loc2_, {
                x: _loc6_,
                ease: Strong.easeInOut,
            });
            _loc6_ = this.eye2LeftX + _loc5_ * this.eye2RangeX;
            TweenLite.to(this.eye2, _loc2_, {
                x: _loc6_,
                ease: Strong.easeInOut,
            });
        }
    }

    public get jawTween(): number {
        return this._jawTween;
    }

    public set jawTween(param1: number) {
        this._jawTween = param1;
        this.jaw.y = this.jawTopY + this._jawTween * this.jawRangeY;
    }

    protected jawFinished() {
        this.jawMoving = false;
    }
}