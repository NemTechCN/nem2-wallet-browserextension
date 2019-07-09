import NamedMosaic from '../../assets/NamedMosaic';
import { PARAMS } from '../../../constants';

export default class {
  constructor(tx, namedAssets) {
    const message = tx.message.payload;
    const namedMosaicsWithAmount = tx.mosaics.length > 0
      ? tx.mosaics.map(mosaic => ({
        ...new NamedMosaic(mosaic, namedAssets),
        amount: mosaic.amount,
      }))
      : false;

    this.body = {
      message,
      mosaics: namedMosaicsWithAmount,
    };

    this.mainProps = this.buildMainProps();
  }

  buildMainProps() {
    const { message, mosaics } = this.body;
    const { MAX_TRANSACTION_MAIN_PROPS_LINES } = PARAMS;
    let mainProps = {};

    const maxNumberOfMosaicsInMainProps = message === ''
      ? MAX_TRANSACTION_MAIN_PROPS_LINES : MAX_TRANSACTION_MAIN_PROPS_LINES - 1;

    if (message !== '') mainProps.message = message;

    if (mosaics.length <= maxNumberOfMosaicsInMainProps) {
      mainProps = { ...mainProps, ...mosaics };
    } else {
      const numberOfMosaicsInTransfer = mosaics.length;
      const mosaicsInMainProps = [...mosaics];
      mosaicsInMainProps.length = maxNumberOfMosaicsInMainProps - 1;
      mosaicsInMainProps.push({ 'Number of mosaics': numberOfMosaicsInTransfer });
    }

    return mainProps;
  }
}
