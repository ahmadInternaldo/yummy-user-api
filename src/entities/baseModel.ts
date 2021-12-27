import { BeforeCreate, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { v4 as uuid } from 'uuid';

@Table
export default abstract class BaseModel extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id: string;

  @Column
  createdBy: string;

  @CreatedAt
  createdDate: Date;

  @Column
  modifiedBy: string;

  @UpdatedAt
  modifiedDate: Date;

  @BeforeCreate
  static generate(column: BaseModel) {
    column.id = uuid();
  }
}

export enum UserType {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}