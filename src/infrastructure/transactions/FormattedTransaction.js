import TxCommonProperties from './TxCommonProperties';
import txSpecificPropertiesFactory from './TxSpecificPropertiesFactory';

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


// type2 removed in favor of aggregateProperties test
// rejected removed in favor of rejectionReason test
// rejectionReason removed from body
// signerTiny removed
// recipientTiny removed
// recipient default to false
// add unconfirmed as an input
// Removed tx.id in favor of tx.customId
// Removed tx.timestamp
