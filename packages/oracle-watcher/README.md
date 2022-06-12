// Watches price changes on everything it is told on. 
// Raises events based on price change delta

System Flow

Another Service implements the following
- ❌ IOracleWatcherAssetProvider 
  - OracleWatcher will send an event on the system and microservices implementing this will reply with an event 'oracle-watcher--register-asset'
- ❌ IOracleWatcherOracleProvider
  - OW will send and event and expect registration replies
  'oracle-watcher--register-oracle'

Services will also request for the following
- 'oracle-watcher--create-delta-alert'

Services will receive the following
- 'oracle-watcher--receive-delta-alert'

