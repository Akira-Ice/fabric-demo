class Canvas {

  constructor() {
    this.a = 1;
  }
  t(){
    console.log(1);
  }
}

class Pen extends Canvas {
  constructor() {
    super();
  }
}