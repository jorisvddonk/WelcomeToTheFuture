# Walkthrough

```graphql
query {
  hello
}
```

```graphql
query {
  starship {
    name
  }
}
```


```graphql
query {
  inbox {
    from
    title
    body
    id
  }
}
```


```graphql
mutation {
  markAllAsRead
}
```


```graphql
mutation {
  setDesiredAngle(angle:90) {
    timestamp
    message
  }
}
```


```graphql
mutation {
  setThrust(thrust:1) {
    timestamp
    message
  }
}
```


```graphql
mutation {
  halt {
    timestamp
    message
  }
}
```


```graphql
mutation {
  moveTo(planet:"Earth") {
    status
    message
  }
}
```


```graphql
query {
  inbox(filter: { isRead: false }) {
    from
    title
    body
  }
}
```


```graphql
mutation {
  markAllAsRead
}
```


```graphql
query {
  currentStar {
    name
    planets {
      name
      type
      hazards {
        bio
        thermal
        weather
        tectonics
      }
      moons {
        name
      }
    }
  }
}
```


```graphql
query {
  currentStar {
    nearbyStars(maxRange:50) {
      name
      hyperspaceRange
    }
  }
}
```


```graphql
mutation {
  hyperspaceJump(star:"Sirius") {
    status
    message
    timestamp
  }
}
```


```graphql
query {
  inbox(filter: { isRead: false }) {
    from
    title
    body
  }
}
```


```graphql
mutation {
  markAllAsRead
}
```


```graphql
query {
  stars {
    entries {
      node {
        name
      }
    }
    pageInfo {
      count
      hasMore
    }
    collectionInfo {
      count
    }
  }
}
```


```graphql
query {
  stars(nameSearch:"Beta Giclas") {
    entries {
      node {
        name
        hyperspaceRange
        planets(type:"Water") {
          name
          type
          length_of_day
          hazards {
            bio
            thermal
            weather
            tectonics
          }
        }
      }
    }
    pageInfo {
      count
      hasMore
    }
    collectionInfo {
      count
    }
  }
}
```


```graphql
mutation {
  hyperspaceJump(star:"Beta Giclas") {
    status
    message
    timestamp
  }
}
```


```graphql
query {
  inbox(filter: { isRead: false }) {
    from
    isRead
    title
    body
  }
}
```


```graphql
query {
  inbox(filter: { isRead: false }) {
    from
    isRead
    title(translate:ENGLISH)
    body(translate:ENGLISH)
  }
}
```


```graphql
mutation {
  markAllAsRead
}
```

THIS WILL NOT WORK:
```graphql
query {
  stars {
    entries {
      node {
        name
        hyperspaceRange
        planets(type:"Water") {
          name
          type
          length_of_day
          hazards {
            bio
            thermal
            weather
            tectonics
          }
        }
      }
    }
    pageInfo {
      count
      hasMore
    }
    collectionInfo {
      count
    }
  }
}
```

take only 10:
```graphql
query {
  stars(take:10) {
    entries {
      node {
        name
        hyperspaceRange
        planets(type:"Water") {
          name
          type
          length_of_day
          hazards {
            bio
            thermal
            weather
            tectonics
          }
        }
      }
    }
    pageInfo {
      count
      endCursor
      hasMore
    }
    collectionInfo {
      count
    }
  }
}
```

cursor to keep paging:
```graphql
query {
  stars(take:10, cursor:"QWxwaGEgQXF1aWxhZQ==") {
    entries {
      node {
        name
        hyperspaceRange
        planets(type:"Water") {
          name
          type
          length_of_day
          hazards {
            bio
            thermal
            weather
            tectonics
          }
        }
      }
    }
    pageInfo {
      count
      endCursor
      hasMore
    }
    collectionInfo {
      count
    }
  }
}
```

make it simple (add variables):
```graphql
query($take: Int = 10, $cursor: String) {
  stars(take: $take, cursor: $cursor) {
    entries {
      node {
        name
        hyperspaceRange
        planets(type: "Water") {
          name
          type
          length_of_day
          hazards {
            bio
            thermal
            weather
            tectonics
          }
        }
      }
    }
    pageInfo {
      count
      endCursor
      hasMore
    }
    collectionInfo {
      count
    }
  }
}
```
variables:
```json
{
  "take": 50
}
```


...keep paging until you get the following variables:

```json
{
  "take": 50,
  "cursor": "QmV0YSBDZXJlbmtvdg=="
}
```

"Beta Equulei" looks interesting..

Let's gather more info, and simplify the query using a Fragment
```graphql
query($take: Int = 10, $cursor: String) {
  stars(take: $take, cursor: $cursor, nameSearch: "Beta Equulei") {
    entries {
      node {
        name
        hyperspaceRange
        planets(type: "Water") {
          name
          type
          length_of_day
          hazards {
            ...hzd
          }
        }
      }
    }
    pageInfo {
      count
      endCursor
      hasMore
    }
    collectionInfo {
      count
    }
  }
}

fragment hzd on Hazards {
  bio
  thermal
  weather
  tectonics
}
```
note: use empty variables:
```json
{}
```

get all objects instead:
```graphql
query($take: Int = 10, $cursor: String) {
  stars(take: $take, cursor: $cursor, nameSearch: "Beta Equulei") {
    entries {
      node {
        name
        hyperspaceRange
        objects {
          __typename
        }
      }
    }
    pageInfo {
      count
      endCursor
      hasMore
    }
    collectionInfo {
      count
    }
  }
}
```

get more info on these objects:
```graphql
query($take: Int = 10, $cursor: String) {
  stars(take: $take, cursor: $cursor, nameSearch: "Beta Equulei") {
    entries {
      node {
        name
        hyperspaceRange
        objects {
          __typename
          ... on Body {
            ...bodyInfo
            ...position
          }
          ... on UnidentifiedObject {
            scannerData
            ...position
          }
        }
      }
    }
    pageInfo {
      count
      endCursor
      hasMore
    }
    collectionInfo {
      count
    }
  }
}

fragment bodyInfo on Body {
  name
  type
  length_of_day
  ... on Planet {
    hazards {
      ...hzd
    }
  }
}

fragment hzd on Hazards {
  bio
  thermal
  weather
  tectonics
}

fragment position on Locatable {
  position {
    x
    y
  }
}
```
variables:
```json
{}
```

Looks good.. let's set up a subscription so we can track the star name where we are at.
```graphql
subscription {
  currentStar {
    name
  }
}
```

```graphql
mutation {
  hyperspaceJump(star:"Beta Equulei") {
    status
    message
    timestamp
  }
}
```

(the subscription should now have triggered...)


```graphql
mutation {
  moveTo(planet: "III") {
    status
    message
  }
}
```

and finally, wrap it up!
```graphql
mutation {
  land {
    status
    message
  }
}
```

That's it! Thanks for playing along!