export default class {
  constructor(tx) {
    this.tx = tx;
  }

  create() {
    // This id is used to sort transactions and to remove duplicates
    // Tx sorting order: Rejected, Unconfirmed, Confirmed by blockNumber
    const sortingNumber = this.getSortingNumber();
    const uniqueId = this.getUniqueId();
    return `${sortingNumber}${uniqueId}`;
  }

  getSortingNumber() {
    const { tx } = this;
    if (tx.rejectionReason) return Number.MAX_SAFE_INTEGER;
    if (tx.unconfirmed) return Number.MAX_SAFE_INTEGER - 1;
    return tx.transactionInfo.height.compact();
  }

  getUniqueId() {
    const { tx } = this;
    if (tx.aggregateProperties && tx.rejectionReason) {
      return `${tx.transactionInfo.hash}${tx.aggregateProperties.index}`;
    }
    if (tx.aggregateProperties) return tx.transactionInfo.hash;
    return tx.transactionInfo.id;
  }
}
