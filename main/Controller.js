const { Chain } = require("@intellion/executable");

module.exports = class Controller extends Chain {
  constructor(request, response) {
    if (!request || !response) throw new Error("Controller should be initiated with a request and response");
    super({ breakOnError: true });
    this.request = request; this.response = response;
    this
      .before(this._authorize)
      .before(this._validate)
      .main(this._control)
      .finally(this._respond);
  };
  authProtocol = async () => true;
  validationProtocol = async () => true;
  controls = functionName => { this._controlledFunction = this[functionName]; return this };
  withoutAuthentication = () => {
    let authHook = this._beforeHooks.find(i => i.method === this._authorize);
    let authIndex = this._beforeHooks.indexOf(authHook);
    this._beforeHooks.splice(authIndex, 1);
    return this;
  };
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
  _validate = async () => {
    let { success, data } = await this.validationProtocol();
    switch (success) {
      case true:
        this.response.status(200);
        return { success: true };
      default:
        this.response.status(400);
        this._controlledResult = { success, data };
        return { success: false };
    };
  };
  _control = async () => {
    let controlledResult;
    try { controlledResult = await this._controlledFunction(this.request); }
    catch (error) { controlledResult = { success: false, error: error.message, stack: error.stack } }
    if (controlledResult && controlledResult.success === false) this.response.status(controlledResult.status || 500);
    this._controlledResult = controlledResult;
  };
  _respond = async () => this.response.send(this._controlledResult);
};