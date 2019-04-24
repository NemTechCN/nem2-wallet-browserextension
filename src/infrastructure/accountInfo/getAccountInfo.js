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

import { AccountHttp } from 'nem2-sdk';
import { formatAccountInfo } from './formatAccountInfo';

const getAccountInfo = wallet => new Promise((resolve, reject) => {
  const accountHttp = new AccountHttp(wallet.node);
  let address;
  if (wallet.isWatchOnly) {
    address = wallet.publicAccount
      ? wallet.publicAccount.address : wallet.address;
  } else {
    // eslint-disable-next-line prefer-destructuring
    address = wallet.account.address;
  }

  accountHttp.getAccountInfo(address).subscribe(
    (ai) => {
      resolve(formatAccountInfo(ai));
    },
    (err) => {
      // @TODO: rationalize
      if (
        err.response
          && JSON.parse(err.response.text).code === 'ResourceNotFound'
      ) {
        reject(new Error('ResourceNotFound'));
      } else {
        reject(new Error('error at getAccountInfo', JSON.stringify(err)));
      }
    },
  );
});

export default getAccountInfo;
