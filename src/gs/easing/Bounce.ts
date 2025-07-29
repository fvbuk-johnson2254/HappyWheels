import { boundClass } from 'autobind-decorator';

@boundClass
export default class Bounce {

    public static easeOut(
        param1: number,
        param2: number,
        param3: number,
        param4: number,
    ): number {
        param1 = param1 / param4;
        if (param1 < 0.36363636363636365) {
            return param3 * (7.5625 * param1 * param1) + param2;
        }
        if (param1 < 0.7272727272727273) {
            var _loc5_ = param1 - 0.5454545454545454;
            param1 -= 0.5454545454545454;
            return param3 * (7.5625 * _loc5_ * param1 + 0.75) + param2;
        }
        if (param1 < 0.9090909090909091) {
            _loc5_ = param1 - 0.8181818181818182;
            param1 -= 0.8181818181818182;
            return param3 * (7.5625 * _loc5_ * param1 + 0.9375) + param2;
        }
        _loc5_ = param1 - 0.9545454545454546;
        param1 -= 0.9545454545454546;
        return param3 * (7.5625 * _loc5_ * param1 + 0.984375) + param2;
    }

    public static easeIn(
        param1: number,
        param2: number,
        param3: number,
        param4: number,
    ): number {
        return (
            param3 - Bounce.easeOut(param4 - param1, 0, param3, param4) + param2
        );
    }

    public static easeInOut(
        param1: number,
        param2: number,
        param3: number,
        param4: number,
    ): number {
        if (param1 < param4 / 2) {
            return Bounce.easeIn(param1 * 2, 0, param3, param4) * 0.5 + param2;
        }
        return (
            Bounce.easeOut(param1 * 2 - param4, 0, param3, param4) * 0.5 +
            param3 * 0.5 +
            param2
        );
    }
}