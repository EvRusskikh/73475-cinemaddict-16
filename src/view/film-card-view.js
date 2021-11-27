import dayjs from 'dayjs';
import {getFormattedTime} from '../services/utils';

const CONTROL_ACTIVE_CLASS = 'film-details__control-button--active';

export const createFilmCardTemplate = ({filmInfo, userDetails, comments}) => {
  const {title, totalRating, release, runtime, genre, poster, description} = filmInfo;
  const commentsQuantity = comments.length;

  const watchlistClassName = userDetails.watchlist ? CONTROL_ACTIVE_CLASS : '';
  const watchedClassName = userDetails.alreadyWatched ? CONTROL_ACTIVE_CLASS : '';
  const favoriteClassName = userDetails.favorite ? CONTROL_ACTIVE_CLASS : '';

  const releaseYear = dayjs(release.date).format('YYYY');

  const getShortDescription = () => {
    if (description.length > 140) {
      return `${description.slice(0, 140)}...`;
    }
    return description;
  };

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${getFormattedTime(runtime)}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${getShortDescription()}</p>
      <span class="film-card__comments">${commentsQuantity} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
