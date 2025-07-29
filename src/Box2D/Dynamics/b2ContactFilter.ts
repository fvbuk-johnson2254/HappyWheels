import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";

export default class b2ContactFilter {
    public static b2_defaultFilter = new b2ContactFilter();

    public ShouldCollide(param1: b2Shape, param2: b2Shape): boolean {
        var _loc3_: b2FilterData = param1.GetFilterData();
        var _loc4_: b2FilterData = param2.GetFilterData();
        if (_loc3_.groupIndex == _loc4_.groupIndex && _loc3_.groupIndex != 0) {
            return _loc3_.groupIndex > 0;
        }
        return (
            (_loc3_.maskBits & _loc4_.categoryBits) != 0 &&
            (_loc3_.categoryBits & _loc4_.maskBits) != 0
        );
    }
}