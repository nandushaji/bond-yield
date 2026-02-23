export const CouponFrequency = {
  ANNUAL: 'annual',
  SEMI_ANNUAL: 'semi-annual',
} as const;

export type CouponFrequency = typeof CouponFrequency[keyof typeof CouponFrequency];

export interface BondInputs {
  faceValue: number;
  couponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  frequency: CouponFrequency;
}

export interface CashFlow {
  period: number;
  paymentDate: string;
  amount: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondResults {
  currentYield: number;
  ytm: number;
  totalInterest: number;
  indicator: 'Premium' | 'Discount' | 'Par';
  cashFlows: CashFlow[];
}
