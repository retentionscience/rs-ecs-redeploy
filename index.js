const core = require("@actions/core");
const aws = require("aws-sdk");

const MAX_WAIT_MINUTES = 360; // 6 hours
const WAIT_DEFAULT_DELAY_SEC = 15;

async function run() {
  try {
    const serviceName = core.getInput("service", { required: true });
    const clusterName =
      core.getInput("cluster", { required: false }) || "common-cluster";

    let waitForMinutes =
      parseInt(core.getInput("wait-for-minutes", { required: false })) || 30;
    if (waitForMinutes > MAX_WAIT_MINUTES) {
      waitForMinutes = MAX_WAIT_MINUTES;
    }

    const ecs = new aws.ECS();
    const params = {
      service: serviceName,
      cluster: clusterName,
      forceNewDeployment: true,
    };
    core.debug(`Updating service ${serviceName} on ${clusterName}`);
    await ecs.updateService(params).promise();
    core.info(
      `Deployment started. Watch this deployment's progress in the Amazon ECS console: https://console.aws.amazon.com/ecs/home?region=${aws.config.region}#/clusters/${clusterName}/services/${serviceName}/events`
    );

    core.debug(
      `Waiting for the service to become stable. Will wait for ${waitForMinutes} minutes`
    );
    const maxAttempts = (waitForMinutes * 60) / WAIT_DEFAULT_DELAY_SEC;
    await ecs
      .waitFor("servicesStable", {
        services: [serviceName],
        cluster: clusterName,
        $waiter: {
          delay: WAIT_DEFAULT_DELAY_SEC,
          maxAttempts: maxAttempts,
        },
      })
      .promise();
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;

/* istanbul ignore next */
if (require.main === module) {
  run();
}
