import { boundClass } from 'autobind-decorator';

@boundClass
export default class Strong {

    public static easeIn(
        param1: number,
        param2: number,
        param3: number,
        param4: number,
    ): number {
        return (
            param3 *
            (param1 = param1 / param4) *
            param1 *
            param1 *
            param1 *
            param1 +
            param2
        );
    }

    public static easeOut(
        param1: number,
        param2: number,
        param3: number,
        param4: number,
    ): number {
        return (
            param3 *
            ((param1 = param1 / param4 - 1) *
                param1 *
                param1 *
                param1 *
                param1 +
                1) +
            param2
        );
    }

    public static easeInOut(
        param1: number,
        param2: number,
        param3: number,
        param4: number,
    ): number {
        var _loc5_ = param1 / (param4 / 2);
        param1 /= param4 / 2;
        if (_loc5_ < 1) {
            return (
                (param3 / 2) * param1 * param1 * param1 * param1 * param1 +
                param2
            );
        }
        _loc5_ = param1 - 2;
        param1 -= 2;
        return (
            (param3 / 2) * (_loc5_ * param1 * param1 * param1 * param1 + 2) +
            param2
        );
    }
}