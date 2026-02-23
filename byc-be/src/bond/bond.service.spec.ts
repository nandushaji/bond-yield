import { Test, TestingModule } from '@nestjs/testing';
import { BondService } from './bond.service';
import { CouponFrequency } from './dto/calculate-bond-yield.dto';

describe('BondService', () => {
  let service: BondService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BondService],
    }).compile();

    service = module.get<BondService>(BondService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculate - annual frequency', () => {
    it('should calculate correctly for a par bond', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 10,
        frequency: CouponFrequency.ANNUAL,
      });

      expect(result.currentYield).toBeCloseTo(0.05);
      expect(result.ytm).toBeCloseTo(0.05);
      expect(result.indicator).toBe('Par');
      expect(result.totalInterest).toBe(500);
      expect(result.cashFlows).toHaveLength(10);
    });

    it('should calculate correctly for a discount bond', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 900,
        yearsToMaturity: 10,
        frequency: CouponFrequency.ANNUAL,
      });

      expect(result.currentYield).toBeCloseTo(0.0556, 4);
      expect(result.ytm).toBeGreaterThan(0.05);
      expect(result.indicator).toBe('Discount');
    });

    it('should calculate correctly for a premium bond', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1100,
        yearsToMaturity: 10,
        frequency: CouponFrequency.ANNUAL,
      });

      expect(result.currentYield).toBeCloseTo(0.0455, 4);
      expect(result.ytm).toBeLessThan(0.05);
      expect(result.indicator).toBe('Premium');
    });
  });

  describe('calculate - semi-annual frequency', () => {
    it('should produce 2x periods for semi-annual bonds', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 6,
        marketPrice: 1000,
        yearsToMaturity: 5,
        frequency: CouponFrequency.SEMI_ANNUAL,
      });

      expect(result.cashFlows).toHaveLength(10);
      expect(result.cashFlows[0].amount).toBe(30);
      expect(result.totalInterest).toBe(300);
      expect(result.indicator).toBe('Par');
    });

    it('should calculate YTM correctly for a semi-annual discount bond', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 6,
        marketPrice: 950,
        yearsToMaturity: 5,
        frequency: CouponFrequency.SEMI_ANNUAL,
      });

      expect(result.ytm).toBeGreaterThan(0.06);
      expect(result.indicator).toBe('Discount');
    });
  });

  describe('cash flow schedule', () => {
    it('should have correct cumulative interest progression', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 3,
        frequency: CouponFrequency.ANNUAL,
      });

      expect(result.cashFlows).toHaveLength(3);
      expect(result.cashFlows[0].cumulativeInterest).toBe(50);
      expect(result.cashFlows[1].cumulativeInterest).toBe(100);
      expect(result.cashFlows[2].cumulativeInterest).toBe(150);
    });

    it('should show remaining principal as face value until final period', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 3,
        frequency: CouponFrequency.ANNUAL,
      });

      expect(result.cashFlows[0].remainingPrincipal).toBe(1000);
      expect(result.cashFlows[1].remainingPrincipal).toBe(1000);
      expect(result.cashFlows[2].remainingPrincipal).toBe(0);
    });

    it('should generate ISO date strings for payment dates', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 2,
        frequency: CouponFrequency.ANNUAL,
      });

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      result.cashFlows.forEach((flow) => {
        expect(flow.paymentDate).toMatch(dateRegex);
      });
    });
  });

  describe('zero coupon bond edge case', () => {
    it('should handle zero coupon rate', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 0,
        marketPrice: 800,
        yearsToMaturity: 5,
        frequency: CouponFrequency.ANNUAL,
      });

      expect(result.currentYield).toBe(0);
      expect(result.totalInterest).toBe(0);
      expect(result.ytm).toBeGreaterThan(0);
      expect(result.indicator).toBe('Discount');
      expect(result.cashFlows[0].amount).toBe(0);
    });
  });
});
