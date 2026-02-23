import { Injectable } from '@nestjs/common';
import { CalculateBondYieldDto, CouponFrequency } from './dto/calculate-bond-yield.dto';

export interface CashFlowEntry {
  period: number;
  paymentDate: string;
  amount: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondCalculationResult {
  currentYield: number;
  ytm: number;
  totalInterest: number;
  indicator: 'Premium' | 'Discount' | 'Par';
  cashFlows: CashFlowEntry[];
}

@Injectable()
export class BondService {
  calculate(dto: CalculateBondYieldDto): BondCalculationResult {
    const { faceValue, couponRate, marketPrice, yearsToMaturity, frequency } = dto;
    const periodsPerYear = frequency === CouponFrequency.ANNUAL ? 1 : 2;
    const totalPeriods = yearsToMaturity * periodsPerYear;
    const couponPayment = (faceValue * (couponRate / 100)) / periodsPerYear;

    const currentYield = (faceValue * (couponRate / 100)) / marketPrice;

    const periodicYTM = this.calculateYTM(
      marketPrice,
      faceValue,
      couponPayment,
      totalPeriods,
    );
    const ytm = periodicYTM * periodsPerYear;

    const totalInterest = couponPayment * totalPeriods;

    let indicator: 'Premium' | 'Discount' | 'Par' = 'Par';
    if (marketPrice > faceValue) indicator = 'Premium';
    if (marketPrice < faceValue) indicator = 'Discount';

    const cashFlows = this.generateCashFlows(
      couponPayment,
      faceValue,
      totalPeriods,
      frequency,
    );

    return {
      currentYield: this.round(currentYield, 6),
      ytm: this.round(ytm, 6),
      totalInterest: this.round(totalInterest, 2),
      indicator,
      cashFlows,
    };
  }

  private round(value: number, decimals: number): number {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
  }

  private calculateYTM(
    price: number,
    faceValue: number,
    couponPayment: number,
    totalPeriods: number
  ): number {
    let y = 0.05; // Initial guess: 5%
    const maxIterations = 100;
    const tolerance = 1e-6;

    for (let i = 0; i < maxIterations; i++) {
      let pv = 0;
      let derivative = 0;

      for (let t = 1; t <= totalPeriods; t++) {
        pv += couponPayment / Math.pow(1 + y, t);
        derivative -= (t * couponPayment) / Math.pow(1 + y, t + 1);
      }
      pv += faceValue / Math.pow(1 + y, totalPeriods);
      derivative -= (totalPeriods * faceValue) / Math.pow(1 + y, totalPeriods + 1);

      const diff = pv - price;
      if (Math.abs(diff) < tolerance) {
        return y;
      }

      y = y - diff / derivative;
    }

    return y; // Return best estimate if not converged
  }

  private generateCashFlows(
    couponPayment: number,
    faceValue: number,
    totalPeriods: number,
    frequency: CouponFrequency,
  ): CashFlowEntry[] {
    const cashFlows: CashFlowEntry[] = [];
    let cumulativeInterest = 0;
    const today = new Date();
    const monthsToAdd = frequency === CouponFrequency.ANNUAL ? 12 : 6;

    for (let i = 1; i <= totalPeriods; i++) {
      cumulativeInterest += couponPayment;
      const paymentDate = new Date(today);
      paymentDate.setMonth(today.getMonth() + i * monthsToAdd);

      cashFlows.push({
        period: i,
        paymentDate: paymentDate.toISOString().split('T')[0],
        amount: this.round(couponPayment, 2),
        cumulativeInterest: this.round(cumulativeInterest, 2),
        remainingPrincipal: i === totalPeriods ? 0 : faceValue,
      });
    }

    return cashFlows;
  }
}
