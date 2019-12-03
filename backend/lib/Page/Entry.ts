import { ClassType, ObjectType, Field } from "type-graphql";
import { AEntryClassConstructor } from "./abstract/AEntryClassConstructor";
import { AEntryClass } from "./abstract/AEntryClass";
export function Entry<TItem>(TItemClass: ClassType<TItem>): AEntryClassConstructor<TItem> {
  @ObjectType({ isAbstract: true })
  class EntryClass extends AEntryClass<TItem> {
    @Field(type => TItemClass)
    node: TItem;
    @Field(type => String)
    cursor: string;
  }
  return EntryClass;
}
