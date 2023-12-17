import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const status = {
  inProgress: '1',
  Complete: '2',
  Overdue: '3',
};

export const taskFormat = {
  Today: '1',
  Yesterday: '2',
  Week: '3',
  Month: '4',
  AllTime: '5',
};

export const formatHandlers = {
  '1': 'taskListToday',
  '2': 'taskListYesterday',
  '3': 'taskListWeek',
  '4': 'taskListMonth',
};

export const CLOCK = {
  NOT_MARKED: '0',
  IN: '1',
  OUT: '2',
};

export const HRM = {
  // BUCKET: configService.get<string>('AWS_BUCKET'),
  BUCKET: 'hrm-onpoint-test',
};

export const LIMIT_VALUE = {
  FIVE: 5,
  SEVEN: 7,
  MONTH: 30,
};
