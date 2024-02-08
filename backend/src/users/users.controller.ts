import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrLoginUserDto } from './dto/create.users.dto';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginOrCreate(
    @Body() createDto: CreateOrLoginUserDto,
    @Request() request,
  ): Promise<UserDto> {
    return this.authService.setJwt(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUser(@Request() req) {
    return this.userService.find(req.user.username);
  }
}
