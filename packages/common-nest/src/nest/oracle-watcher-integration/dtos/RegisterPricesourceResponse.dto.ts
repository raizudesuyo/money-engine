import { RegisterPricesourceRequest } from './RegisterPricesourceRequest.dto';


export interface RegisterPricesourceResponse extends RegisterPricesourceRequest {
  uuid: string;
}
