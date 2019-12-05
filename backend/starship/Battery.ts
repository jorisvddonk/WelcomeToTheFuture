export class Battery {
  private currentPower: number;
  public maxPower: number;
  private rechargePerSecond: number;
  constructor(maxPower, rechargePerSecond) {
    this.maxPower = maxPower;
    this.currentPower = maxPower;
    this.rechargePerSecond = rechargePerSecond;
  }

  tick(msec: number) {
    this.currentPower += this.rechargePerSecond * (msec / 1000);
    if (this.currentPower > this.maxPower) {
      this.currentPower = this.maxPower;
    }
  }

  public activate(power: number): boolean {
    if (this.canActivate(power)) {
      this.currentPower -= power;
      return true;
    }
    return false;
  }

  public canActivate(power: number): boolean {
    if (this.currentPower - power > 0) {
      return true;
    } else {
      return false;
    }
  }

  public get power() {
    return this.currentPower;
  }
}
