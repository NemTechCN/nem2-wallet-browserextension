export default class {
  constructor(tx) {
    this.secret = tx.secret;
    this.proof = tx.proof;
    return this;
  }
}
