const hummus = require('hummus');

module.exports.HummusPDFReplacer = class HummusPDFReplacer {
    replaceValues = async (inputFile, patterns) => {
        replaceText(`./templates/${inputFile}`, './templates/outpout/hummus-output.pdf', patterns);
    }
}

function strToByteArray(str) {
    var myBuffer = [];
    var buffer = Buffer.from(str);
    for (var i = 0; i < buffer.length; i++) {
        myBuffer.push(buffer[i]);
    }
    return myBuffer;
}

function replaceText(sourceFile, targetFile, patterns) {

    var writer = hummus.createWriterToModify(sourceFile, {
        modifiedFilePath: targetFile
    });


    const numPages = writer
        .createPDFCopyingContextForModifiedFile()
        .getSourceDocumentParser()
        .getPagesCount();

    for (let page = 0; page < numPages; page++) {
        var sourceParser = writer.createPDFCopyingContextForModifiedFile().getSourceDocumentParser();
        var pageObject = sourceParser.parsePage(page);

        var textObjectId = pageObject.getDictionary().toJSObject().Contents.getObjectID();
        var textStream = sourceParser.queryDictionaryObject(pageObject.getDictionary(), 'Contents');

        var data = [];
        var readStream = sourceParser.startReadingFromStream(textStream);

        while (readStream.notEnded()) {
            Array.prototype.push.apply(data, readStream.read(10000));
        }

        var string = Buffer.from(data).toString()

        for (const pattern of patterns) {
            string = string.replace(pattern.searchValue, pattern.replaceValue);
        }

        var objectsContext = writer.getObjectsContext();

        objectsContext.startModifiedIndirectObject(textObjectId);

        var stream = objectsContext.startUnfilteredPDFStream();
        stream.getWriteStream().write(strToByteArray(string));
        objectsContext.endPDFStream(stream);

        objectsContext.endIndirectObject();
    }

    writer.end();
}

