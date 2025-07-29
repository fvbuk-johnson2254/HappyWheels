import TextUtils from "@/com/totaljerkface/game/utils/TextUtils";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ReplayDataObject {
    private _id: number;
    private _level_id: number;
    private _user_id: number;
    private _user_name: string;
    private _weighted_rating: number;
    private _average_rating: number;
    private _votes: number;
    private _views: number;
    private _created: Date;
    private _comments: string;
    private _character: number;
    private _timeFrames: number;
    private _timeSeconds: number;
    private _architecture: string;
    private _version: number;

    constructor(
        param1: {} = null,
        param2: {} = null,
        param3: {} = null,
        param4: {} = null,
        param5: {} = null,
        param6: {} = null,
        param7: {} = null,
        param8: {} = null,
        param9: {} = null,
        param10: {} = null,
        param11: {} = null,
        param12: {} = null,
        param13: {} = null,
    ) {
        this._id = int(param1);
        this._level_id = int(param2);
        this._user_id = int(param3);
        this._user_name = param4.toString();
        this._weighted_rating = Number(param5);
        this._votes = int(param6);
        this._average_rating = this.getAverageRating(
            this._weighted_rating,
            this._votes,
        );
        this._views = int(param7);
        this._comments = TextUtils.removeSlashes(param9.toString());
        this._character = int(param10);
        this._timeFrames = int(param11);
        this._timeSeconds = int(param11) / 30;
        this._architecture = param12.toString();
        this._version = Number(param13);
        var _loc14_ = param8.toString();
        var _loc15_ = Number(_loc14_.substr(0, 4));
        var _loc16_ = Number(_loc14_.substr(5, 2)) - 1;
        var _loc17_ = Number(_loc14_.substr(8, 2));
        var _loc18_ = Number(_loc14_.substr(11, 2));
        var _loc19_ = Number(_loc14_.substr(14, 2));
        var _loc20_ = Number(_loc14_.substr(17, 2));
        this._created = new Date(
            _loc15_,
            _loc16_,
            _loc17_,
            _loc18_,
            _loc19_,
            _loc20_,
        );
    }

    private getAverageRating(param1: number, param2: number): number {
        var _loc3_: number = 10;
        var _loc4_: number = 2.5;
        var _loc5_: number =
            param2 == 0
                ? 0
                : (param1 - (_loc4_ * _loc3_) / (param2 + _loc3_)) /
                (param2 / (param2 + _loc3_));
        return Math.min(5, Math.max(_loc5_, 0));
    }

    public get id(): number {
        return this._id;
    }

    public set id(param1: number) {
        this._id = param1;
    }

    public get level_id(): number {
        return this._level_id;
    }

    public get user_id(): number {
        return this._user_id;
    }

    public get user_name(): string {
        return this._user_name;
    }

    public get weighted_rating(): number {
        return this._weighted_rating;
    }

    public get average_rating(): number {
        return this._average_rating;
    }

    public get votes(): number {
        return this._votes;
    }

    public get views(): number {
        return this._views;
    }

    public get created(): Date {
        return this._created;
    }

    public get comments(): string {
        return this._comments;
    }

    public get character(): number {
        return this._character;
    }

    public get timeFrames(): number {
        return this._timeFrames;
    }

    public get timeSeconds(): number {
        return this._timeSeconds;
    }

    public get architecture(): string {
        return this._architecture;
    }

    public get version(): number {
        return this._version;
    }

    public toString(): string {
        var _loc1_: string = "replaydataobj: ";
        _loc1_ = _loc1_.concat("id = " + this._id + ", ");
        _loc1_ = _loc1_.concat("level_id = " + this._level_id + ", ");
        _loc1_ = _loc1_.concat("user_id = " + this._user_id + ", ");
        _loc1_ = _loc1_.concat("user_name = " + this._user_name + ", ");
        _loc1_ = _loc1_.concat(
            "weighted_rating = " + this._weighted_rating + ", ",
        );
        _loc1_ = _loc1_.concat(
            "average_rating = " + this._average_rating + ", ",
        );
        _loc1_ = _loc1_.concat("votes = " + this._votes + ", ");
        _loc1_ = _loc1_.concat("views = " + this._views + ", ");
        _loc1_ = _loc1_.concat("created = " + this._created + ", ");
        _loc1_ = _loc1_.concat("comments = " + this._comments + ", ");
        _loc1_ = _loc1_.concat("character = " + this._character + ", ");
        _loc1_ = _loc1_.concat("timeFrames = " + this._timeFrames + ", ");
        _loc1_ = _loc1_.concat("timeSeconds = " + this._timeSeconds + ", ");
        _loc1_ = _loc1_.concat("architecture = " + this._architecture + ", ");
        return _loc1_.concat("version = " + this._version + ", ");
    }

    public clone(): ReplayDataObject {
        return new ReplayDataObject(
            this._id,
            this._user_id,
            this._user_name,
            this._weighted_rating,
            this._votes,
            this._views,
            this._created,
            this._comments,
            this._character,
            this._timeFrames,
            this._architecture,
            this._version,
        );
    }
}