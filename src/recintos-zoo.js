/**
 * Classe RecintosZoo
 * Representa um zoológico com diversos recintos e animais, e faz a análise de recintos viáveis para novos animais.
 */
class RecintosZoo {
    constructor() {
        // Lista de recintos disponíveis no zoológico
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        // Especificações de cada espécie de animal que o zoológico pode receber
        this.animaisPermitidos = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false },
        };
    }

    /**
     * Analisa os recintos disponíveis para encontrar quais são viáveis para abrigar o novo animal.
     * 
     * @param {string} animal - O nome da espécie do animal.
     * @param {number} quantidade - A quantidade de indivíduos do animal.
     * @returns {Object} - Um objeto contendo uma lista de recintos viáveis ou uma mensagem de erro.
     * 
     * Se nenhum recinto for viável, retorna { erro: "Não há recinto viável" }.
     * Se o animal for inválido, retorna { erro: "Animal inválido" }.
     * Se a quantidade for inválida, retorna { erro: "Quantidade inválida" }.
     */
    analisaRecintos(animal, quantidade) {
        // Valida se o animal está na lista de espécies permitidas
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido" };
        }

        // Valida se a quantidade é maior que 0
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const especie = this.animaisPermitidos[animal]; // Obtém as características da espécie do animal
        const recintosViaveis = []; // Armazena os recintos que são viáveis

        // Processa cada recinto para verificar se ele é viável
        this.recintos.forEach(recinto => {
            // Hipopótamo precisa de "savana e rio", ignorar outros biomas
            if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
                return; // Pula para o próximo recinto
            }

            // Calcula o espaço ocupado pelos animais existentes no recinto
            let espacoOcupado = recinto.animais.reduce((total, a) => {
                const especieAnimal = this.animaisPermitidos[a.especie];
                return total + (especieAnimal.tamanho * a.quantidade);
            }, 0);

            // Verifica se há mais de uma espécie no recinto (adiciona espaço extra)
            const temMaisDeUmaEspecie = recinto.animais.length > 0 && !recinto.animais.some(a => a.especie === animal);
            const espacoExtra = temMaisDeUmaEspecie ? 1 : 0; // 1 espaço extra quando há múltiplas espécies
            const espacoRestante = recinto.tamanhoTotal - espacoOcupado - espacoExtra;

            // Verifica se o bioma do recinto é válido para a espécie
            const biomasRecinto = recinto.bioma.split(' e '); // Divide os biomas compostos como "savana e rio"
            const biomaValido = especie.biomas.some(bioma => biomasRecinto.includes(bioma));

            // Verifica se já há carnívoros no recinto
            const carnivoroNoRecinto = recinto.animais.some(a => this.animaisPermitidos[a.especie].carnivoro);

            // Se o bioma é válido e há espaço suficiente, verifica se o recinto é viável
            if (biomaValido && espacoRestante >= especie.tamanho * quantidade) {
                if (especie.carnivoro && (recinto.animais.length === 0 || recinto.animais[0].especie === animal)) {
                    // Carnívoros só podem estar sozinhos ou com a própria espécie
                    recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoRestante - especie.tamanho * quantidade} total: ${recinto.tamanhoTotal})`);
                } else if (!especie.carnivoro && !carnivoroNoRecinto) {
                    // Animais não carnívoros podem estar com outras espécies desde que não haja carnívoros
                    recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoRestante - especie.tamanho * quantidade} total: ${recinto.tamanhoTotal})`);
                }
            }
        });

        // Se nenhum recinto for viável, retorna erro
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        // Retorna a lista de recintos viáveis
        return { recintosViaveis: recintosViaveis };
    }
}

export { RecintosZoo as RecintosZoo };
