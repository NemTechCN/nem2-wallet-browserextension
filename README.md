# nem2-wallet-browserextension

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Build Status](https://travis-ci.org/nemfoundation/nem2-wallet-browserextension.svg?branch=master)](https://travis-ci.org/nemfoundation/nem2-wallet-browserextension)

[NEM2][nem2], aka Catapult, Wallet as Firefox Extension.

## Vision

A browser wallet to facilitate the integration with web applications and Catapult Blockchain in a user-friendly manner.

## Contributing

This project uses [C4(Collective Code Construction Contract)](https://rfc.zeromq.org/spec:42/C4/) process for contributions.

- [Alpha Milestone Scope](https://github.com/nemfoundation/nem2-wallet-browserextension/wiki/Alpha-Milestone)
- [Non Planned Features](https://github.com/nemfoundation/nem2-wallet-browserextension/wiki/Non-Planned-Features)
- [Development Guidelines](https://github.com/nemfoundation/nem2-wallet-browserextension/wiki/Development-Guidelines)
- [Development Environment](https://github.com/nemfoundation/nem2-wallet-browserextension/wiki/Development-environment)

When you find that _nem2-wallet-browserextension_ could have XYZ, __think about what you can do for open source not what open source can do for you__. If you find something it's not working or something is missing, feel free to open a Pull Request, I will be more than happy to merge it, but I don't do features on demand :smile:.

## Tools (I use)
- Make sure to use Node LTS (Node 12 is not yet supported)
- npm or yarn
- [visual studio code](https://code.visualstudio.com/) or your preferred IDE
- [web-ext](https://github.com/mozilla/web-ext)

```bash
$> npm install --global web-ext
```

- [Firefox](https://www.mozilla.org/en-US/firefox/new/)

## Clone repository

```bash
$> git clone git@github.com:nemfoundation/nem2-wallet-browserextension.git
$> cd nem2-wallet-browserextension
```

## Install development dependencies

```
$> npm i
```

## Run development mode

In a windows environment:
```
$> npm run windev
```

In other environments:

```
$> npm run watch & npm run web-ext:run
```

`web-ext` will open your Firefox browser with the extension loaded.

Developing in web mode with hot reload:
(Note that if you just installed the dependencies, you need to run npm run production before launching the hot reload mode)
```
$> npm run hot
```
Browse to localhost:8080/wallet.html

## License

Copyright (c) 2019-present Contributors as noted in the AUTHORS file

This file is part of nem2-wallet-browserextension.

nem2-wallet-browserextension is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

nem2-wallet-browserextension is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with nem2-wallet-browserextension. If not, see http://www.gnu.org/licenses/

[nem2]: https://nemtech.github.io/
