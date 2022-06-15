import { Inject, Injectable } from '@nestjs/common';
import { Asset } from '../../entity';
import { Repository } from 'typeorm';
import { ASSET_REPOSITORY } from '../database'

@Injectable()
export class AssetService {

  constructor(
    @Inject(ASSET_REPOSITORY) private assetRepository: Repository<Asset>
  ) {}

  async create(createAssetDto: CreateAssetRequestDto): Promise<string> {
    const newAsset = new Asset();
    
    newAsset.address = createAssetDto.address;
    newAsset.chain = createAssetDto.chain;
    newAsset.name = newAsset.name;

    await this.assetRepository.insert(newAsset);
    return newAsset.uuid;
  }

  async findOne(uuid: string): Promise<Asset> {
    return this.assetRepository.findOne({ 
      where: { uuid, deleteFlag: false }
    });
  }

  async findAll() {
    return this.assetRepository.find({ 
      where: { deleteFlag: false }
    });
  }

  async findByNameAndChain(assetName: string, chain: string) {
    return this.assetRepository.findOne({
      where: {
        name: assetName,
        chain: chain,
        deleteFlag: false     
      }
    })
  }

  async findByAddress(address: string, chain: string) {
    return this.assetRepository.findOne({
      where: {
        address: address,
        chain: chain,
        deleteFlag: false, 
      }
    })
  }

  async remove(uuid: string) {
    const toBeRemoved = await this.assetRepository.findOne({where: {uuid}});
    toBeRemoved.deleteFlag = true;
    this.assetRepository.save(toBeRemoved);
  }
}

export interface CreateAssetRequestDto {
  name: string
  chain: string
  address: string
  oracles?: [string]
}

export interface CreateAssetResponseDto extends CreateAssetRequestDto {
  uuid: string
}