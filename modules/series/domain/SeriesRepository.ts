import { searchSeries } from '../infrastructure/tmdbClient';

export interface SearchResult {
  externalId: string;
  title: string;
  overview: string;
  posterUrl: string | null;
  firstAirDate: string | null;
}

export class SeriesRepository {
  async searchSeries(query: string): Promise<SearchResult[]> {
    return await searchSeries(query);
  }
}
