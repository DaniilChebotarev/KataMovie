import React from "react";
import { useEffect, useState, useMemo } from "react";
import { Spin, Alert, Input, Pagination, Tabs } from "antd";
import { Offline, Online } from "react-detect-offline";
import { Provider } from "../SwapiServiceContext/SwapiServiceContext";
import movieService from "../../services/services";
import MovieList from "../MovieList/MovieList";
import debounce from 'lodash.debounce';
import ErrorIndicator from "../Error/Error";
import "./App.css";


function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("fight club");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageQty, setPageQty] = useState(0);
  const [totalResultsRate, setTotalResultsRate] = useState(0);
  const [currentPageRate, setCurrentPageRate] = useState(1);
  const [genres, setGenres] = useState([]);
  const [rated, setRated] = useState([]);

  const getMovies = async () => {
    if (search.trim().length === 0) {
      return;
    }
    try {
      setLoading(true);
      const movie = await movieService.getMovies(search, currentPage);
      setMovies(movie.results);
      setPageQty(movie.total_pages);
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false);
    }
  };


  const loadRatedMovies = async (page) => {
    try {
      setLoading(true)
      const data = await movieService.getRatedMovies(page);
      setTotalResultsRate(data.total_results);
      setRated(data.results)
      setError(null)
    } catch(err) {
      setError(err);
    } finally {
      setLoading(false)
    }
  }

  

  const onPaginationChangeRate = (pg) => {
    setCurrentPageRate(pg);
    loadRatedMovies(pg);
  };

  const onRate = async (id, value) => {
    if (value > 0) {
      await movieService.postMovieRating(id, value);
      movieService.setLocalRating(id, value);
      const ratedMovies = await movieService.getRatedMovies();
      setRated(ratedMovies.results);
    } else {
      await movieService.deleteRating(id);
      localStorage.removeItem(id);
      const ratedMovies = await movieService.getRatedMovies();
      setRated(ratedMovies.results);
    }
  };


  useEffect(() => {
    const load = async () => {
      if (!movieService.getLocalGuestSessionToken()) {
        const session = await movieService.getQuestSession();
        movieService.setLocalGuestSessionToken(session.guest_session_id);
      }

      const dataGenre = await movieService.getGenreMovies()
      setGenres(dataGenre.genres)
      

      const ratedMovies = await movieService.getRatedMovies();
      setRated(ratedMovies.results)
    }
    
    load()
  }, [])


  useEffect(() => {
    getMovies(search, currentPage);
    
  }, [search, currentPage]);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };


  const paginationPanelRated = !error ? (
    <Pagination
      current={currentPageRate}
      total={totalResultsRate}
      onChange={onPaginationChangeRate}
      pageSize={20}
      hideOnSinglePage
    />
  ) : null;

  
  const onTabsChange = (active) => {
    if (active === "2") {
      loadRatedMovies(1);
    }
    if (active === "1") {
      getMovies();
    }
  };

  const searchMovieCallback = useMemo(() => debounce(onSearchChange, 600), [])

  const errorindicator = error ? <ErrorIndicator /> : null;
  const spinner = loading ? <Spin size="large" className="app__spin" /> : null;
  const content = !loading ? <MovieList movies={movies} onRate={onRate}/> : null;
  

  const items = [
    {
      key: "1",
      label: `Search`,
      children: (
        <>
          <Input
            onChange={searchMovieCallback}
            placeholder="Type to search..."
          />
          {errorindicator}
          {spinner}
          {content}
          {!!pageQty && (
            <Pagination
              className="app__pagination"
              defaultCurrent={currentPage}
              total={pageQty}
              onChange={(num) => setCurrentPage(num)}
            />
          )}
        </>
      ),
    },

    {
      key: '2',
      label: `Rated`,
      children: (
        <>
        {paginationPanelRated}
        <MovieList movies={rated} onRate={onRate}/>
        </>
        
      )
    }
  ];


  return (
    <div className="app">
      <Provider value={genres}>
      <Online>
        <Tabs centered defaultActiveKey="1" items={items} onChange={onTabsChange}/>
      </Online>
      <Offline>
        <Alert
          message="Нет сети, проверьте подключение"
          type="error"
          showIcon
        />
      </Offline>
      </Provider>
    </div>
    
  );
}

export default App;
