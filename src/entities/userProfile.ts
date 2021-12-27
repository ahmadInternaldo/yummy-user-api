import { AllowNull, Column, DataType, Length, Table } from 'sequelize-typescript';
import BaseModel, { UserType } from './baseModel';

@Table({ tableName: 'userProfiles' })
export class UserProfile extends BaseModel {
  @AllowNull(false)
  @Length({ max: 50, min: 6 })
  @Column(DataType.STRING)
  username: string;

  @AllowNull(false)
  @Column
  hash: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  jwtToken: string;

  @AllowNull(false)
  @Column
  userType: UserType;

}
