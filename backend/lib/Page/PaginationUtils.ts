import { PageFilter } from "./PageFilter";
import { from } from "rxjs";
import { skipWhile, skip, take, toArray } from "rxjs/operators";
import { APageClass } from "./abstract/APageClass";

/**
 * @param items Items to create a page for
 * @param filter PageFilter object
 * @param keySelector Function that returns a unique (!) ket for an item.
 */
export async function GeneratePage<T>(items: T[], filter: PageFilter, keySelector: (item: T) => string | number): Promise<APageClass<T>> {
  // NOTE: keySelector has to return a unique value for each item in the list!!

  const allEntries = items.map(item => {
    return {
      node: item,
      cursor: Buffer.from('' + keySelector(item)).toString('base64')
    }
  });

  let observableEntries = from(allEntries);

  if (filter.cursor !== null && filter.cursor !== undefined) {
    observableEntries = observableEntries.pipe(skipWhile(entry => entry.cursor !== filter.cursor)).pipe(skip(1));
  }
  if (filter.take !== null && filter.take !== undefined) {
    observableEntries = observableEntries.pipe(take(filter.take));
  }

  return new Promise<APageClass<T>>((resolve, reject) => {
    observableEntries.pipe(toArray()).subscribe(entries => {
      const startCursor = entries.length > 0 ? entries[0].cursor : null;
      const endCursor = entries.length > 0 ? entries[entries.length - 1].cursor : null;
      const allEntriesEndCursor = allEntries.length > 0 ? allEntries[allEntries.length - 1].cursor : null
      const returnval: APageClass<T> = {
        entries: entries,
        pageInfo: {
          hasMore: endCursor !== null && allEntriesEndCursor !== endCursor,
          startCursor,
          endCursor,
          count: entries.length
        },
        collectionInfo: {
          count: items.length
        }
      };
      resolve(returnval);
    });

  });


}

