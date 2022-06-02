var fs = require('fs');
var pdf = require('html-pdf')

module.exports.CommonGenerator = class CommonGenerator {
    constructor() {}

    generatePdf = (templateFile, patterns) => {
        var startDate = new Date();

        var html = fs.readFileSync(`./templates/${templateFile}`, 'utf8');

        patterns.forEach(pattern => {
            html = html.replaceAll(pattern.searchValue, pattern.replaceValue)
        })

        pdf.create(html).toFile('./templates/output/fromhtml-output.pdf', () => {
            console.log();
        })

        var endDate   = new Date();

        var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

        console.log("Without ejs: ", seconds)
    }
}