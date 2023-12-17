import { PartialType } from "@nestjs/mapped-types";
import { PunchingEntryDto } from "./create-punching.dto";

export class updatePunchingDto extends PartialType(PunchingEntryDto) {}
