import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class NPCSprite extends Sprite {
    public headOuter: Sprite;
    public chest: Sprite;
    public pelvis: Sprite;
    public arm1: Sprite;
    public arm2: Sprite;
    public leg1: Sprite;
    public leg2: Sprite;
    public head: Sprite;
    public upperArm1: Sprite;
    public upperArm2: Sprite;
    public lowerArm1: Sprite;
    public lowerArm2: Sprite;
    public lowerArmOuter1: Sprite;
    public lowerArmOuter2: Sprite;
    public upperLeg1: Sprite;
    public upperLeg2: Sprite;
    public lowerLeg1: Sprite;
    public lowerLeg2: Sprite;
    public lowerLegOuter1: Sprite;
    public lowerLegOuter2: Sprite;
    public headShape: Sprite;
    public chestShape: Sprite;
    public pelvisShape: Sprite;
    public upperArm1Shape: Sprite;
    public upperArm2Shape: Sprite;
    public lowerArm1Shape: Sprite;
    public lowerArm2Shape: Sprite;
    public upperLeg1Shape: Sprite;
    public upperLeg2Shape: Sprite;
    public lowerLeg1Shape: Sprite;
    public lowerLeg2Shape: Sprite;

    constructor() {
        super();
        this.mouseEnabled = false;
        this.mouseChildren = false;
        this.head = this.headOuter.getChildByName("head") as Sprite;
        this.upperArm1 = this.arm1.getChildByName("upperArm1") as Sprite;
        this.upperArm2 = this.arm2.getChildByName("upperArm2") as Sprite;
        this.lowerArmOuter1 = this.arm1.getChildByName(
            "lowerArmOuter1",
        ) as Sprite;
        this.lowerArmOuter2 = this.arm2.getChildByName(
            "lowerArmOuter2",
        ) as Sprite;
        this.lowerArm1 = this.lowerArmOuter1.getChildByName(
            "lowerArm1",
        ) as Sprite;
        this.lowerArm2 = this.lowerArmOuter2.getChildByName(
            "lowerArm2",
        ) as Sprite;
        this.upperLeg1 = this.leg1.getChildByName("upperLeg1") as Sprite;
        this.upperLeg2 = this.leg2.getChildByName("upperLeg2") as Sprite;
        this.lowerLegOuter1 = this.leg1.getChildByName(
            "lowerLegOuter1",
        ) as Sprite;
        this.lowerLegOuter2 = this.leg2.getChildByName(
            "lowerLegOuter2",
        ) as Sprite;
        this.lowerLeg1 = this.lowerLegOuter1.getChildByName(
            "lowerLeg1",
        ) as Sprite;
        this.lowerLeg2 = this.lowerLegOuter2.getChildByName(
            "lowerLeg2",
        ) as Sprite;
        this.headShape = this.head.getChildByName("shape") as Sprite;
        this.chestShape = this.chest.getChildByName("shape") as Sprite;
        this.pelvisShape = this.pelvis.getChildByName("shape") as Sprite;
        this.upperArm1Shape = this.upperArm1.getChildByName("shape") as Sprite;
        this.upperArm2Shape = this.upperArm2.getChildByName("shape") as Sprite;
        this.lowerArm1Shape = this.lowerArm1.getChildByName("shape") as Sprite;
        this.lowerArm2Shape = this.lowerArm2.getChildByName("shape") as Sprite;
        this.upperLeg1Shape = this.upperLeg1.getChildByName("shape") as Sprite;
        this.upperLeg2Shape = this.upperLeg2.getChildByName("shape") as Sprite;
        this.lowerLeg1Shape = this.lowerLeg1.getChildByName("shape") as Sprite;
        this.lowerLeg2Shape = this.lowerLeg2.getChildByName("shape") as Sprite;
        this.headShape.visible =
            this.chestShape.visible =
            this.pelvisShape.visible =
            this.upperArm1Shape.visible =
            this.upperArm2Shape.visible =
            this.lowerArm1Shape.visible =
            this.lowerArm2Shape.visible =
            this.upperLeg1Shape.visible =
            this.upperLeg2Shape.visible =
            this.lowerLeg1Shape.visible =
            this.lowerLeg2Shape.visible =
            false;
    }

    public removeShapes() {
        this.head.removeChild(this.headShape);
        this.chest.removeChild(this.chestShape);
        this.pelvis.removeChild(this.pelvisShape);
        this.upperArm1.removeChild(this.upperArm1Shape);
        this.upperArm2.removeChild(this.upperArm2Shape);
        this.lowerArm1.removeChild(this.lowerArm1Shape);
        this.lowerArm2.removeChild(this.lowerArm2Shape);
        this.upperLeg1.removeChild(this.upperLeg1Shape);
        this.upperLeg2.removeChild(this.upperLeg2Shape);
        this.lowerLeg1.removeChild(this.lowerLeg1Shape);
        this.lowerLeg2.removeChild(this.lowerLeg2Shape);
        this.headShape = null;
        this.chestShape = null;
        this.pelvisShape = null;
        this.upperArm1Shape = null;
        this.upperArm2Shape = null;
        this.lowerArm1Shape = null;
        this.lowerArm2Shape = null;
        this.upperLeg1Shape = null;
        this.upperLeg2Shape = null;
        this.lowerLeg1Shape = null;
        this.lowerLeg2Shape = null;
    }
}