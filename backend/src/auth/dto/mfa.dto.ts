import { IsNotEmpty, IsString } from 'class-validator';

export class MfaPayload {
  @IsString()
  @IsNotEmpty()
  code: string;
}
