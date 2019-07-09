/**
 *
 * This id is used to sort transactions and to remove duplicates
 * Tx sorting order: Rejected, Unconfirmed, Confirmed by blockNumber
 *
 */

export default class CustomId {
  constructor(tx) {
    this.tx = tx;
  }

  create() {
    const sortingNumber = this.createSortingNumber();
    const uniqueId = this.createUniqueId();
    return `${sortingNumber}${uniqueId}`;
  }

  createSortingNumber() {
    const { tx } = this;
    if (tx.rejectionReason) return Number.MAX_SAFE_INTEGER;
    if (tx.unconfirmed) return Number.MAX_SAFE_INTEGER - 1;
    return tx.transactionInfo.height.compact();
  }

  createUniqueId() {
    const { tx } = this;
    if (tx.aggregateProperties && tx.rejectionReason) {
      return `${tx.transactionInfo.hash}${tx.aggregateProperties.index}`;
    }
    if (tx.aggregateProperties) return tx.transactionInfo.hash;
    return tx.transactionInfo.id;
  }
}
