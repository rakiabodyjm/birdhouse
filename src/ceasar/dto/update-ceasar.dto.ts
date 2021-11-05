import { PartialType } from '@nestjs/swagger';
import { CreateCeasarDto } from './create-ceasar.dto';

export class UpdateCeasarDto extends PartialType(CreateCeasarDto) {}
