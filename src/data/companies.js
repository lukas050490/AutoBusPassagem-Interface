// src/data/companies.js
export const companies = [
    {
        id: "aguia",
        name: "Águia Turismo",
        origins: [
            { city: "São Paulo", destinations: ["Rio de Janeiro", "Campinas", "Curitiba"] },
            { city: "Campinas", destinations: ["São Paulo", "Belo Horizonte"] }
        ]
    },
    {
        id: "natureza",
        name: "Viação Natureza",
        origins: [
            { city: "Fortaleza", destinations: ["Natal", "Recife"] },
            { city: "Recife", destinations: ["Fortaleza", "João Pessoa"] }
        ]
    },
    {
        id: "expresso",
        name: "Expresso Rápido",
        origins: [
            { city: "Salvador", destinations: ["Feira de Santana", "Vitória da Conquista"] },
            { city: "Feira de Santana", destinations: ["Salvador", "Ilhéus"] }
        ]
    },
    {
        id: "nascente",
        name: "Sol Nascente",
        origins: [
            { city: "Curitiba", destinations: ["Florianópolis", "Joinville"] },
            { city: "Florianópolis", destinations: ["Curitiba", "Blumenau"] }
        ]
    },
    {
        id: "urbano",
        name: "Ônibus Urbano",
        origins: [
            { city: "Rio de Janeiro", destinations: ["Niterói", "São Gonçalo"] },
            { city: "Niterói", destinations: ["Rio de Janeiro", "São Gonçalo"] }
        ]
    },
    {
        id: "real",
        name: "Rede Real",
        origins: [
            { city: "Belo Horizonte", destinations: ["Contagem", "Betim"] },
            { city: "Contagem", destinations: ["Belo Horizonte", "Ibirité"] }
        ]
    }
];
