import { NamespaceType } from 'nem2-sdk';

export default class {
  constructor(tx) {
    this.namespaceName = tx.namespaceName;
    this.duration = tx.namespaceType === NamespaceType.RootNamespace
      ? tx.duration.compact().toLocaleString() : 0;

    // @TODO: name
    this.parentNamespaceId = tx.namespaceType === NamespaceType.RootNamespace
      ? false : tx.parentId.toHex().toLowerCase();
  }
}
