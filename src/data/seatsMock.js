export const seatsMock = [
    {
        tripId: 1,
        seats: Array.from({ length: 40 }, (_, i) => ({
            number: i + 1,
            available: Math.random() > 0.3,
        })),
    },
    {
        tripId: 2,
        seats: Array.from({ length: 40 }, (_, i) => ({
            number: i + 1,
            available: Math.random() > 0.5,
        })),
    },
];
