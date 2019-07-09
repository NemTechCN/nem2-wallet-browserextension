/**
 *
 * Takes an array of NamedMosaic as an input
 * Returns an object to be displayed in the transaction main properties slot
 *
 */

export default class MainPropsMosaics {
  constructor(namedMosaics) {
    this.namedMosaics = namedMosaics;
  }

  get() {
    const mainPropsMosaics = [];
    this.namedMosaics.forEach((mosaic) => {
      const key = mosaic.name
        ? `${mosaic.name} (${mosaic.id})`
        : mosaic.id;
      mainPropsMosaics[key] = mosaic.amount.toLocaleString();
    });
    return mainPropsMosaics;
  }
}
