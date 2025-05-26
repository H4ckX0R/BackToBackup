import { Request } from 'express';
import { UserDto } from './main/database/models/dto/user.dto';

export type LoginRequestWithUser = {
  user: UserDto;
} & Omit<Request, 'user'>;

export type LoggedInTokenPayload = {
  id: string;
  email: string;
};
export type LoggedInRequestWithUser = {
  user: LoggedInTokenPayload;
} & Omit<Request, 'user'>;

export type RefreshTokenPayload = {
  id: string;
};
export type RefreshRequestWithUser = {
  user: RefreshTokenPayload;
} & Omit<Request, 'user'>;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
