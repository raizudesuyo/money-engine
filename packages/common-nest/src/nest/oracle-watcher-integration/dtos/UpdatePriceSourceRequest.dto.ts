import { PollPriority } from "@money-engine/common";

export interface UpdatePriceSourceRequest {
  priceSourceUuid: string
  pollPriority: PollPriority
}
