export default class {
  constructor(tx) {
    this.lockedAmount = tx.tx.mosaic.amount.compact().toLocaleString();
    // @TODO: name
    this.lockedAssetId = tx.mosaic.id.toHex();
    this.duration = tx.duration.compact().toLocaleString();
  }
}
