import { TransactionType } from 'nem2-sdk';

import TransferBody from './transactionBodyInterfaces/TransferBody';
import RegisterNamespaceBody from './transactionBodyInterfaces/RegisterNamespaceBody';
import AddressAliasBody from './transactionBodyInterfaces/AddressAliasBody';
import MosaicAliasBody from './transactionBodyInterfaces/MosaicAliasBody';
import MosaicDefinitionBody from './transactionBodyInterfaces/MosaicDefinitionBody';
import MosaicSupplyChangeBody from './transactionBodyInterfaces/MosaicSupplyChangeBody';
import ModifyMultisigAccountBody from './transactionBodyInterfaces/ModifyMultisigAccountBody';
import LockBodyInterface from './transactionBodyInterfaces/LockBody';
import SecretLockBody from './transactionBodyInterfaces/SecretLockBody';
import SecretProofBodyInterface from './transactionBodyInterfaces/SecretProofBody';
import ModifyAccountPropertyAddressBody from './transactionBodyInterfaces/ModifyAccountPropertyAddressBody';
import ModifyAccountPropertyMosaicBody from './transactionBodyInterfaces/ModifyAccountPropertyMosaicBody';
import ModifyAccountPropertyEntityTypeBody from './transactionBodyInterfaces/ModifyAccountPropertyEntityTypeBody';
import LinkAccountBody from './transactionBodyInterfaces/LinkAccountBody';

/**
 *
 * Returns a transaction formatted specific fields according to its type
 *
 */

export default function TxSpecificPropertiesFactory(tx, namedAssets) {
  switch (tx.type) {
  case TransactionType.TRANSFER: return new TransferBody(tx, namedAssets);
  case TransactionType.REGISTER_NAMESPACE: return new RegisterNamespaceBody(tx);
  case TransactionType.ADDRESS_ALIAS: return new AddressAliasBody(tx);
  case TransactionType.MOSAIC_ALIAS: return new MosaicAliasBody(tx);
  case TransactionType.MOSAIC_DEFINITION: return new MosaicDefinitionBody(tx);
  case TransactionType.MOSAIC_SUPPLY_CHANGE: return new MosaicSupplyChangeBody(tx);
  case TransactionType.MODIFY_MULTISIG_ACCOUNT:
    return new ModifyMultisigAccountBody(tx);

  case TransactionType.LOCK: return new LockBodyInterface(tx);
  case TransactionType.SECRET_LOCK: return new SecretLockBody(tx);
  case TransactionType.SECRET_PROOF: return new SecretProofBodyInterface(tx);
  case TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS:
    return new ModifyAccountPropertyAddressBody(tx);

  case TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC:
    return new ModifyAccountPropertyMosaicBody(tx);

  case TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE:
    return new ModifyAccountPropertyEntityTypeBody(tx);

  case TransactionType.LINK_ACCOUNT: return new LinkAccountBody(tx);
  default: throw new Error('Transaction type not supported...');
  }
}
