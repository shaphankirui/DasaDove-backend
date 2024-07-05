import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    console.log({
      dto,
    });
    return this.authService.signUp(dto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() dto: AuthDto) {
    console.log('Request payload:', dto);
    return this.authService.signin(dto);
  }
  @Get()
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(Number(id));
  }
}
