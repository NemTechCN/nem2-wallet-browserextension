/* eslint-disable no-param-reassign */
/**
 * Copyright (C) 2019 Contributors as noted in the AUTHORS file
 *
 * This file is part of nem2-wallet-browserextension.
 *
 * nem2-wallet-browserextension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * nem2-wallet-browserextension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with nem2-wallet-browserextension.  If not, see <http://www.gnu.org/licenses/>.
 */

import FormattedTransaction from './FormattedTransaction';
import AggregateProperties from './AggregateProperties';


/**
 *
 * Takes a an array of transaction as an input along with thestore/assets/NetworkAssets,
 * Flattens Aggregate transactions, and retunrs an array of transactions
 * formatted to be displayed as a list
 *
 */

export const formatTransactions = (transactions, namedAssets) => {
  const formattedTransactions = transactions.map((tx) => {
    if (tx.innerTransactions) {
      /** Augment inner transactions with some of their parent's properties */
      return tx.innerTransactions.map((innerTransaction, index) => {
        const aggregateProperties = new AggregateProperties(tx, index);

        const transactionToFormat = {
          ...innerTransaction,
          aggregateProperties,
          height: tx.transactionInfo.height,
          hash: tx.transactionInfo.hash,
          timestamp: tx.rejectionReason ? false : tx.timestamp,
          rejectionReason: tx.rejectionReason || false,
        };

        return [new FormattedTransaction(tx, transactionToFormat)];
      });
    }
    return [new FormattedTransaction(tx, namedAssets)];
  });
  return Array.prototype.concat.apply([], formattedTransactions);
};


export const removeDuplicatesAndSortByBlockNumber = (array) => {
  const noDuplicate = array.filter((item, index, self) => index === self.findIndex(t => (
    t.place === array.place && t.properties.customId === item.properties.customId
  )));
  return noDuplicate.sort((a, b) => b.properties.customId - a.properties.customId);
};
