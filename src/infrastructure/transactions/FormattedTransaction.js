import TxCommonProperties from './TxCommonProperties';
import txSpecificPropertiesFactory from './txSpecificPropertiesFactory';

/**
 *
 * Formats a transaction before injection in the view components
 *
 */

export default class FormattedTransactions {
  constructor(tx, namedAssets) {
    this.properties = new TxCommonProperties(tx);
    this.specificProperties = txSpecificPropertiesFactory(tx, namedAssets);
  }
}
