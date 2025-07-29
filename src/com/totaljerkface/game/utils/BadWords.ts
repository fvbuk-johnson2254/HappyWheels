import { boundClass } from 'autobind-decorator';

@boundClass
export default class BadWords {
    public static regList: any[];

    public static containsBadWord(param1: string): boolean {
        var _loc5_: string = null;
        var _loc6_: RegExp = null;
        var _loc2_: string = param1;
        var _loc3_ = int(BadWords.regList.length);
        var _loc4_: number = 0;
        while (_loc4_ < _loc3_) {
            _loc5_ = BadWords.regList[_loc4_];
            _loc6_ = new RegExp(_loc5_, "i");
            if (_loc6_.test(_loc2_)) {
                return true;
            }
            _loc4_++;
        }
        return false;
    }
}