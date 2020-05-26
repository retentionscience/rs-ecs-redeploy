## Amazon ECS Redeploy Action for GitHub Actions

Redeploys a service in an ECS cluster

**Table of Contents**

<!-- toc -->

- [Usage](#usage)
- [License Summary](#license-summary)

<!-- tocstop -->

## Usage

```yaml
     - name: Update ECS Servce
        id: update-service
        uses: retentionscience/rs-ecs-redeploy
        with:
          serviceName: 'stg-rate-limit-service',
          clusterName: 'common-cluster'

```

## License Summary

This code is made available under the MIT license.
