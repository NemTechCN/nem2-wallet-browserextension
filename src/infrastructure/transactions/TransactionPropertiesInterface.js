import { Address } from 'nem2-sdk';
import { formatDate } from './formattingHelpers';
import CustomId from './CustomId';

export default class {
  constructor(tx) {
    this.customId = new CustomId(tx).create();
    this.transactionHash = tx.transactionInfo.hash;
    this.signer = new Address(tx.signer.address.address).pretty();
    this.recipient = tx.recipient ? new Address(tx.recipient.address).pretty() : false;
    this.aggregateProperties = tx.aggregateProperties || false;
    this.rejectionReason = tx.rejectionReason || false;
    this.fee = tx.maxFee.compact();
    this.blockNumber = tx.transactionInfo.height ? tx.transactionInfo.height.compact() : false;
    this.deadline = formatDate(new Date(tx.deadline.value));
    this.date = tx.timestamp ? formatDate(new Date(tx.timestamp * 1000)) : false;
    return this;
  }
}
