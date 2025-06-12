import mongoose, { Document, Schema } from 'mongoose';

// Define the TypeScript interface for a Movie Document
export interface IMovie extends Document {
    tmdb_id: number;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    poster_path: string;
    backdrop_path: string;
    genre_ids: number[];
    trailer_key?: string;
    popularity?: number;
}

// export interface IMoviesModel extends mongoose.Model<IMovie> {
//     movies: IMovie[];
// }

// Define the Movie Schema
const movieSchema: Schema = new Schema({
    tmdb_id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    title: { type: String, required: true },
    overview: { type: String, required: true },
    release_date: { type: String },
    vote_average: { type: Number },
    poster_path: { type: String },
    backdrop_path: { type: String },
    genre_ids: [{ type: Number }],
    trailer_key: { type: String },
    popularity: {type: Number}
}, {
    timestamps: true
});

// Create and Export the Mongoose Model
const Movie = mongoose.model<IMovie>('Movie', movieSchema);

export default Movie;