# Challenge 4

## Creating new item

```
mutation {
  addMovie(title: "Fast & Furious", genre: Action, rating: 7.5) {
    id
    title
    genre
    rating
  }
}
```

## Reading a item from your list

```
{
    getMovieById(id: 1) {
        id
        title
        genre
        rating
    }
}
```

## Updating an item

```
mutation{
  updateMovie(id: 3, rating: 5.6) {
    id
    title
    genre
    rating
  }
}
```

## Deleting an item

```
mutation{
  deleteMovie(id: 2) {
    id
    title
    genre
    rating
  }
}
```
