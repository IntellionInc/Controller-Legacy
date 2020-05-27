const { Chain } = require("@intellion/executable");

module.exports = class Controller extends Chain {
  constructor(request, response) {
    if (!request || !response) throw new Error("Controller should be initiated with a request and response");
    super({ breakOnError: true });
    this.request = request; this.response = response;
    this
      .before(this._authorize)
      .main(this._control)
      .finally(this._respond);
  };
  authProtocol = async () => true;

  _authorize = async () => {
    switch (await this.authProtocol()) {
      case true:
        this.response.status(200);
        return { success: true };
      default:
        this.response.status(401);
        return { success: false };
    };
  };
  _control = async () => { };
  _respond = async () => { };

};