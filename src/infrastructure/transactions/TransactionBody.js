import { TransactionType } from 'nem2-sdk';

import TransferBodyInterface from './TransferBodyInterface';
import RegisterNamespaceBodyInterface from './RegisterNamespaceBodyInterface';
import AddressAliasBodyInterface from './AddressAliasBodyInterface';
import MosaicAliasBodyInterface from './MosaicAliasBodyInterface';
import MosaicDefinitionBodyInterface from './MosaicDefinitionBodyInterface';
import MosaicSupplyChangeBodyInterface from './MosaicSupplyChangeBodyInterface';
import ModifyMultisigAccountBodyInterface from './ModifyMultisigAccountBodyInterface';
import LockBodyInterface from './LockBodyInterface';
import SecretLockBodyInterface from './SecretLockBodyInterface';
import SecretProofBodyInterface from './SecretProofBodyInterface';
import ModifyAccountPropertyAddressBodyInterface from './ModifyAccountPropertyAddressBodyInterface';
import ModifyAccountPropertyMosaicBodyInterface from './ModifyAccountPropertyMosaicBodyInterface';
import ModifyAccountPropertyEntityTypeBodyInterface from './ModifyAccountPropertyEntityTypeBodyInterface';
import LinkAccountBodyInterface from './LinkAccountBodyInterface';

export default class {
  constructor(tx, namedAssets) {
    this.tx = tx;
    this.namedAssets = namedAssets;
    this.body = this.getBody();
    return this.body;
  }

  getBody() {
    const { tx, namedAssets } = this;
    switch (tx.type) {
    case TransactionType.TRANSFER: return new TransferBodyInterface(tx, namedAssets);
    case TransactionType.REGISTER_NAMESPACE: return new RegisterNamespaceBodyInterface(tx);
    case TransactionType.ADDRESS_ALIAS: return new AddressAliasBodyInterface(tx);
    case TransactionType.MOSAIC_ALIAS: return new MosaicAliasBodyInterface(tx);
    case TransactionType.MOSAIC_DEFINITION: return new MosaicDefinitionBodyInterface(tx);
    case TransactionType.MOSAIC_SUPPLY_CHANGE: return new MosaicSupplyChangeBodyInterface(tx);
    case TransactionType.MODIFY_MULTISIG_ACCOUNT:
      return new ModifyMultisigAccountBodyInterface(tx);

    case TransactionType.LOCK: return new LockBodyInterface(tx);
    case TransactionType.SECRET_LOCK: return new SecretLockBodyInterface(tx);
    case TransactionType.SECRET_PROOF: return new SecretProofBodyInterface(tx);
    case TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS:
      return new ModifyAccountPropertyAddressBodyInterface(tx);

    case TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC:
      return new ModifyAccountPropertyMosaicBodyInterface(tx);

    case TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE:
      return new ModifyAccountPropertyEntityTypeBodyInterface(tx);

    case TransactionType.LINK_ACCOUNT: return new LinkAccountBodyInterface(tx);
    default: throw new Error('Transaction type not supported...');
    }
  }
}
