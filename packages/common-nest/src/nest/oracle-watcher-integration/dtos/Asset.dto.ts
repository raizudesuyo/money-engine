export interface AssetDTO {
    uuid: string
    name: string
    chain: string
    address: string
    oracles?: string[]
}

export interface CreateAssetRequest extends Omit<AssetDTO, 'uuid'> {}
export interface CreateAssetResponse extends AssetDTO {};