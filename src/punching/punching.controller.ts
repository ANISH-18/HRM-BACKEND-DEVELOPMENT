import {
  Body,
  Controller,
  Query,
  Post,
  Put,
  Get,
  UseGuards,
} from '@nestjs/common/decorators';
//import { GetCurrentUserId } from '@jwt_auth';
import { PunchingEntryDto } from './dto/create-punching.dto';
import { PunchingService } from './punching.service';
import { updatePunchingDto } from './dto/update-punching.dto';

import { AccessTokenGuard, GetCurrentUserId } from '@jwt_auth';

@Controller('punch')
export class PunchingController {
  constructor(private readonly punchingService: PunchingService) {}

  //CLOCK IN/OUT
  @UseGuards(AccessTokenGuard)
  @Post('punch')
  punch(
    @Body() createInput: PunchingEntryDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.punchingService.punchIn(createInput, userId);
  }

  //RECENT CLOCK IN'S
  @UseGuards(AccessTokenGuard)
  @Get('recentClockIns')
  getRecentClock(@GetCurrentUserId() emp_id: string) {
    return this.punchingService.getRecentClock(emp_id);
  }

  // CHECK STATUS
  @UseGuards(AccessTokenGuard)
  @Get('checkStatus')
  getClockStatus(@GetCurrentUserId() emp_id: string) {
    return this.punchingService.getClockStatus(emp_id);
  }

  //GET ATTENDANCE BETWEEN DATES
  @UseGuards(AccessTokenGuard)
  @Get('getBetweenDates')
  getBetweenDates(
    @GetCurrentUserId() emp_id: string,
    @Query('start_date') start_date: string,
    @Query('present_date') present_date: string,
  ) {
    return this.punchingService.getBetweenDates(
      emp_id,
      start_date,
      present_date,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('getDates')
  async getDates(@GetCurrentUserId() emp_id: string) {
    return await this.punchingService.getDates(emp_id);
  }
}
