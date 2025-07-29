import RectTrashItem6 from "@/top/RectTrashItem6";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol860")] */
@boundClass
export default class TrashCanMC extends MovieClip {
    public shapes: MovieClip;
    public can: MovieClip;
    public lid: RectTrashItem6;
}