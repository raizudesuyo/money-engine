# QiDao Monitoring Engine

---

Monitors QiDao to look for vaults that can be liquidated. 

TODO:

- ✅ Initialize database by reading all vault data.
- ❌ Parallelize reading all vault data, through queues
- ❌ Enable monitoring of events Withdraw, deposit, repayment, borrow, liquidate, vault creation 
- ❌ Create Frontend (As part of Money Engine - QiDAO Monitoring UI)
- ❌ Create API for queries on monitoring data   
- ❌ Create APP to actually liquidate vaults   

## Requirements

Sample .env
```
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/qidao-monitoring-engine-db?schema=public"
MATIC_RPC="wss://matic-mainnet-full-ws.bwarelabs.com"
```

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
docker manifest create 218547968715.dkr.ecr.ap-southeast-2.amazonaws.com/qidao-monitoring-backend:latest 218547968715.dkr.ecr.ap-southeast-2.amazonaws.com/qidao-monitoring-backend:latest-amd64

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

## Environment Variables

- 

db_type || 'postgres',
db_host || 'localhost',
db_port || 5432,
db_user || 'postgres',
db_pass || 'mysecretpassword',
db_name || 'qidao-monitoring-engine-db',