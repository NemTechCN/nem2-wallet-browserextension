
import { txTypeNameFromTypeId } from './transactions-types';

/**
 *
 * When transactions are formatted for being displayed,
 * inner transactions are pulled out from their parent
 * This objects augments them for information display purposes
 *
 */

export default class AggregateProperties {
  constructor(tx, index) {
    this.aggregateTransactionType = txTypeNameFromTypeId(tx.type);
    this.transactionIndex = index;
    this.numberOfTransactions = tx.length;
  }
}
