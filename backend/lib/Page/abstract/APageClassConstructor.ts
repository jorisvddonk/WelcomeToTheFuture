import { APageClass } from "./APageClass";
export interface APageClassConstructor<T> {
  new(): APageClass<T>;
}
