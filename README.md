# QiDao Money Engine

---

Monitors QiDao to look for vaults that can be liquidated, also acts as my practice project for kubernetes, jenkins, typescript, monorepos, web3 and it runs on ARM devices! (Raspberry pis and such), will be part of my bigger system "money-engine" that will try to make money with DAOs thru flashloans

## TODO:

- ✅ Initialize database by reading all vault data.
- ❌ Parallelize reading all vault data, through queues
- ✅ Enable monitoring of events Withdraw, deposit, repayment, borrow, liquidate, vault creation 
- ❌ Create Frontend (As part of Money Engine - QiDAO Monitoring UI)
- ✅ Create API for queries on monitoring data   
- ❌ Create APP to actually liquidate vaults   

## Requirements

### Configs

- db related, monitoring and monitoring-api = db_type, db_host, db_port, db_user, db_pass, db_name 
- monitoring = POLYGON_RPC, FANTOM_RPC, AVALANCHE_RPC, MOONRIVER_RPC, CHRONOS_RPC, ARBITRUM_RPC, HARMONY_RPC, GNOSIS_CHAIN_RPC 
- api specific - MONITORING_PORT
- 

### To Build

```shell
# Build image
docker buildx build --tag qidao-monitoring-backend:latest --platform linux/amd64 .

# To build to the for the right repository
docker buildx build --tag 218547968715.dkr.ecr.ap-southeast-2.amazonaws.com/qidao-monitoring-backend:latest-amd64 -f Dockerfile.amd64  .

docker build --tag 218547968715.dkr.ecr.ap-southeast-2.amazonaws.com/qidao-monitoring-backend:latest-armv7 -f Dockerfile.armv7 .

#Just build it on the right platform
docker build --tag 218547968715.dkr.ecr.ap-southeast-2.amazonaws.com/qidao-monitoring-backend:latest-arm64v8 -f Dockerfile.arm64v8 .

# to push
docker push 218547968715.dkr.ecr.ap-southeast-2.amazonaws.com/qidao-monitoring-backend:latest-amd64

# Create manifests for platforms, execute on each
docker manifest create 218547968715.dkr.ecr.ap-southeast-2.amazonaws.com/qidao-monitoring-backend:latest 218547968715.dkr.ecr.ap-southeast-2.amazonaws.com/qidao-monitoring-backend:latest-amd64 218547968715.dkr.ecr.ap-southeast-2.amazonaws.com/qidao-monitoring-backend:latest-arm64v8

```

### To run in kubernetes

You need to get the credentials first and make a docker-credentials secret and name it regcred

```
aws ecr get-login-password --region ap-southeast-2

kubectl create secret docker-registry regcred --docker-server=218547968715.dkr.ecr.ap-southeast-2.amazonaws.com --docker-username=AWS --docker-password=that thing from earlier 

kubectl apply -f .k8s

kubectl delete secret regcred
```

## Rest API

```
GET /vaults - get all vault details
GET /vaults/{vaultId} - get vault users
    params, sortByCollateral, items, page
GET /vaultData - get vault data, liquidation ratios and all that, cursor paginated
```

NOTE: Requires ts-node to be installed globally due to TypeORM