# Cheat sheet

All of the queries listed here are fully executable, except when there is a `###` in the query; treat `###` as ellipsis and fill in an actual (sub)query there.

## Simplest query

```graphql
query {
  hello
}
```

## Starship query

```graphql
query {
  starship {
    name
  }
}
```

## Comments

```graphql
query {
  starship {
    # This is a comment!
    name
  }
}
```

## Single query, multiple selects

```graphql
query {
  starship {
    name
  }
  inbox {
    title
  }
}
```

## Named query

```graphql
query GetStarship {
  starship {
    name
  }
}
```

## Query parameters

```graphql
query {
  currentStar {
    planets(type: "Water") {
      name
    }
  }
}
```

## Query parameters; input types (complex nested object)

```graphql
query {
  inbox(filter: { isRead: false }) {
    title
  }
}
```

## Aliases

```graphql
query {
  readMessages: inbox(filter: { isRead: true }) {
    title
  }

  unreadMessages: inbox(filter: { isRead: false }) {
    title
  }
}
```

## Mutation

```graphql
mutation {
  markAllAsRead
}
```


```graphql
mutation {
  markAsRead(id: "TWVzc2FnZV8x") {
    title
    isRead
  }
}
```

## Subscription

```graphql
subscription {
  # Triggered whenever you jump to another star via `hyperspaceJump` mutation
  currentStar {
    name
  }
}
```

## Query variables

query:
```graphql
query ($take:Int, $cursor:String, $search:String) {
  stars(take:$take, cursor:$cursor, nameSearch:$search) {
    ###
  }
}
```

variables:
```json
{
  "take": 5,
  "search": "Pavonis"
}
```

## Query variables with default

query:
```graphql
query ($take:Int = 5, $cursor:String, $search:String) {
  stars(take:$take, cursor:$cursor, nameSearch:$search) {
    ###
  }
}
```

variables:
```json
{}
```

## Directives

query:
```graphql
query(
  $includePageInfo: Boolean!
  $includeCollectionInfo: Boolean!
  $includeCursors: Boolean!
) {
  stars {
    entries {
      cursor @include(if: $includeCursors)
    }
    pageInfo @include(if: $includePageInfo) {
      count
      endCursor @include(if: $includeCursors)
    }
    collectionInfo @include(if: $includeCollectionInfo) {
      count
    }
  }
}
```

variables:
```json
{
  "includeCollectionInfo": true,
  "includePageInfo": true,
  "includeCursors": false
}
```

## Discriminating on union types using inline fragments

```graphql
query {
  currentStar {
    objects {
      __typename
      
      ... on Planet {
        name
        type
      }
      
      ... on Moon {
        name
        gravity
        planet {
          name
        }
      }
    }
  }
}
```

## Discriminating on interfaces

```graphql
query {
  currentStar {
    objects {
      __typename

      ... on Locatable {
        position {
          x
          y
        }
      }
    }
  }
}
```

## Fragments

```graphql
query {
  currentStar {
    objects {
      __typename

      ... on Locatable {
        ...location
      }
    }
  }
}

fragment location on Locatable {
  position {
    x
    y
  }
}
```

## Fragments in fragments

```graphql
query {
  currentStar {
    objects {
      __typename

      ... on Body {
        ...bodyInfo
      }
    }
  }
}

fragment location on Locatable {
  position {
    x
    y
  }
}

fragment bodyInfo on Body {
  name
  type
  length_of_day
  ...location
}
```

## Schema introspection

```graphql
query {
  __schema {
    types {
      name
      fields {
        name
      }
    }
  }
}
```