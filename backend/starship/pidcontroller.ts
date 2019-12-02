export class PIDController {
  public kP: any
  public kI: any
  public kD: any
  public minIntegral: any
  public minCapIntegral: any
  public error: any
  public previousError: any
  public integralError: any
  public derivativeError: any
  public maxCapIntegral: any
  public maxIntegral: any
  public last: { mP: number; mI: number; mD: number }
  public retError: number

  constructor(
    kp,
    ki,
    kd,
    minIntegral?,
    maxIntegral?,
    minCapIntegral?,
    maxCapIntegral?
  ) {
    this.kP = kp // -0.7;
    this.kI = ki // -0.01;
    this.kD = kd // -0.3;
    this.minIntegral = minIntegral
    this.minIntegral = maxIntegral
    this.minCapIntegral = minCapIntegral
    this.maxCapIntegral = maxCapIntegral

    this.error = null
    this.previousError = null
    this.integralError = null
    this.derivativeError = null

    this.retError = null
  }

  public update(current, target) {
    this.error = target - current
  }

  public step() {
    if (this.previousError === null) {
      this.previousError = this.error
    }
    this.derivativeError = this.error - this.previousError
    this.integralError = this.integralError + this.error

    if (
      this.minCapIntegral !== undefined &&
      this.minCapIntegral !== null &&
      this.integralError < this.minCapIntegral
    ) {
      this.integralError = this.minCapIntegral
    }
    if (
      this.maxCapIntegral !== undefined &&
      this.maxCapIntegral !== null &&
      this.integralError > this.maxCapIntegral
    ) {
      this.integralError = this.maxCapIntegral
    }

    const mP = this.error * this.kP
    let mI = this.integralError * this.kI
    const mD = this.derivativeError * this.kD

    if (
      this.minIntegral !== undefined &&
      this.minIntegral !== null &&
      mI < this.minIntegral
    ) {
      mI = this.minIntegral
    }
    if (
      this.maxIntegral !== undefined &&
      this.maxIntegral !== null &&
      mI > this.maxIntegral
    ) {
      mI = this.maxIntegral
    }

    this.last = {
      mP,
      mI,
      mD,
    }

    this.previousError = this.error
    this.retError = mP + mI + mD
    return this.retError
  }

  public getError() {
    return this.retError
  }

  public reset() {
    this.integralError = 0
  }
}

export default PIDController
