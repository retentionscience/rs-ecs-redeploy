const run = require(".");
const core = require("@actions/core");

jest.mock("@actions/core");
jest.mock("@actions/exec");

jest.mock("aws-sdk");

const mockEcsUpdateService = jest.fn();

describe("Rdeploy ECS", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    core.getInput = jest
      .fn()
      .mockReturnValueOnce("rs-stg-wordpress") // service
      .mockReturnValueOnce("common-cluster"); // cluster

    mockEcsUpdateService.mockImplementation(() => {
      return {
        promise() {
          return Promise.resolve({});
        },
      };
    });
  });

  test("Redeploy stg-rs-wordpress", async () => {
    await run();
    expect(mockEcsUpdateService).toHaveBeenNthCalledWith(1, {
      clusterName: "common-cluster",
      serviceName: "rs-stg-wordpress",
    });
  });
});
