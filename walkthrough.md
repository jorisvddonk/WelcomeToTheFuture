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
  setDesiredAngle(angle: 90) {
    timestamp
    message
  }
}
```

```graphql
mutation {
  setThrust(thrust: 1) {
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
  moveTo(planet: "Earth") {
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
    nearbyStars(maxRange: 50) {
      name
      hyperspaceRange
    }
  }
}
```

```graphql
mutation {
  hyperspaceJump(star: "Sirius") {
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
  stars(nameSearch: "Beta Giclas") {
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
  hyperspaceJump(star: "Beta Giclas") {
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
    title(translate: ENGLISH)
    body(translate: ENGLISH)
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
  stars(take: 10) {
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

cursor to keep paging:

```graphql
query {
  stars(take: 10, cursor: "QWxwaGEgQXF1aWxhZQ==") {
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

...you can keep paging until you get the following variables:

```json
{
  "take": 50,
  "cursor": "QmV0YSBDZXJlbmtvdg=="
}
```

...but that is not really ideal. It'd be better if - instead of querying all stars and then getting a list of habitable planets there - we query all habitable planets and for each of those get the star it is orbiting around:

```graphql
query {
  planets(
    type: "Water"
    maxBio: LOW
    maxThermal: LOW
    maxWeather: LOW
    maxTectonics: LOW
  ) {
    entries {
      node {
        name
        star {
          name
        }
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
}
```

The planet orbiting "Beta Equulei" looks interesting..

Let's gather more info, and simplify the query using a Fragment

```graphql
query {
  planets(
    type: "Water"
    maxBio: LOW
    maxThermal: LOW
    maxWeather: LOW
    maxTectonics: LOW
  ) {
    entries {
      node {
        name
        type
        length_of_day
        hazards {
          ...hzd
        }
        star {
          name
          hyperspaceRange
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

get all objects around the star (to prevent a similar alien incident from happening):

```graphql
query {
  planets(
    type: "Water"
    maxBio: LOW
    maxThermal: LOW
    maxWeather: LOW
    maxTectonics: LOW
  ) {
    entries {
      node {
        name
        type
        length_of_day
        hazards {
          ...hzd
        }
        star {
          name
          hyperspaceRange
          objects {
            __typename
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

get more info on these objects:

```graphql
query {
  planets(
    type: "Water"
    maxBio: LOW
    maxThermal: LOW
    maxWeather: LOW
    maxTectonics: LOW
  ) {
    entries {
      node {
        name
        type
        length_of_day
        hazards {
          ...hzd
        }
        star {
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
  hyperspaceJump(star: "Beta Equulei") {
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
