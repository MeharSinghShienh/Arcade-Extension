class Boundary {
  static width = 40; // static variable values apply to all objects of the class and not a specific instance
  static height = 40;
  constructor({ position, image }) {
    this.position = position;
    this.width = 40;
    this.height = 40;
    this.image = image;
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}
