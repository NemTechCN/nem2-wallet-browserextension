import { Address, AliasActionType } from 'nem2-sdk';

export default class {
  constructor(tx) {
    this.aliasActionType = tx.actionType === AliasActionType.Link ? 'Link' : 'Unlink';
    this.address = new Address(tx.address.address).pretty();
    // @TODO: name
    this.namespaceId = tx.namespaceId.toHex().toLowerCase();

    return this;
  }
}
