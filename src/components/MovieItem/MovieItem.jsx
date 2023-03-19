import React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Tag, Progress, Rate  } from "antd";
import { Consumer } from "../SwapiServiceContext/SwapiServiceContext";
import truncate from "../../utils/truncate";
import movieService from "../../services/services";
import changeColor from "../../utils/changeColor";
import "./MovieItem.css";

function MovieItem({ id, title, img, vote, date, text, genreId, onRate}) {
  const imgLink = `https://image.tmdb.org/t/p/original`;
  const noImg = `/images/noImg.svg`;

  const [rating, setRating] = useState(0);

  useEffect(() => {
    setRating(movieService.getLocalRating(id));
  }, [id]);


  return (
    <Consumer>
      {(genres) => {
        return (
          <li className="wrapper" key={id}>
            <section className="visual">
              <img
                className="visual__image"
                src={img ? `${imgLink}${img}` : `${noImg}`}
                alt="movie"
              />
            </section>

            <section className="content">
            <Progress className="content__progress"
                      percent={vote * 10} 
                      format={(percent) => (percent / 10).toFixed(1)} 
                      type="circle"
                      size={40}
                      strokeColor={changeColor(vote)}/>  
              <div className="content__name">{title}</div>
              <div className="content__date">
                {date ? format(new Date(date), "MMM dd, yyyy") : "No data"}
              </div>
              {
                genres.map(genre => {
                  if(genreId.includes(genre.id)) {
                    return (
                    <Tag key={genre.id} className="content__tag"> 
                        {genre.name}
                    </Tag>)
                  }
                  return null;
                })
              }
              <div className="content__text">{truncate(text)}</div>
              <Rate onChange={(star) => {
                onRate(id, star); 
                setRating(star)}} value={rating} allowHalf className="content__rate" count={10}/>
            </section>
          </li>
        );
      }}
    </Consumer>
  );
}

export default MovieItem;
