import { CreateAssetRequest } from "./CreateAssetRequest.dto";

export interface CreateAssetResponse extends CreateAssetRequest {
  uuid: string
}