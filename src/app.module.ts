import { Module } from '@nestjs/common/decorators';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '@mail';
import { HelpersModule } from '@helpers';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DatabaseModule } from '@database';
import { JwtAuthModule } from '@jwt_auth';
import { ClientController } from './client/client.controller';
import { ClientService } from './client/client.service';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { PunchingController } from './punching/punching.controller';
import { PunchingService } from './punching/punching.service';
import { EmployeeController } from './auth/employee.controller';
import { EmployeeService } from './auth/employee.service';
import { PublicModule } from './public/public.module';
import { NewToDoController } from './ToDo/todo.controller';
import { NewToDoService } from './ToDo/todo.service';
import { TimeSheetController } from './timesheet/timesheet.controller';
import { TimesheetService } from './timesheet/timesheet.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MailModule,
    HelpersModule,
    JwtAuthModule,
    PublicModule,
  ],
  controllers: [
    AuthController,
    ClientController,
    ProjectController,
    PunchingController,
    EmployeeController,

    NewToDoController,
    TimeSheetController,
    NewToDoController,
  ],

  providers: [
    AuthService,
    ClientService,
    ProjectService,
    PunchingService,
    EmployeeService,

    NewToDoService,
    TimesheetService,
  ],
})
export class AppModule {}
