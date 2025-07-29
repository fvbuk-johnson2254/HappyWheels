import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2Settings {
    public static USHRT_MAX = 0x0000ffff;
    public static b2_pi = Math.PI;
    public static b2_maxManifoldPoints = 2;
    public static b2_maxPolygonVertices = 10;
    public static b2_maxProxies = 1024;
    public static b2_maxPairs = 8 * b2Settings.b2_maxProxies;
    public static b2_linearSlop = 0.005;
    public static b2_angularSlop = 0.011111111111111112 * b2Settings.b2_pi;
    public static b2_toiSlop = 8 * b2Settings.b2_linearSlop;
    public static b2_maxTOIContactsPerIsland = 32;
    public static b2_velocityThreshold = 1;
    public static b2_maxLinearCorrection = 0.2;
    public static b2_maxAngularCorrection = 0.044444444444444446 * b2Settings.b2_pi;
    public static b2_maxLinearVelocity = 200;
    public static b2_maxLinearVelocitySquared = b2Settings.b2_maxLinearVelocity * b2Settings.b2_maxLinearVelocity;
    public static b2_maxAngularVelocity = 250;
    public static b2_maxAngularVelocitySquared = b2Settings.b2_maxAngularVelocity * b2Settings.b2_maxAngularVelocity;
    public static b2_contactBaumgarte = 0.2;
    public static b2_timeToSleep = 0.5;
    public static b2_linearSleepTolerance = 0.01;
    public static b2_angularSleepTolerance = 0.011111111111111112;

    public static b2Assert(a: boolean) {
        if (!a) {
            var nullVec = new b2Vec2();
            nullVec.x++;
        }
    }
}