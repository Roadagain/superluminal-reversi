export default class Runner {
  public constructor(private _id: string, private _num: number, private _ready: boolean = false) {
  }

  public get id(): string {
    return this._id;
  }

  public get num(): number {
    return this._num;
  }

  public get ready(): boolean {
    return this._ready;
  }
}
