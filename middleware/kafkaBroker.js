const Consumer = require('../module/Consumer');
const DocumentService = require('../service/DocumentService');
const UserSocket = require('../model/UserSocket');
const io = require('../middleware/socket').ioInstance();

module.exports = async function(brokers) {
    const consumerInstance = new Consumer('backend-nrc', brokers, 'nrc-group');
    await consumerInstance.connect();
    await consumerInstance.subscribe(['ocr_requests','ocr_results','translation_results','translation_requests']);

    consumerInstance.setHandler('ocr_requests', async (json) => {
        console.log(`Received data from OCR-request: `, json);

        try {
            const data = json.message;
            const docType = DocumentService.getDocTypeByName(data.doc_type);
            const docId = data.doc_id;

            const document = await DocumentService.getDocumentById(docId, docType);
            console.log(`Processing OCR request: ${document}`);
        } catch(err) {
            console.error(`Error processing OCR request at ${topic} ${partition} ${message.offset} ${err}`);
        }
    })

    consumerInstance.setHandler('ocr_results', async (json) => {
        console.log(`Received data from OCR-result: `, json);

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
        try {
            const { req_id, requester_id } = json.message;
            const userId = requester_id;

            const userSocket = await UserSocket.findOne({ userId });
            if (userSocket) {
                io.to(userSocket.socketId).emit("translation_completed", {
                    message: "Translation Completed!",
                    req_id: req_id
                }, (response) => {
                    console.log(`Sent translation result to userId ${requester_id}`)
                })
            } else {
                console.log(`User ${userId} not connected via WebSocket.`);
            }
        } catch(err) {
            console.error(`Error get the required data at ${topic} ${partition} ${message.offset} ${err}`);
        }
    })

    consumerInstance.setHandler('translation_requests', async (json) => {
        console.log(`Received data from NLP-request: `, json);
        try {
            const { req_id, requester_id, filename } = json.message;
            const userId = requester_id;

            const userSocket = await UserSocket.findOne({ userId });
            if (userSocket) {
                io.to(userSocket.socketId).emit("translation_request", {
                    message: "Translation on progress!",
                    req_id: req_id,
                    filename: filename
                }, (response) => {
                    console.log(`Sent translation request to userId ${requester_id}`)
                })
            } else {
                console.log(`User ${userId} not connected via WebSocket.`);
            }
        } catch(err) {
            console.error(`Error get the required data at ${topic} ${partition} ${message.offset} ${err}`)
        }
    })

    return consumerInstance;
}