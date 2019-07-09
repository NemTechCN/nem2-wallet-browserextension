export default class {
  constructor(tx) {
    this.mosaicApprovalDelta = tx.minApprovalDelta;
    this.minRemovalDelta = tx.minRemovalDelta;
  }
}
