import { IsNumber, IsEnum, Min, Max } from 'class-validator';

export enum CouponFrequency {
  ANNUAL = 'annual',
  SEMI_ANNUAL = 'semi-annual',
}

export class CalculateBondYieldDto {
  @IsNumber()
  @Min(0.01, { message: 'Face value must be greater than 0' })
  faceValue: number;

  @IsNumber()
  @Min(0, { message: 'Coupon rate cannot be negative' })
  @Max(100, { message: 'Coupon rate cannot exceed 100%' })
  couponRate: number;

  @IsNumber()
  @Min(0.01, { message: 'Market price must be greater than 0' })
  marketPrice: number;

  @IsNumber()
  @Min(1, { message: 'Years to maturity must be at least 1' })
  @Max(100, { message: 'Years to maturity cannot exceed 100' })
  yearsToMaturity: number;

  @IsEnum(CouponFrequency)
  frequency: CouponFrequency;
}
