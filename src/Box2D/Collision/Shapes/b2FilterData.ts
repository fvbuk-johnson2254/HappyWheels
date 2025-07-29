export default class b2FilterData {
    public categoryBits = 0x0001;
    public maskBits = 65535;
    public groupIndex = 0;

    public Copy(): b2FilterData {
        var copy = new b2FilterData();
        copy.categoryBits = this.categoryBits;
        copy.maskBits = this.maskBits;
        copy.groupIndex = this.groupIndex;
        return copy;
    }
}