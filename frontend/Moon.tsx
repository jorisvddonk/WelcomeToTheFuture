import Planet from "./Planet";

export default class Moon extends Planet {
  getClassName() {
    return ["moon", `moon-${this.props.name}`, `moonType-${this.props.type}`].join(" ");
  }
}
