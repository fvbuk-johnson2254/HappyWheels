import TextUtils from "@/com/totaljerkface/game/utils/TextUtils";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class LevelDataObject {
    private _id: number;
    private _name: string;
    private _author_id: number;
    private _author_name: string;
    private _weighted_rating: number;
    private _average_rating: number;
    private _votes: number;
    private _plays: number;
    private _created: Date;
    private _comments: string;
    private _character: number;
    private _forceChar: boolean;
    private _importable: boolean;
    private _featured: boolean;
    private _isPublic: boolean;
    private _date_featured: Date;
    private _data: XML;

    constructor(
        param1: any = null,
        param2: any = null,
        param3: any = null,
        param4: any = null,
        param5: any = null,
        param6: any = null,
        param7: any = null,
        param8: any = null,
        param9: any = null,
        param10: any = null,
        param11: any = null,
        param12: any = null,
        param13: any = null,
        param14: any = null,
        param15: any = null,
    ) {
        this._id = int(param1);
        this._name = TextUtils.removeSlashes(param2.toString());
        this._author_id = int(param3);
        this._author_name = param4.toString();
        this._weighted_rating = Number(param5);
        this._votes = int(param6);
        this._average_rating = this.getAverageRating(
            this._weighted_rating,
            this._votes,
        );
        this._plays = int(param7);
        this._comments = TextUtils.removeSlashes(param9.toString());
        this._character = int(param10);
        this._forceChar = this._character > 0 ? true : false;
        this._importable = param11.toString() == "1" ? true : false;
        this._featured = param12.toString() == "1" ? true : false;
        this._isPublic = param13.toString() == "1" ? true : false;
        var _loc16_ = param8.toString();
        this._created = this.dateFromString(_loc16_);
        if (param14) {
            this._date_featured = this.dateFromString(param14.toString());
        }
        if (param15) {
            this._data = new XML(param15);
        }
    }

    private dateFromString(param1: string): Date {
        var _loc2_ = Number(param1.substr(0, 4));
        var _loc3_ = Number(param1.substr(5, 2)) - 1;
        var _loc4_ = Number(param1.substr(8, 2));
        var _loc5_ = Number(param1.substr(11, 2));
        var _loc6_ = Number(param1.substr(14, 2));
        var _loc7_ = Number(param1.substr(17, 2));
        return new Date(_loc2_, _loc3_, _loc4_, _loc5_, _loc6_, _loc7_);
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

    public get name(): string {
        return this._name;
    }

    public get author_id(): number {
        return this._author_id;
    }

    public get author_name(): string {
        return this._author_name;
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

    public get plays(): number {
        return this._plays;
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

    public get forceChar(): boolean {
        return this._forceChar;
    }

    public get importable(): boolean {
        return this._importable;
    }

    public set importable(param1: boolean) {
        this._importable = param1;
    }

    public get featured(): boolean {
        return this._featured;
    }

    public get isPublic(): boolean {
        return this._isPublic;
    }

    public set isPublic(param1: boolean) {
        this._isPublic = param1;
    }

    public get date_featured(): Date {
        return this._date_featured;
    }

    public get data(): XML {
        return this._data;
    }

    public set data(param1: XML) {
        this._data = param1;
    }

    public toString(): string {
        var _loc1_: string = "leveldataobj: ";
        _loc1_ = _loc1_.concat("id = " + this._id + ", ");
        _loc1_ = _loc1_.concat("name = " + this._name + ", ");
        _loc1_ = _loc1_.concat("author_id = " + this._author_id + ", ");
        _loc1_ = _loc1_.concat("author_name = " + this._author_name + ", ");
        _loc1_ = _loc1_.concat(
            "weighted_rating = " + this._weighted_rating + ", ",
        );
        _loc1_ = _loc1_.concat(
            "average_rating = " + this._average_rating + ", ",
        );
        _loc1_ = _loc1_.concat("votes = " + this._votes + ", ");
        _loc1_ = _loc1_.concat("plays = " + this._plays + ", ");
        _loc1_ = _loc1_.concat("created = " + this._created + ", ");
        _loc1_ = _loc1_.concat("comments = " + this._comments + ", ");
        _loc1_ = _loc1_.concat("character = " + this._character + ", ");
        _loc1_ = _loc1_.concat("forceChar = " + this._forceChar + ", ");
        _loc1_ = _loc1_.concat("importable = " + this._importable + ", ");
        _loc1_ = _loc1_.concat("featured = " + this._featured + ", ");
        return _loc1_.concat("isPublic = " + this._isPublic + ", ");
    }

    public clone(): LevelDataObject {
        return new LevelDataObject(
            this._id,
            this._name,
            this._author_id,
            this._author_name,
            this._weighted_rating,
            this._votes,
            this._plays,
            this._created,
            this._comments,
            this._character,
            this._forceChar,
            this._importable,
            this._featured,
            this._isPublic,
        );
    }
}