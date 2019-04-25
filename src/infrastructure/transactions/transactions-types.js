/* eslint-disable import/prefer-default-export */

import {
  TransactionType,
} from 'nem2-sdk';

export const GET_TRANSACTIONS_MODES = {
  INIT: 'init',
  REFRESH: 'refresh',
  MORE: 'more',
};

export const txTypeNameFromTypeId = (typeId) => {
  switch (typeId) {
  case TransactionType.TRANSFER: return 'Transfer';
  case TransactionType.REGISTER_NAMESPACE: return 'Register namespace';
  case TransactionType.ADDRESS_ALIAS: return 'Address alias';
  case TransactionType.MOSAIC_ALIAS: return 'Mosaic alias';
  case TransactionType.MOSAIC_DEFINITION: return 'Mosaic definition';
  case TransactionType.MOSAIC_SUPPLY_CHANGE: return 'Mosaic supply change';
  case TransactionType.MODIFY_MULTISIG_ACCOUNT: return 'Modify multisig account';
  case TransactionType.AGGREGATE_COMPLETE: return 'Aggregate complete';
  case TransactionType.AGGREGATE_BONDED: return 'Aggregate bonded';
  case TransactionType.LOCK: return 'Lock';
  case TransactionType.SECRET_LOCK: return 'Secret lock';
  case TransactionType.SECRET_PROOF: return 'Secret proof';
  case TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS: return 'Mod. account address';
  case TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC: return 'Mod. account mosaic';
  case TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE: return 'Mod. account entity type';
  case TransactionType.LINK_ACCOUNT: return 'Link account';
  default: return new Error('The transaction ID was not found');
  }
};

export const transactionTypesFilters = () => {
  const filters = {};
  const typeNamesToExclude = [
    'Aggregate complete',
    'Aggregate bonded',
    'The transaction ID was not found',
  ];

  Object.keys(TransactionType).forEach((key) => {
    const typeName = txTypeNameFromTypeId(TransactionType[key]);
    if (typeNamesToExclude.indexOf(typeName) === -1) {
      // Hacky trick to preserve reactivity while keeping a simple object
      const typeIndex = typeName.replace(/ /g, '_').replace(/\./g, '8');
      filters[typeIndex] = true;
    }
  });

  return filters;
};
