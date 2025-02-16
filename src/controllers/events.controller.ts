import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from '@services/index';
import { events } from '@models/index';

@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async GET() {
    return await this.eventsService.get();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async POST(
    @Body()
    payload: Omit<typeof events.$inferSelect, 'id' | 'userId'>,
    @Request() { user },
  ) {
    if (!payload)
      throw new HttpException('Payload not sended', HttpStatus.BAD_REQUEST);
    return await this.eventsService.post({
      ...payload,
      userId: (user as { id: number }).id,
    });
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async PUT(@Query() id: number, @Body() payload: typeof events.$inferSelect) {
    return await this.eventsService.put(payload);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async DELETE(@Query('id') id: string) {
    return await this.eventsService.delete(id);
  }
}
