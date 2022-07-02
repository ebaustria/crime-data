export interface NeighborhoodCrime {
    [neighborhood: string]: CrimeStatistics;
}

export interface NationalCrime {
    [crimeCategory: string]: RawCrimeData;
}

export interface CrimeStatistics {
    totalCases: string;
    solvedCases: string;
    suspects: string;
}

export interface YearlyData {
    [year: string]: NeighborhoodCrime | NationalCrime;
}

export interface RawCrimeData {
    [key: string]: string;
}

export interface SelectMenuData {
    label: string;
    value: string;
}
