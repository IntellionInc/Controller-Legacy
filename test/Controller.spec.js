const { expect, Assertion } = require("./ControllerMatcha");
const Executable = require("@intellion/executable");
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
        () => expect(controller).to.be.an.instanceof(Executable));
      it("should hold controller attributes",
        () => new Assertion(controller).toHaveProperties({ request, response }));
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
  })
});