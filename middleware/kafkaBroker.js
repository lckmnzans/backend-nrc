// setting kafka consumer
const Consumer = require('./Consumer');
const DocumentService = require('../service/DocumentService');

module.exports = async function(brokers) {
    const consumerInstance = new Consumer('backend-nrc', brokers, 'nrc-group');
    await consumerInstance.connect();
    await consumerInstance.subscribe(['test-topic','translation_results','translation_requests']);

    consumerInstance.setHandler('test-topic', async (json) => {
        console.log(`Received data from OCR: `, json);

        try {
            const data = json.message;
            const docType = DocumentService.getDocTypeByName(data.doc_type);
            const docId = data.doc_id;

            DocumentService.ocrResultModelMapper(docType, docId, data.result);
            console.log(`Success processing OCR result for [documentId:${docId}]`);
        } catch(err) {
            console.error(`Error processing OCR result at ${topic} ${partition} ${message.offset} ${err}`);
        }
    })

    consumerInstance.setHandler('translation_results', async (json) => {
        console.log(`Received data from NLP-result: `, json);
    })

    consumerInstance.setHandler('translation_requests', async (json) => {
        console.log(`Received data from NLP-request: `, json);
    })

    return consumerInstance;
}