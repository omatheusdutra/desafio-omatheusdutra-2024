import { RecintosZoo } from "./recintos-zoo.js";

/**
 * Testes unitários para o sistema de análise de recintos do zoológico.
 * Utiliza a biblioteca Jest para garantir que a lógica está funcionando corretamente.
 */
describe('Recintos do Zoologico', () => {

    test('Deve rejeitar animal inválido', () => {
        // Testa se um animal inexistente retorna erro
        const resultado = new RecintosZoo().analisaRecintos('UNICORNIO', 1);
        expect(resultado.erro).toBe("Animal inválido");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Deve rejeitar quantidade inválida', () => {
        // Testa se uma quantidade inválida de animais (0 ou menos) retorna erro
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 0);
        expect(resultado.erro).toBe("Quantidade inválida");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Não deve encontrar recintos para 10 macacos', () => {
        // Testa se não há recintos viáveis para 10 macacos
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 10);
        expect(resultado.erro).toBe("Não há recinto viável");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Deve encontrar recinto para 1 crocodilo', () => {
        // Testa se o recinto correto é encontrado para 1 crocodilo
        const resultado = new RecintosZoo().analisaRecintos('CROCODILO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 4 (espaço livre: 5 total: 8)');
        expect(resultado.recintosViaveis.length).toBe(1);
    });

    test('Deve encontrar recintos para 2 macacos', () => {
        // Testa se múltiplos recintos viáveis são encontrados para 2 macacos
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 2);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 1 (espaço livre: 5 total: 10)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 2 (espaço livre: 3 total: 5)');
        expect(resultado.recintosViaveis[2]).toBe('Recinto 3 (espaço livre: 2 total: 7)');
        expect(resultado.recintosViaveis.length).toBe(3);
    });

    test('Não deve encontrar recintos para 1 hipopótamo em savana ou rio isolados', () => {
        // Modifica os recintos para que não exista nenhum com "savana e rio"
        const recintosModificados = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'rio', tamanhoTotal: 8, animais: [] }
        ];

        const zoo = new RecintosZoo();
        zoo.recintos = recintosModificados; // Aplica os recintos modificados

        const resultado = zoo.analisaRecintos('HIPOPOTAMO', 1);
        expect(resultado.erro).toBe("Não há recinto viável");
        expect(resultado.recintosViaveis).toBeFalsy();
    });
});
