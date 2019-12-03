import { AEntryClass } from "./AEntryClass";
export interface AEntryClassConstructor<T> {
  new(): AEntryClass<T>;
}
