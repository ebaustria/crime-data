export interface NeighborhoodCrime {
    [neighborhood: string]: {
        totalCases: string;
        solvedCases: string;
        suspects: string;
    };
}

export interface YearlyData {
    [year: string]: NeighborhoodCrime;
}

export interface RawCrimeData {
    [key: string]: string;
}