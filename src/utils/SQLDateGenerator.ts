export class SQLDateGenerator {
  private param: Date | string
  constructor(param?: Date | string) {
    this.param = param
  }
  private getYear() {
    return new Date(this.param).getFullYear()
  }
  private getMonth() {
    return new Date(this.param).getMonth()
  }

  private getDay() {
    return new Date(this.param).getDate()
  }

  private getHours() {
    return new Date(this.param).getHours()
  }

  private getMinutes() {
    return new Date(this.param).getMinutes()
  }

  private getSeconds() {
    return new Date(this.param).getSeconds()
  }

  private getTime() {
    return new Date(this.param).getTime()
  }

  timeNow() {
    this.param = new Date(Date.now())
    return this
  }

  private pad(param: string | number) {
    return param.toString().length > 1 ? param : '0' + param
  }
  getSQLDate(): string {
    // return new Date(this.param).slice(0, 19).replace('T', ' ')
    return `${this.getYear()}-${this.pad(this.getMonth())}-${this.pad(
      this.getDay(),
    )} ${this.pad(this.getHours())}:${this.pad(
      this.getMinutes(),
    )}:${this.getSeconds()}`
  }
  getSQLDateObject(): Date {
    return new Date(this.getSQLDate())
  }
}
