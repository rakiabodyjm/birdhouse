import { PartialType } from '@nestjs/swagger';
import { CreateExternalCeasarDto } from './create-external-ceasar.dto';

export class UpdateExternalCeasarDto extends PartialType(CreateExternalCeasarDto) {}
