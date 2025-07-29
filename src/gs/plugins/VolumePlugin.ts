import TweenLite from "@/gs/TweenLite";
import TweenPlugin from "@/gs/plugins/TweenPlugin";
import { boundClass } from 'autobind-decorator';
import SoundTransform from "flash/media/SoundTransform";

@boundClass
export default class VolumePlugin extends TweenPlugin {
    public static VERSION: number;
    public static API: number = 1;
    protected _target: any;
    protected _st: SoundTransform;

    constructor() {
        super();
        this.propName = "volume";
        this.overwriteProps = ["volume"];
    }

    public override onInitTween(
        param1: {},
        param2,
        param3: TweenLite,
    ): boolean {
        if (isNaN(param2) || !param1.hasOwnProperty("soundTransform")) {
            return false;
        }
        this._target = param1;
        this._st = this._target.soundTransform;
        this.addTween(this._st, "volume", this._st.volume, param2, "volume");
        return true;
    }

    public override set changeFactor(param1: number) {
        this.updateTweens(param1);
        this._target.soundTransform = this._st;
    }
}