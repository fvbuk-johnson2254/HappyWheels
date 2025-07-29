import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2AABB {
    public lowerBound = new b2Vec2();
    public upperBound = new b2Vec2();

    public IsValid(): boolean {
        var dx = this.upperBound.x - this.lowerBound.x;
        var dy = this.upperBound.y - this.lowerBound.y;
        var valid = dx >= 0 && dy >= 0;
        return valid && this.lowerBound.IsValid() && this.upperBound.IsValid();
    }
}