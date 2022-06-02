const muhammara = require("muhammara")
const fs = require('fs')

module.exports.MuhammaraPDFReplacer = class MuhammaraPDFReplacer {
    replaceValues = async (inputFile, patterns) => {
        const inputBuffer = fs.readFileSync(`./templates/${inputFile}`);
        const outputBuffer = await fillPdf(inputBuffer, patterns);

        fs.writeFileSync('./templates/output/muhammara-output.pdf', outputBuffer)
    }
}

modifyPdf = (
    sourceStream,
    targetStream,
    patterns,
) => {
    const modPdfWriter = muhammara.createWriterToModify(sourceStream, targetStream, { compress: false });
    const numPages = modPdfWriter
        .createPDFCopyingContextForModifiedFile()
        .getSourceDocumentParser()
        .getPagesCount();

    for (let page = 0; page < numPages; page++) {
        const copyingContext = modPdfWriter.createPDFCopyingContextForModifiedFile();
        const objectsContext = modPdfWriter.getObjectsContext();

        const pageObject = copyingContext.getSourceDocumentParser().parsePage(page);
        const textStream = copyingContext
            .getSourceDocumentParser()
            .queryDictionaryObject(pageObject.getDictionary(), "Contents");
        const textObjectID = pageObject.getDictionary().toJSObject().Contents.getObjectID();

        let data = [];
        const readStream = copyingContext.getSourceDocumentParser().startReadingFromStream(textStream);
        while (readStream.notEnded()) {
            const readData = readStream.read(10000);
            data = data.concat(readData);
        }

        const pdfPageAsString = Buffer.from(data).toString("binary"); // key change 1

        let modifiedPdfPageAsString = pdfPageAsString;

        for (const pattern of patterns) {
            modifiedPdfPageAsString = modifiedPdfPageAsString.replaceAll(pattern.searchValue, pattern.replaceValue);
        }

        objectsContext.startModifiedIndirectObject(textObjectID);

        const stream = objectsContext.startUnfilteredPDFStream();
        stream.getWriteStream().write(strToByteArray(modifiedPdfPageAsString));
        objectsContext.endPDFStream(stream);

        objectsContext.endIndirectObject();
    }

    modPdfWriter.end();
};

strToByteArray = (str) => {
    const myBuffer = [];
    const buffer = Buffer.from(str, "binary"); // key change 2
    for (let i = 0; i < buffer.length; i++) {
        myBuffer.push(buffer[i]);
    }
    return myBuffer;
};

fillPdf = async (sourceBuffer, patterns) => {
    const sourceStream = new muhammara.PDFRStreamForBuffer(sourceBuffer);
    const targetStream = new muhammara.PDFWStreamForBuffer();

    modifyPdf(
        sourceStream,
        targetStream,
        patterns,
    );

    return targetStream.buffer;
};

//{ searchValue: findPattern, replaceValue: replaceValue }