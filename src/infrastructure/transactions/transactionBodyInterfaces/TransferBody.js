import NamedMosaic from '../../assets/NamedMosaic';
import MainPropsMosaics from '../../assets/MainPropsMosaics';
import { PARAMS } from '../../../constants';

export default class TransferBody {
  constructor(tx, namedAssets) {
    const message = tx.message.payload;
    const namedMosaicsWithAmount = tx.mosaics.length > 0
      ? tx.mosaics.map(mosaic => ({
        ...new NamedMosaic(mosaic, namedAssets),
        amount: mosaic.amount.compact().toLocaleString(),
      }))
      : false;

    this.body = {
      message,
      mosaics: namedMosaicsWithAmount,
    };

    this.mainProps = this.createMainProps();
  }

  createMainProps() {
    const { message, mosaics } = this.body;
    const { MAX_TRANSACTION_MAIN_PROPS_LINES } = PARAMS;
    let mainProps = {};

    const maxNumberOfMosaicsInMainProps = message === ''
      ? MAX_TRANSACTION_MAIN_PROPS_LINES : MAX_TRANSACTION_MAIN_PROPS_LINES - 1;

    if (message !== '') mainProps.message = message;

    if (mosaics.length > 0 && mosaics.length <= maxNumberOfMosaicsInMainProps) {
      mainProps = { ...mainProps, ...new MainPropsMosaics(mosaics).get() };
    } else {
      const numberOfMosaicsInTransfer = mosaics.length;
      const mosaicsInMainProps = [...mosaics];
      mosaicsInMainProps.length = maxNumberOfMosaicsInMainProps - 1;
      mainProps = {
        ...new MainPropsMosaics(mosaics).get(),
        'Number of mosaics': numberOfMosaicsInTransfer,
      };
    }

    return mainProps;
  }
}
