import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

// This holds the mass data computed for a shape.
export default class b2MassData {
	// The mass of the shape, usually in kilograms.
    public mass: number = 0;
    // The position of the shape's centroid relative to the shape's origin.
    public center = new b2Vec2(0, 0);
    // The rotational inertia of the shape.
    public I: number = 0;
}