Date.prototype.addSeconds = function (h) {
  this.setTime(this.getTime() + (h * 1000));
  return this;
};
