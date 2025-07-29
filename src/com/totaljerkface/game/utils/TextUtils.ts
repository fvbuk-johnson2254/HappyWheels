import { boundClass } from 'autobind-decorator';

@boundClass
export default class TextUtils {

    public static addIntegerCommas(param1: number): string {
        var _loc2_ = param1.toString();
        var _loc3_: number = Math.floor((_loc2_.length - 1) / 3);
        if (_loc3_ == 0) {
            return _loc2_;
        }
        var _loc4_: number = _loc2_.length % 3;
        if (_loc4_ == 0) {
            _loc4_ = 3;
        }
        var _loc5_: string = _loc2_.substr(0, _loc4_);
        var _loc6_: number = 0;
        while (_loc6_ < _loc3_) {
            _loc5_ = _loc5_ + "," + _loc2_.substr(_loc4_, 3);
            _loc4_ += 3;
            _loc6_++;
        }
        return _loc5_;
    }

    public static shortenDate(param1: Date): string {
        // @ts-expect-error
        var _loc2_ = (param1.month + 1).toString();
        // @ts-expect-error
        var _loc3_ = param1.date.toString();
        // @ts-expect-error
        var _loc4_ = param1.fullYear.toString().substr(2, 2);
        return "" + _loc2_ + "/" + _loc3_ + "/" + _loc4_;
    }

    public static setToHundredths(param1: {}): string {
        var _loc2_: number = Math.round(Number(param1) * 100);
        if (_loc2_ == 0) {
            return "0.00";
        }
        var _loc3_ = _loc2_.toString();
        var _loc4_: number = _loc3_.length - 2;
        var _loc5_: string = _loc4_ <= 0 ? "0" : _loc3_.substr(0, _loc4_);
        var _loc6_: string = _loc3_.substr(_loc4_, 2);
        if (_loc4_ < 0) {
            _loc6_ = "0" + _loc6_;
        }
        return "" + _loc5_ + "." + _loc6_;
    }

    public static removeSlashes(param1: string): string {
        var _loc2_: RegExp = /\\/g;
        return param1.replace(_loc2_, "");
    }

    public static randomNumString(
        param1: number,
        param2: number,
        param3: boolean,
    ): string {
        var _loc4_: number =
            Math.round(Math.random() * (param2 - param1) + param1) - 1;
        var _loc5_: string = "";
        var _loc6_: number = Math.round(Math.random() * 8 + 1);
        _loc5_ += _loc6_;
        var _loc7_: number = 1;
        while (_loc7_ < _loc4_) {
            _loc6_ = Math.round(Math.random() * 9);
            _loc5_ += _loc6_;
            _loc7_++;
        }
        _loc6_ = Math.round(Math.random() * 4) * 2;
        if (param3) {
            _loc6_ += 1;
        }
        return _loc5_ + _loc6_;
    }

    public static trimWhitespace(param1: string): string {
        while (param1.charAt(0) == " ") {
            param1 = param1.substr(1, param1.length);
        }
        while (param1.charAt(param1.length - 1) == " ") {
            param1 = param1.substr(0, param1.length - 1);
        }
        return param1;
    }
}