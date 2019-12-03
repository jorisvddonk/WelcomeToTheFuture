import { CollectionInfo } from "../CollectionInfo";
import { PageInfo } from "../PageInfo";
import { AEntry } from "./AEntry";
export class APageClass<T> {
  entries: AEntry<T>[];
  pageInfo: PageInfo;
  collectionInfo: CollectionInfo;
}
