import * as Sylvester from 'sylvester-es6'

Sylvester.Vector.prototype.getUx = function () {
  return this.elements[0]
}
Sylvester.Vector.prototype.getUy = function () {
  return this.elements[1]
}
Sylvester.Vector.prototype.angleTo = function (vector) {
  let sign =
    this.elements[0] * vector.elements[1] -
    this.elements[1] * vector.elements[0] // Based on cross product implementation and http://stackoverflow.com/questions/2663570/how-to-calculate-both-positive-and-negative-angle-between-two-lines
  let anglefrom = Math.abs(this.angleFrom(vector))
  if (anglefrom > Math.PI) {
    anglefrom = anglefrom - Math.PI
  }
  if (sign < 0) {
    sign = -1
  }
  if (sign >= 0) {
    sign = 1
  }
  return sign * anglefrom
}

export default Sylvester
