export default class Runner {
  public constructor(private _id: string, private _num: number, private _ready: boolean = false) {
  }

  public get id() {
    return this._id;
  }

  public get num() {
    return this._num;
  }

  public get ready() {
    return this._ready;
  }
}
