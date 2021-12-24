export class CreateAdminDto {
  
  username: string;
  password: string;

}

export class ResponseCreateAdminDto {

  errorCode: number;
  message: string;
}