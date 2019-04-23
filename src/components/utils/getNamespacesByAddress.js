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

import {
  NamespaceHttp, BlockchainHttp,
} from 'nem2-sdk';
import {
  mergeMap, map,
} from 'rxjs/operators';
import { formatNamespaces } from './formatNamespaces';

// eslint-disable-next-line import/prefer-default-export
export const getNamespacesByAddress = async wallet => new Promise(async (resolve, reject) => {
  const namespaces = [];
  const endpoint = wallet.node;
  const { address } = wallet.account;
  const blockChainHttp = new BlockchainHttp(endpoint);
  const blockHeight = (await blockChainHttp.getBlockchainHeight().toPromise()).compact();
  const namespaceHttp = new NamespaceHttp(endpoint);
  namespaceHttp.getNamespacesFromAccount(address).pipe(
    mergeMap((namespacesInfo) => {
      const namespaceIds = namespacesInfo.map((x) => {
        namespaces[x.id.toHex().toUpperCase()] = { namespaceInfo: x };
        return x.id;
      });
      return namespaceHttp.getNamespacesName(namespaceIds);
    }),
    map(namespacesNames => namespacesNames.map((namespaceName) => {
      const namespace = namespaces[namespaceName.namespaceId.toHex().toUpperCase()];
      namespace.namespaceName = namespaceName;
      return namespace;
    })),
  ).subscribe((namespacesInfo) => {
    resolve(formatNamespaces(namespacesInfo, blockHeight));
  },
  error => reject(error));
});
