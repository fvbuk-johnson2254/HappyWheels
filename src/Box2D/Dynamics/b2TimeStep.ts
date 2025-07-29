export default class b2TimeStep {
    public dt: number;
    public inv_dt: number;
    public dtRatio: number;
    public maxIterations: number;
    public warmStarting: boolean;
    public positionCorrection: boolean;
}