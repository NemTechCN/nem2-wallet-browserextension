import { MosaicSupplyType } from 'nem2-sdk';

export default class {
  constructor(tx) {
    this.mosaicId = tx.mosaicId.toHex().toLowerCase();
    this.direction = this.direction === MosaicSupplyType.Increase
      ? 'Increase' : 'Decrease';
    this.delta = tx.delta.compact().toLocaleString();

    return this;
  }
}
