import { Controller, Post, Body } from '@nestjs/common';
import { BondService } from './bond.service';
import { CalculateBondYieldDto } from './dto/calculate-bond-yield.dto';

@Controller('bond')
export class BondController {
  constructor(private readonly bondService: BondService) {}

  @Post('calculate')
  calculate(@Body() calculateBondYieldDto: CalculateBondYieldDto) {
    return this.bondService.calculate(calculateBondYieldDto);
  }
}
