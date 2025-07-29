import b2MassData from "@/Box2D/Collision/Shapes/b2MassData";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2BodyDef {
	public massData = new b2MassData();
    public userData;
    public position = new b2Vec2();
    public angle: number;
    public linearDamping: number;
    public angularDamping: number;
    public allowSleep: boolean;
    public isSleeping: boolean;
    public isHull: boolean;
    public fixedRotation: boolean;
    public isBullet: boolean;

    constructor() {
        this.massData.center.SetZero();
        this.massData.mass = 0;
        this.massData.I = 0;
        this.userData = null;
        this.position.Set(0, 0);
        this.angle = 0;
        this.linearDamping = 0;
        this.angularDamping = 0;
        this.allowSleep = true;
        this.isSleeping = false;
        this.fixedRotation = false;
        this.isBullet = false;
    }
}