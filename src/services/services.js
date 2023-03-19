class SwapiService {
  _apiBase = "https://api.themoviedb.org/3";
  _apiKey = "54aa7a27c51d38ca698c9de54f5e497e";

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }

    const body = await res.json();
    return body;
  }

  getMovies(query = "harry", currentPage = 1) {
    return this.getResource(
      `/search/movie?api_key=${this._apiKey}&language=en-US&query=${query}&page=${currentPage}`
    );
  }

  getGenreMovies() {
    return this.getResource(
      `/genre/movie/list?api_key=${this._apiKey}&language=en-US`
    );
  }

  async getQuestSession() {
    const data = await fetch(
      "https://api.themoviedb.org/3/authentication/guest_session/new?api_key=54aa7a27c51d38ca698c9de54f5e497e"
    );
    const res = await data.json();
    return res;
  }

  async postMovieRating(movieId, rating) {
    const token = localStorage.getItem("token");
    const data = await fetch(
      `${this._apiBase}/movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          value: rating,
        }),
      }
    );

    const res = await data.json();

    return res;
  }

  async deleteRating(movieId) {
    const token = localStorage.getItem("token");
    const data = await fetch(
      `${this._apiBase}/movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${token}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    return data;
    }

    async getRatedMovies(page = 1) {
        const token = localStorage.getItem("token");
        const data = await fetch(
            `https://api.themoviedb.org/3/guest_session/${token}/rated/movies?api_key=54aa7a27c51d38ca698c9de54f5e497e&page=${page}`
        )

        const res = await data.json();
        return res;
    }

    getLocalGuestSessionToken() {
      return localStorage.getItem("token");
    }
  
    setLocalGuestSessionToken(token) {
      localStorage.setItem("token", token);
      // setter не надо return
    }
  
    setLocalRating(id, value) {
      localStorage.setItem(id, value);
    }

    getLocalRating(id) {
      return +localStorage.getItem(id);
    }
  
}

const movieService = new SwapiService();

export default movieService;
