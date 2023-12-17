import { PunchingEntity } from '@database/entities/punching.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not } from 'typeorm';

export class PunchingRepository extends Repository<PunchingEntity> {
  constructor(
    @InjectRepository(PunchingEntity)
    private punchingRepository: Repository<PunchingEntity>,
  ) {
    super(
      punchingRepository.target,
      punchingRepository.manager,
      punchingRepository.queryRunner,
    );
  }
  async findById(Emp_id: string, date: string): Promise<PunchingEntity> {
    return await this.punchingRepository.findOne({
      where: { Emp_id, Entry_Date: date },
    });
  }

  // async findByDate(Emp_id: string , ToDo_Date:string): Promise<PunchingEntity> {
  //   // return await this.punchingRepository.findOneBy({ ToDo_Date },);
  // }

  async hasPunchedIn(Emp_id: string): Promise<boolean> {
    const punchInRecord = await this.punchingRepository.findOne({
      where: { Emp_id, Punch_Out: null },
    });
    return !!punchInRecord;
  }

  async newPunchedIn(currentdate: string, status: string): Promise<boolean> {
    const punchInRecord = await this.punchingRepository.findOne({
      where: { Entry_Date: currentdate, Entry_Status: status },
    });
    return !!punchInRecord;
  }
  async hasPunchedOut(Emp_id: string): Promise<boolean> {
    const punchInRecord = await this.punchingRepository.findOne({
      where: { Emp_id, Punch_Out: IsNull() },
    });
    return !punchInRecord;
  }

  async getToday(emp_id: string, today: string) {
    return this.punchingRepository.find({
      where: {
        Emp_id: emp_id,
        Entry_Date: today,
      },
    });
  }

  async getRecentClocks(emp_id: string) {
    return this.punchingRepository.find({
      select: ['Entry_Date', 'Total_hours'],
      where: {
        Emp_id: emp_id,
      },
      order: {
        Entry_Date: 'DESC',
      },
    });
  }

  async findPuncStatus(emp_id: string, TodayDate: string) {
    return await this.punchingRepository.find({
      where: {
        Emp_id: emp_id,
        Entry_Date: TodayDate,
      },
    });
  }

  async getBetweenDates(
    emp_id: string,
    StartDate: string,
    Present_date: string,
  ) {
    return await this.punchingRepository.find({
      where: {
        Emp_id: emp_id,
        Entry_Date: Between(StartDate, Present_date),
      },
    });
  }

  async getDistinctDates(emp_id, limitvalue) {
    const distinctDatesQuery = await this.punchingRepository
      .createQueryBuilder('punching')
      .select('DISTINCT DATE(punching.entry_date)', 'entry_date')
      .addSelect('punching.entry_date')
      .where('punching.emp_id = :empId', { empId: emp_id })
      .orderBy('punching.entry_date', 'DESC')
      .limit(limitvalue)
      .getRawMany();

    return distinctDatesQuery;
  }
}
