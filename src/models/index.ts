export interface NeighborhoodCrime {
    [neighborhood: string]: {
        totalCases: string;
        solvedCases: string;
        suspects: string;
    };
}