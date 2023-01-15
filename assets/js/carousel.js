function Carousel(
  containerID = "#carousel",
  slideID = ".slide",
  interval = 5000
) {
  this.container = document.querySelector(containerID);
  this.slides = this.container.querySelectorAll(slideID);
  this.interval = interval;
}

Carousel.prototype = {
  _initProps() {
    this.currentSlide = 0;
    this.isPlaying = true;

    this.SLIDES_COUNT = this.slides.length;
    this.CODE_LEFT_ARROW = "ArrowLeft";
    this.CODE_RIGHT_ARROW = "ArrowRight";
    this.CODE_SPACE = "Space";
    this.FA_PAUSE = '<i class="fas fa-pause-circle"></i>';
    this.FA_PLAY = '<i class="fas fa-play-circle"></i>';
    this.FA_PREV = '<i class="fas fa-angle-left"></i>';
    this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
  },

  _initControls() {
    const controls = document.createElement("div");
    const PAUSE = `<div class="control control-pause" id="btn-pause">${this.FA_PAUSE}</div>`;
    const PREV = `<div class="control control-prev" id="btn-prev">${this.FA_PREV}</div>`;
    const NEXT = `<div class="control control-next" id="btn-next">${this.FA_NEXT}</div>`;
    controls.setAttribute("class", "controls");

    controls.innerHTML = PAUSE + PREV + NEXT;

    this.container.append(controls);

    this.pauseBtn = this.container.querySelector("#btn-pause");
    this.prevBtn = this.container.querySelector("#btn-prev");
    this.nextBtn = this.container.querySelector("#btn-next");
  },

  _initIndicators() {
    const indicators = document.createElement("div");

    for (let i = 0; i < this.SLIDES_COUNT; i++) {
      const indicator = document.createElement("div");

      indicator.setAttribute(
        "class",
        i !== 0 ? "indicator" : "indicator active"
      );
      indicator.dataset.slideTo = `${i}`;
      indicators.append(indicator);
    }

    indicators.setAttribute("class", "indicators");

    this.container.append(indicators);

    this.indicatorsContainer = this.container.querySelector(".indicators");
    this.indicators = this.indicatorsContainer.querySelectorAll(".indicator");
  },

  _initListeners() {
    this.pauseBtn.addEventListener("click", this.pausePlay.bind(this));
    this.prevBtn.addEventListener("click", this.prev.bind(this));
    this.nextBtn.addEventListener("click", this.next.bind(this));
    this.indicatorsContainer.addEventListener(
      "click",
      this._indicate.bind(this)
    );
    document.addEventListener("keydown", this._pressKey.bind(this));
  },

  _gotoNth(n) {
    this.slides[this.currentSlide].classList.toggle("active");
    this.indicators[this.currentSlide].classList.toggle("active");
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
    this.indicators[this.currentSlide].classList.toggle("active");
    this.slides[this.currentSlide].classList.toggle("active");
  },

  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1);
  },

  _gotoNext() {
    this._gotoNth(this.currentSlide + 1);
  },

  pause() {
    this.pauseBtn.innerHTML = this.FA_PLAY;
    this.isPlaying = false;
    clearInterval(this.timerID);
  },

  _indicate(e) {
    const target = e.target;

    if (target && target.classList.contains("indicator")) {
      this.pause();
      this._gotoNth(+target.dataset.slideTo);
    }
  },

  _pressKey(e) {
    if (e.code === this.CODE_LEFT_ARROW) this.prev();
    if (e.code === this.CODE_RIGHT_ARROW) this.next();
    if (e.code === this.CODE_SPACE) this.pausePlay();
  },

  _swipeStart(e) {
    if (e instanceof MouseEvent) {
      this.startPosX = e.pageX;

      return;
    }

    if (e instanceof TouchEvent) {
      this.endPosX = e.changedTouches[0].pageX;
    }
  },

  _swipeEnd(e) {
    if (e instanceof MouseEvent) {
      this.endPosX = e.pageX;
    } else if (e instanceof TouchEvent) {
      this.startPosX = e.changedTouches[0].pageX;
    }

    if (this.endPosX - this.startPosX < -100) this.next();
    if (this.endPosX - this.startPosX > 100) this.prev();
  },

  play() {
    this.pauseBtn.innerHTML = this.FA_PAUSE;
    this.isPlaying = true;
    this.timerID = setInterval(this._gotoNext.bind(this), this.interval);
  },

  pausePlay() {
    this.isPlaying ? this.pause() : this.play();
  },

  prev() {
    this._gotoPrev();
    this.pause();
  },

  next() {
    this._gotoNext();
    this.pause();
  },

  init() {
    this._initProps();
    this._initControls();
    this._initIndicators();
    this._initListeners();
    this.timerID = setInterval(() => this._gotoNext(), this.interval);
  },
};

Carousel.prototype.constructor = Carousel;

const slider = new Carousel();

slider.init();
