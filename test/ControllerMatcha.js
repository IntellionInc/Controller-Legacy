let { Assertion, Stub, expect, sinon } = require("@intellion/executable").Matcha;

class ControllerAssertion extends Assertion { };
class ControllerStub extends Stub { };

module.exports = {
  expect, sinon,
  Assertion: ControllerAssertion, Stub: ControllerStub
};