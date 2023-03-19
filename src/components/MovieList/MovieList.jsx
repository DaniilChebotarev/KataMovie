import React from 'react';
import './MovieList.css'
import MovieItem from '../MovieItem/MovieItem';

function MovieList({movies, onRate}) {
  const listItem = movies.map(movie => {
    return (
    <MovieItem 
      onRate={onRate}
      key={movie.id}
      id={movie.id}
      img={movie.poster_path}
      title={movie.title}
      vote={movie.vote_average}
      date={movie.release_date}
      text={movie.overview}
      genreId={movie.genre_ids}
    />
    )
  })
  return (
    <ul className='all-content'>
          {listItem}
    </ul>
  );
    
}

export default MovieList;
