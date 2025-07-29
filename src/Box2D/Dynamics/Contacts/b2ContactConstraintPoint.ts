import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2ContactConstraintPoint {
    public localAnchor1 = new b2Vec2();
    public localAnchor2 = new b2Vec2();
    public r1 = new b2Vec2();
    public r2 = new b2Vec2();
    public normalImpulse: number;
    public tangentImpulse: number;
    public positionImpulse: number;
    public normalMass: number;
    public tangentMass: number;
    public equalizedMass: number;
    public separation: number;
    public velocityBias: number;
}