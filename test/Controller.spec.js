const { expect, Assertion, Stub } = require("./ControllerMatcha");
const { Chain } = require("@intellion/executable");
const Controller = require("../main/Controller");

describe("Controller", () => {
  let controller, request, response;

  beforeEach(() => {
    request = {};
    response = {};
    controller = new Controller(request, response);
  });

  describe("constructor", () => {
    context("when request and response has been provided", () => {
      it("should be an executable",
        () => expect(controller).to.be.an.instanceof(Chain));
      it("should hold controller attributes",
        () => new Assertion(controller).toHaveProperties({ request, response, breakOnError: true }));
      it("should hold authorize before hook", () => expect(controller._beforeHooks[0].method).to.eq(controller._authorize));
      it("should hold control main hook", () => expect(controller._mainHooks[0].method).to.eq(controller._control));
      it("should hold respond finally hook", () => expect(controller._finallyHooks[0].method).to.eq(controller._respond));
    });
    context("when either request or response is missing", () => {
      it("should throw an error for missing request",
        () => new Assertion(() => new Controller(undefined, response))
          .whenCalledWith().should().throw("Controller should be initiated with a request and response"));
      it("should throw an error for missing response",
        () => new Assertion(() => new Controller(request))
          .whenCalledWith().should().throw("Controller should be initiated with a request and response"));
      it("should throw an error for missing request and response",
        () => new Assertion(() => new Controller())
          .whenCalledWith().should().throw("Controller should be initiated with a request and response"));
    });
  });
  describe("authProtocol", () => {
    it("should return true by default", () => new Assertion(controller.authProtocol).whenCalledWith().should().resolve(true));
  });
  describe("controls", () => {
    let myFunction = () => { };
    beforeEach(() => {
      controller.functionName = myFunction;
    });

    it("should set the controlled function and return this", () => new Assertion(controller.controls).whenCalledWith("functionName")
      .should(r => expect(controller._controlledFunction).to.eq(myFunction)).return(controller));
  });
  describe("_authorize", () => {
    let authProtocolResult, statusCode;
    beforeEach(() => {
      new Stub(controller).receives("authProtocol").with().andResolves(authProtocolResult);
      new Stub(controller.response).receives("status").with(statusCode);
    });
    context("for a successful authProtocol", () => {
      before(() => {
        authProtocolResult = true
        statusCode = 200;
      });
      it("should return successful response", () => new Assertion(controller._authorize)
        .whenCalledWith().should().resolve({ success: true }))
    });
    context("for an unsuccessful authProtocol", () => {
      before(() => {
        authProtocolResult = false
        statusCode = 401;
      });
      it("should return unsuccessful response", () => new Assertion(controller._authorize)
        .whenCalledWith().should().resolve({ success: false }))
    });
  });
  describe("_control", () => {
    let result = { some: "result" };
    beforeEach(() => {
      new Stub(controller).receives("_controlledFunction").with(request).andResolves(result);
    });
    it("should call the controlledFunction", () => new Assertion(controller._control)
      .whenCalledWith().should(r => expect(controller._controlledResult).to.eq(result)).succeed());
  });
});