export class LoginDto {
  username: string;
  password: string;
}

export class ResponseLoginDto {
  errorCode: number;
  message: string;
  accessToken: string;
}
