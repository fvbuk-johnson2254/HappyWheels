import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ShapeDef from "@/Box2D/Collision/Shapes/b2ShapeDef";
import b2Settings from "@/Box2D/Common/b2Settings";
import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2PolygonDef extends b2ShapeDef {
    private static s_mat = new b2Mat22();
    public vertices: any[] = new Array(b2Settings.b2_maxPolygonVertices);
    public vertexCount: number;

    constructor() {
        super();

        this.type = b2Shape.e_polygonShape;
        this.vertexCount = 0;

        for (var i = 0; i < b2Settings.b2_maxPolygonVertices; i++){
			this.vertices[i] = new b2Vec2();
		}
    }

    public SetAsBox(param1: number, param2: number) {
        this.vertexCount = 4;
        this.vertices[0].Set(-param1, -param2);
        this.vertices[1].Set(param1, -param2);
        this.vertices[2].Set(param1, param2);
        this.vertices[3].Set(-param1, param2);
    }

    public SetAsOrientedBox(hx: number, hy: number, center: b2Vec2 = null, angle = 0) {
        var xfPosition: b2Vec2 = null;
        var xfR: b2Mat22 = null;

        this.vertexCount = 4;
        this.vertices[0].Set(-hx, -hy);
        this.vertices[1].Set(hx, -hy);
        this.vertices[2].Set(hx, hy);
        this.vertices[3].Set(-hx, hy);

        if (center) {
            xfPosition = center;
            xfR = b2PolygonDef.s_mat;
            xfR.Set(angle);

			for (var i = 0; i < this.vertexCount; ++i) {
                center = this.vertices[i];

                hx = xfPosition.x + (xfR.col1.x * center.x + xfR.col2.x * center.y);
                center.y = xfPosition.y + (xfR.col1.y * center.x + xfR.col2.y * center.y);
                center.x = hx;
                i++;
            }
        }
    }
}