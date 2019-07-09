export default class {
  constructor(tx) {
    this.mosaicId = tx.mosaicId.toHex().toLowerCase();
    this.divisibility = tx.mosaicProperties.divisibility;
    this.duration = tx.mosaicProperties.duration.compact() === 0
      ? 'unlimited'
      : tx.mosaicProperties.duration.compact().toLocaleString();
    this.levyMutable = tx.mosaicProperties.levyMutable;
    this.supplyMutable = tx.mosaicProperties.supplyMutable;
    this.transferable = tx.mosaicProperties.transferable;
  }
}
