import { LinkAction } from 'nem2-sdk';

export default class {
  constructor(tx) {
    this.remoteAccountKey = tx.remoteAccountKey;
    this.linkAction = tx.actionType === LinkAction.Link ? 'Link' : 'Unlink';
  }
}
