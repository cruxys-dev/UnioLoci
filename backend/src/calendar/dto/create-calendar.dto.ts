import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCalendarDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
