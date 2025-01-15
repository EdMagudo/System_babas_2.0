import mpesa from 'mpesa-node-api';

// Função para gerar uma referência aleatória
// const transactionReference = () => {
//     // Gera uma string alfanumérica de 11 caracteres aleatórios após "nanny"
//     return 'ref4sdasdsadvcv';
//   };
const transactionReference = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'ref';
    
    // Make sure length is a number and has a valid value
    const targetLength = Math.max(Number(length) || 10, 4); // minimum length of 4 to include 'ref'
    
    // Generate random characters
    for (let i = 3; i < targetLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars.charAt(randomIndex);
    }
    
    return result;
};
// Função principal para o pagamento M-Pesa
const pagamentoMpesa = async (amount, phoneNumber) => {
    // Gera uma referência aleatória para a transação
   
    const reference = transactionReference();
    console.log(reference);
if (!reference) {
  throw new Error("Failed to generate a valid ThirdPartyReference");
}

    // Inicia a transação C2B
    const response = await mpesa.initiate_c2b(amount,`258`+ phoneNumber,'T12344C' ,reference);

    // Retorna o resultado com a referência gerada
    return {
        reference: reference,
        response
    };
};

export default {
    pagamentoMpesa
};
