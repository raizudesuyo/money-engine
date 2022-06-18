
export interface CreateAssetRequest {
  name: string
  chain: string
  address: string
  oracles?: [string]
}