const { Executable } = require("@intellion/executable");

module.exports = class Controller extends Executable {
  constructor(request, response) {
    if (!request || !response) throw new Error("Controller should be initiated with a request and response");
    super(); this.request = request; this.response = response;
  };
};