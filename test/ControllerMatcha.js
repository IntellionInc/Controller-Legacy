let { Assertion, Stub, expect, sinon } = require("@intellion/matchalatte");

class ControllerAssertion extends Assertion { };
class ControllerStub extends Stub { };

module.exports = {
  expect, sinon,
  Assertion: ControllerAssertion, Stub: ControllerStub
};