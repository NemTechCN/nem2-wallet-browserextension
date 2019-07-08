import NamedMosaic from '../assets/NamedMosaic';

export default class {
  constructor(tx, namedAssets) {
    this.message = { ...tx.message.payload, mainProp: true };
    this.namedMosaics = tx.mosaics
      .map(mosaic => ({ ...new NamedMosaic(mosaic, namedAssets), mainProp: true }));
    return this;
  }
}
