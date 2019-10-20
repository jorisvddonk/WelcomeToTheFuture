import Sprite from "./Sprite";

export interface IStarProps {}

export default class Star extends Sprite<IStarProps> {
  constructor(props) {
    super(props);
  }

  getClassName() {
    return ["star", `star-${this.props.name}`].join(" ");
  }

  getSpriteWidth() {
    return 300;
  }

  getSpriteHeight() {
    return 300;
  }
}
