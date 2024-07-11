export class Anime {
    name: string;
    rating: number | undefined;
    state: number;
    genre: number;

    constructor(state: number, rating?: number, name?: string, genre?:number) {
        this.name = name ?? "";
        this.rating = rating;
        this.state = state;
        this.genre = genre ?? 6;
    }
}
