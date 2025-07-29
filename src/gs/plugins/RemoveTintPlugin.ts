import TintPlugin from "@/gs/plugins/TintPlugin";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class RemoveTintPlugin extends TintPlugin {
    public static VERSION: number;
    public static API: number = 1;

    constructor() {
        super();
        this.propName = "removeTint";
    }
}