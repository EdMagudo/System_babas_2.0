import mpesa from 'mpesa-node-api';

// Função para gerar uma referência aleatória
const transactionReference = () => {
    // Gera uma string alfanumérica de 11 caracteres aleatórios após "nanny"
    return 'ref1sdasdsadn15';
  };
  
  

// Função principal para o pagamento M-Pesa
const pagamentoMpesa = async (amount, phoneNumber) => {
    // Gera uma referência aleatória para a transação
   
    const reference = transactionReference();
if (!reference) {
  throw new Error("Failed to generate a valid ThirdPartyReference");
}

    // Inicia a transação C2B
    const response = await mpesa.initiate_c2b(amount, phoneNumber, reference);

    // Retorna o resultado com a referência gerada
    return {
        reference: reference,
        response
    };
};

export default {
    pagamentoMpesa
};
