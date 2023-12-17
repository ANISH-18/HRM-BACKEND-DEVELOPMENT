import {
  Body,
  Query,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import {
  AccessTokenGuard,
  GetCurrentUser,
  GetCurrentUserId,
  RefreshTokenGuard,
} from '@jwt_auth';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { updateEmployeeDto } from './dto/update-employee.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() input: SignUpUserDto) {
    return this.authService.signUp(input);
  }

  @Post('signin')
  signIn(@Body() input: SignInUserDto) {
    return this.authService.signIn(input);
  }



  //########################################################################
  @UseGuards(AccessTokenGuard)
  @Get('signout')
  signOut(@GetCurrentUserId() userId) {
       return this.authService.signOut(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refreshtoken')
  refreshToken(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Get('forgot-password/:email')
  forgetPassword(@Param('email') email: string) {
    return this.authService.forgetPassword(email);
  }

  @Post('reset-password')
  resetPassword(@Body() input: ResetPasswordDto) {
    return this.authService.resetPassword(input);
  }
}
