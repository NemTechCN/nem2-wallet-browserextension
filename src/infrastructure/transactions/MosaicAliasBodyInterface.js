import { AliasActionType } from 'nem2-sdk';

export default class {
  constructor(tx) {
    this.aliasActionType = tx.actionType === AliasActionType.Link ? 'Link' : 'Unlink';
    this.mosaicId = tx.mosaicId.toHex().toLowerCase();
    // @TODO: name
    this.namespaceName = tx.namespaceId.toHex().toLowerCase();

    return this;
  }
}
