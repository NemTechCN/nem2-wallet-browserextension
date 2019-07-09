import TxCommonProperties from './transactionBodyInterfaces/TxCommonProperties';
import TxSpecificPropertiesFactory from './TxSpecificPropertiesFactory';

// Formatted transaction
export default class {
  constructor(tx, namedAssets) {
    this.properties = new TxCommonProperties(tx);
    const { mainProps, body } = new TxSpecificPropertiesFactory(tx, namedAssets);
    this.mainProperties = mainProps;
    this.body = body;
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
