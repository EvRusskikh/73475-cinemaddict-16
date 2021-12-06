import {COMMENTS_COUNT, FILMS_COUNT} from './const';
import {getFilmComments, getFilmsCount, getMostCommentedFilms, getTopRatedFilms} from './utils/film';
import {remove, render, RenderPosition} from './utils/render';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import {generateFilter} from './mock/filter';
import SortView from './view/sort-view';
import ProfileView from './view/profile-view';
import MainNavigationView from './view/main-navigation-view';
import FilmsCounterView from './view/films-counter-view';
import FilmsView from './view/films-view';
import FilmsListView from './view/films-list-view';
import FilmCardView from './view/film-card-view';
import MoreButtonView from './view/more-button-view';
import FilmDetailsView from './view/film-details-view';
import FilmCommentView from './view/film-comment-view';
import NoFilmsView from './view/no-films-view';

const filmsData = Array.from({length: FILMS_COUNT}, generateFilm);
const commentsData = Array.from({length: COMMENTS_COUNT}, generateComment);
const filters = generateFilter(filmsData);
const alreadyWatchedCount = getFilmsCount(filmsData).alreadyWatched;

const bodyElement = document.body;
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const renderFilm = (container, film) => {
  const filmCardComponent = new FilmCardView(film);
  const filmDetailsComponent = new FilmDetailsView(film);

  const openFilmDetails = () => {
    bodyElement.classList.add('hide-overflow');
    render(bodyElement, filmDetailsComponent);

    const commentsListElement = filmDetailsComponent.element.querySelector('.film-details__comments-list');
    for (let i = 0; i < film.comments.length; i++) {
      const comment = getFilmComments(film, commentsData)[i];
      render(commentsListElement, new FilmCommentView(comment));
    }
  };

  const closeFilmDetails = () => {
    bodyElement.classList.remove('hide-overflow');
    remove(filmDetailsComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closeFilmDetails();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  render(container, filmCardComponent);

  filmCardComponent.setOpenDetailsHandler(() => {
    openFilmDetails();
    document.addEventListener('keydown', onEscKeyDown);
  });

  filmDetailsComponent.setCloseDetailsHandler(() => {
    closeFilmDetails();
    document.removeEventListener('keydown', onEscKeyDown);
  });
};

const renderFilmsList = (container, title, films, count = films.length) => {
  const listElement = new FilmsListView(title).element;
  render(container, listElement);

  const containerElement = listElement.querySelector('.films-list__container');

  for (let i = 0; i < count; i++) {
    const film = films[i];
    renderFilm(containerElement, film);
  }

  return {listElement, containerElement};
};

const renderFullFilmsList = (container, films) => {
  const FILM_COUNT_PER_STEP = 5;

  const {
    listElement, containerElement
  } = renderFilmsList(container, 'All movies. Upcoming', films, Math.min(films.length, FILM_COUNT_PER_STEP));

  listElement.querySelector('.films-list__title').classList.add('visually-hidden');

  if (films.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    const moreButtonComponent = new MoreButtonView();
    render(listElement, moreButtonComponent);

    moreButtonComponent.setClickHandler(() => {
      films
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => renderFilm(containerElement, film));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= films.length) {
        remove(moreButtonComponent);
      }
    });
  }
};

const renderTopFilmsList = (container, films) => {
  const {listElement} = renderFilmsList(container, 'Top rated', getTopRatedFilms(films));
  listElement.classList.add('films-list--extra');
};

const renderMostCommentedFilmsList = (container, films) => {
  const {listElement} = renderFilmsList(container, 'Most commented', getMostCommentedFilms(films));
  listElement.classList.add('films-list--extra');
};

const renderFilms = (container, films) => {
  const filmsBoard = new FilmsView();
  render(container, filmsBoard);

  if (films.length === 0) {
    render(filmsBoard, new NoFilmsView());
    return;
  }

  render(filmsBoard, new SortView(), RenderPosition.BEFOREBEGIN);
  renderFullFilmsList(filmsBoard, films);

  if (films.some(({filmInfo}) => filmInfo.totalRating > 0)) {
    renderTopFilmsList(filmsBoard, films);
  }

  if (films.some(({comments}) => comments.length > 0)) {
    renderMostCommentedFilmsList(filmsBoard, films);
  }
};

render(siteMainElement, new MainNavigationView(filters));
render(siteHeaderElement, new ProfileView(alreadyWatchedCount));
renderFilms(siteMainElement, filmsData);
render(footerStatisticsElement, new FilmsCounterView(filmsData.length));
