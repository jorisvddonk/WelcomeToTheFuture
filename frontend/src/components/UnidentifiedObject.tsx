import Sprite from "./Sprite";

export interface IUnidentifiedObjectProps {
  scannerData: string;
  angle: number;
}

export default class UnidentifiedObject extends Sprite<IUnidentifiedObjectProps> {
  constructor(props) {
    super(props);
  }

  getClassName() {
    return ["unidentifiedObject", `unidentifiedObject-${atob(this.props.scannerData)}`].join(" ");
  }

  getSpriteWidth() {
    switch (atob(this.props.scannerData)) {
      case "enemyShip":
        return 106
      case "spaceStation":
        return 138;
      default:
        return 100;
    }
  }

  getSpriteHeight() {
    switch (atob(this.props.scannerData)) {
      case "enemyShip":
        return 80;
      case "spaceStation":
        return 200;
      default:
        return 100;
    }
  }

  getAngle() {
    return this.props.angle;
  }
}
