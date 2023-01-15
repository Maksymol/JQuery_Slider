function SwipeCarousel() {
  Carousel.apply(this, arguments);
  this.slidesContainer = this.container.querySelector(".slides");
}

SwipeCarousel.prototype = Object.create(Carousel.prototype);
SwipeCarousel.prototype.constructor = SwipeCarousel;

SwipeCarousel.prototype._initListeners = function () {
  Carousel.prototype._initListeners.apply(this);
  this.container.addEventListener("touchstart", this._swipeStart.bind(this));
  this.container.addEventListener("mousedown", this._swipeStart.bind(this));
  this.container.addEventListener("touchend", this._swipeEnd.bind(this));
  this.container.addEventListener("mouseup", this._swipeEnd.bind(this));
};

SwipeCarousel.prototype._swipeStart = function (e) {
  if (e instanceof MouseEvent) {
    this.startPosX = e.pageX;

    return;
  }

  if (e instanceof TouchEvent) {
    this.endPosX = e.changedTouches[0].pageX;
  }
};

SwipeCarousel.prototype._swipeEnd = function (e) {
  if (e instanceof MouseEvent) {
    this.endPosX = e.pageX;
  } else if (e instanceof TouchEvent) {
    this.startPosX = e.changedTouches[0].pageX;
  }

  if (this.endPosX - this.startPosX < -100) this.next();
  if (this.endPosX - this.startPosX > 100) this.prev();
};
