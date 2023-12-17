import { EmployeeRepository } from '@database/repositories/employee.repository';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
   Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpUserDto } from './dto/signup-user.dto';
import { AuthHelper } from '@helpers';
import { SignInUserDto } from './dto/signin-user.dto';
import { JwtAuthService } from '@jwt_auth';
import { MailService } from '@mail';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { updateEmployeeDto } from './dto/update-employee.dto';
import { PunchingService } from 'src/punching/punching.service';
import { validateOrReject } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly authHelper: AuthHelper,
    private readonly jwtAuthService: JwtAuthService,
    private readonly mailService: MailService,
    private readonly punchingService:PunchingService,
  ) {}

  async signUp(input: SignUpUserDto) {
    try {
      console.log(input)

      const userInDb = await this.employeeRepository.findByEmail(
        input.officialEmail,
      );
      
      if (userInDb) {
        throw new ConflictException('User already exists');
      }
      
      await validateOrReject(input)

      input.password = await this.authHelper.encodePassword(input.password);

      let user = await this.employeeRepository.create({
        ...input,
        emp_positon: input.emp_position
      });
      user = await this.employeeRepository.save(user);

      console.log(user);
      

      return {
        message: 'User Registered Successfully...',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken?: string | null,
  ) {
    const hashedRefreshToken = refreshToken
      ? await this.authHelper.encodePassword(refreshToken)
      : null;
    await this.employeeRepository.update(
      { id: userId },
      {
        refreshToken: hashedRefreshToken,
      },
    );
  }

  async signIn(input: SignInUserDto) {
    try {
      const user = await this.employeeRepository.findByEmail(
        input.officialEmail,
      );

      if (!user) {
        throw new NotFoundException('Invalid email or password');
      }

      const isPasswordMatches = await this.authHelper.isPasswordValid(
        input.password,
        user.password,
      );

     const UserObj = {
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      emp_position: user.emp_positon,
      profilePic: user.profilePic
     }

      if (!isPasswordMatches) {
        throw new ForbiddenException('Invalid email or password');
      }

      
      const accessToken = await this.jwtAuthService.generateAccessToken({
        userId: user.id,
        officialEmail: user.officialEmail,
        emp_role: user.emp_role,
      });
      const refreshToken = await this.jwtAuthService.generateRefreshToken({
        userId: user.id,
        officialEmail: user.officialEmail,
        emp_role: user.emp_role,
      });

      await this.updateRefreshToken(user.id, refreshToken);
      return {
        message: 'Signed in successfully',
        data: {
          user: UserObj,
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async signOut(userId: string) {
    try {
      await this.updateRefreshToken(userId, null);
     // await this.punchingService.punch_out(userId);
      return {
        message: 'Signed out successfully',
      };
    } catch (err) {
      throw err;
    }
  }

  async refreshToken(userId: string, token: string) {
    try {
      const user = await this.employeeRepository.findById(userId);

      if (!user || !user.refreshToken)
        throw new ForbiddenException('Access Denied');

      const refreshTokenMatches = await this.authHelper.isPasswordValid(
        token,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new ForbiddenException('Access Invaid Denied');
      }

      const refreshToken = await this.jwtAuthService.generateRefreshToken({
        userId: user.id,
        officialEmail: user.officialEmail,
        emp_role: user.emp_role,
      });

      await this.updateRefreshToken(user.id, refreshToken);

      const accessToken = await this.jwtAuthService.generateAccessToken({
        userId: user.id,
        officialEmail: user.officialEmail,
        emp_role: user.emp_role,
      });

      return {
        messaage: 'Token refreshed successfully',
        data: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword(officialEmail: string) {
    try {
      const user = await this.employeeRepository.findByEmail(officialEmail);

      if (!user) {
        throw new NotFoundException('Invalid user email');
      }

      const resetToken = await this.jwtAuthService.generateResetPasswordToken({
        userId: user.id,
        officialEmail: user.officialEmail,
      });

      await this.employeeRepository.update({ id: user.id }, { resetToken });
      let clientUrl = process.env.CLIENT_URL;
      const link = `${clientUrl}/resetPassword/${resetToken}`;
      this.mailService.sendResetPasswordLink(officialEmail, link);
      return {
        message: 'Reset password link sent to your aacount',
      };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(input: ResetPasswordDto) {
    try {
      const tokenData = await this.jwtAuthService.verifyResetPasswordToken(
        input.resetToken,
      );

      if (!tokenData) {
        throw new NotFoundException('Invalid reset password token');
      }

      const user = await this.employeeRepository.findById(tokenData);
      // console.log("user",user.email);

      if (!user) {
        throw new NotFoundException(
          'Invalid rest password token, no user found for this token',
        );
      }

      input.password = await this.authHelper.encodePassword(input.password);
      await this.employeeRepository.update(
        { officialEmail: user.officialEmail },
        { password: input.password, resetToken: null },
      );

      return {
        message: 'Password reset successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // async updateEmployee(id: string, update: updateEmployeeDto) {
  //   try {
  //     const existingEmployee = await this.employeeRepository.findOne({
  //       where: { id },
  //     });
  //     if (!existingEmployee) {
  //       throw new BadRequestException('Employee not found');
  //     }

  //     await this.employeeRepository.update({ id }, update);

  //     const updatedEmployee = await this.employeeRepository.findOne({
  //       where: { id },
  //     });
  //     return {
  //       message: 'Employee Updated Succesfully',
  //       data: updatedEmployee,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async getAllEmployee() {
  //   try {
  //     const employee = await this.employeeRepository.find();
  //     if (!employee) {
  //       throw new BadRequestException('No Employee Found');
  //     }

  //     return {
  //       message: 'Employee Details Fetched',
  //       data: employee,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async getEmployee(id: string) {
  //   try {
  //     const employee = await this.employeeRepository.findOneBy({ id });
  //     if (!employee) {
  //       throw new BadRequestException('Employee Not Found');
  //     }

  //     return {
  //       message: 'Employee fetched Succesfully',
  //       data: employee,
  //     };
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // async deleteEmployee(id: string) {
  //   try {
  //     const deleteEmp = await this.employeeRepository.findOne({
  //       where: { id },
  //     });
  //     if (!deleteEmp) {
  //       throw new BadRequestException('Employee not found');
  //     }

  //     deleteEmp.deletedAt = new Date();

  //     const deleteEmployee = await this.employeeRepository.save(deleteEmp);
  //     return {
  //       message: 'Employee Deleted Succesfully',
  //       data: deleteEmployee,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
