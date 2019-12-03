import { ClassType, ObjectType, Field, Int } from "type-graphql";
import { APageClass } from "./abstract/APageClass";
import { APageClassConstructor } from "./abstract/APageClassConstructor";
import { AEntry } from "./abstract/AEntry";
import { PageInfo } from "./PageInfo";
import { CollectionInfo } from "./CollectionInfo";

export function Page<TItem>(TItemClass: ClassType<TItem>, TItemEntryClass: ClassType<AEntry<TItem>>): APageClassConstructor<TItem> {
  @ObjectType({ isAbstract: true })
  class PaginatedResponseClass extends APageClass<TItem> {
    @Field(type => [TItemEntryClass])
    entries: AEntry<TItem>[];

    @Field(type => PageInfo)
    pageInfo: PageInfo;

    @Field(type => CollectionInfo)
    collectionInfo: CollectionInfo;
  }
  return PaginatedResponseClass;
}

