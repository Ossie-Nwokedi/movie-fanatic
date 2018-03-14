import React from 'react';
import PropTypes from 'prop-types';
import api from './../utils/api';
import Loading from './Loading';
import noPosterImg from './../assets/filmstrip-poster.jpg';


export default class MovieProfile extends React.Component{
    state = {
        loading: false,
        error: false,
        movie: null,
    };

    componentDidUpdate(prevProps){
        if (this.props.location.pathname !== prevProps.location.pathname){
            this.fetchMovieTitle (this.props.match.params.id);
        }
    }

    componentDidMount(){
        this.fetchMovieTitle(this.props.match.params.id);
    }

    async fetchMovieTitle(imdbID){
        this.setState(()=>({
            loading: true,
            error: false,
            movie: null
        }));

        const movie = await api.getMovieTitle(imdbID);

        this.setState(()=>({
            loading: false,
            error: movie === null,
            movie
        }));
    }

    render(){
        const { movie } = this.state;
        
        return(
            <div id='movie-profile-container'>
                {movie !== null &&
                   <Profile movie={movie}/>
                }

                {this.state.loading &&
                    <Loading/>
                }

                {this.state.error &&
                    <h5 className='text-center'>The movie could either not be found or there was an error</h5>
                }
            </div>
        );
    }
}

const MovieRating = (props) =>{
    const { Value:value } = props.rating;
    let ratingValue;

    // are we dealing with percentage rating?
    if (value.indexOf('%') !== -1){
        ratingValue = parseInt( value.split('%')[0] );
    }
    else{
        const [score, total] = value.split('/');
        ratingValue = parseInt( (score / total) * 100 );
    }

    return(
        <div id='movie-rating-meter'>
            <div className='movie-rating-bar'>
                <div className='movie-rating-score-bar'
                     style={{width:`${ratingValue}%`}}>
                </div>
            </div>
            <p>{ratingValue}%</p>         
        </div>
    );
}

MovieRating.propTypes = {
    rating: PropTypes.object.isRequired
};

class Profile extends React.Component{
    static propTypes = {
        movie:PropTypes.object.isRequired
    };

    render(){
        const { movie } = this.props;
        
        return(
            <div>
                {/* Movie header */}
                <div id='movie-header'>
                    <div id='movie-title-year'>
                        <h3>{movie.Title}</h3>
                        <p>({movie.Year})</p>
                    </div>

                    <div id='movie-details'>
                        {movie.Runtime !== 'N/A'  &&  <p>{movie.Runtime}</p>}
                        {movie.Genre !== 'N/A'    &&  <p>{movie.Genre}</p>}
                        {movie.Released !== 'N/A' &&  <p>{movie.Released}</p>}
                    </div>
                </div>

                {/* Movie poster and description */}
                <div className='row' id='movie-poster-plot'>
                    <div className='col-12 col-sm-4 col-md-3 col-lg-3'>
                        <img src={
                                movie.Poster !== 'N/A' 
                                ? movie.Poster
                                : noPosterImg
                            } id='movie-poster' className='img-fluid mx-auto mx-sm-0 d-block' />
                    </div>

                    <div className='col-12 col-sm-7 col-md-9 col-lg-9'>
                        {
                            movie.Plot !== 'N/A' 
                            ? <p id='movie-plot'>{movie.Plot}</p>
                            : <p>No movie description</p>
                        }
                    </div>
                </div>

                {/* Details */}
                <div>
                    <table id='movie-details-table'>
                        <tbody>
                            <tr>
                                <td>Director</td>
                                <td>{movie.Director}</td>
                            </tr>
                            <tr>
                                <td>Stars</td>
                                <td>{movie.Actors}</td>
                            </tr>
                            <tr>
                                <td>Country</td>
                                <td>{movie.Country}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Ratings table */}
                    {movie.Ratings.length > 0 &&
                        <table id='movie-ratings-table'>
                            <tbody>
                                <tr>
                                    <th>Ratings</th>
                                </tr>
                                {movie.Ratings.map((rating)=>{
                                    return(
                                        <tr key={rating.Source}>
                                            <td>{rating.Source}</td>
                                            <td>
                                                <MovieRating rating={rating}/>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        );
    }
}
