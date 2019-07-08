import TransactionProperties from './TransactionPropertiesInterface';
import TransactionBody from './TransactionBody';

// Formatted transaction
export default class {
  constructor(tx, namedAssets) {
    this.properties = new TransactionProperties(tx);
    this.body = new TransactionBody(tx, namedAssets);
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
