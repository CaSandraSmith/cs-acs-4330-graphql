# Lesson 1

## 1. Get Rick Sanchez's name and status.
```
query {
  character(id: 1) {
    name
    status
  }
}
```

## 2. Get Morty Smith's name, species, and gender.
```
query {
  character(id: 2) {
    name
    species
    gender
  }
}
```

## 3. Get Summer Smith's name and the name of her current location.
```
query {
  character(id: 3) {
    name
    location {
      name
    }
  }
}
```

## 4. Get the total count of all characters. (Hint: try characters { info { count } })
```
query {
  characters { 
    info { 
      count 
    } 
  }
}
```

## 5. Get the name and air date of episode 1.
```
query {
  episode(id: 1) {
    name
    air_date
  }
}
```

## 6. Get Rick's name and the name of his origin location.
```
query {
  character(id: 1) {
    name
    origin {
      name
    }
  }
}
```

## 7. Get the dimension of Rick's origin location.
```
query {
  character(id: 1) {
    name
    origin {
      dimension
    }
  }
}
```

## 8. Get both Rick and Morty's names and species using a single query. Use aliases!
```
query {
  rick: character(id: 1) {
    name
    species
  }
  morty: character(id: 2) {
    name
    species
  }
}
```

## 9. Get both Rick's origin location name and Morty's origin location name using a single query. Use aliases!
```
query {
  rick: character(id: 1) {
    name
    origin {
      name
    }
  }
  morty: character(id: 2) {
    name
    origin {
      name
    }
  }
}
```

## 10. Get the names of the first 3 residents of the Citadel of Ricks. (Hint: try location(id: 3) { residents { name } })
```
query {
  location(id: 3) { 
    residents { 
      name 
    } 
  }
}
```
This gives all of the residents of Citadel of Ricks. There isn't a filter or argument within GraphQL to limit it to the first 3 residents.