export default class {
  constructor(mosaic, namedAssets) {
    this.id = mosaic.id.toHex();
    this.name = namedAssets
      ? namedAssets.find(namedMosaic => namedMosaic.assetId === mosaic.id.toHex()).name
      : false;
    return this;
  }
}
