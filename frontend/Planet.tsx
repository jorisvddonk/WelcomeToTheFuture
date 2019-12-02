import Sprite from "./Sprite";

export interface IPlanetProps {
  diameter: number;
  type: string;
}

export default class Planet extends Sprite<IPlanetProps> {
  constructor(props) {
    super(props);
  }

  getClassName() {
    return ["planet", `planet-${this.props.name}`, `planetType-${this.props.type.replace(/\s/g, '-')}`].join(" ");
  }

  getSpriteWidth() {
    return 100 * this.props.diameter;
  }

  getSpriteHeight() {
    return 100 * this.props.diameter;
  }

  getAngle() {
    return 0;
  }
}
