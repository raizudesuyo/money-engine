import { DataSource, Repository } from 'typeorm';
import { QiVault, GlobalState } from '../../../entity';

export const GlobalStateRepository = (dataSource: DataSource): TGlobalStateRepository => dataSource.getRepository(GlobalState).extend({

  async findByConfigName(configName: string): Promise<string | null> {
    
    // Because ThisType doesn't work on intellisense
    const fakeThis: Repository<GlobalState> = this
    
    return (await fakeThis.findOne({
      where: {
        configName
      }
    }))?.value || null;
  },

  async setConfigBoolean(configName: string, value: boolean) {
    // Because ThisType doesn't work on intellisense
    const fakeThis: Repository<GlobalState> = this
    
    const config = await fakeThis.findOne({
      where: {
        configName
      }
    });

    if(!!config) {
      config.value = value.toString();
      await fakeThis.save(config)
    } else {
      await fakeThis.insert(new GlobalState({
        configName,
        value: value.toString()
      }))
    }
  }

})

export type TGlobalStateRepository = Repository<GlobalState> & {
  findByConfigName(configName: string): Promise<string | null>;
  setConfigBoolean(configName: string, value: boolean): Promise<void>
}
