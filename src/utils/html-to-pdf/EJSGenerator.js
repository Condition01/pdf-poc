var fs = require('fs');
var ejs = require('ejs');
var pdf = require('html-pdf')

module.exports.EJSGenerator = class EJSGenerator {
    constructor() {}

    generatePdf = (templateFile, patterns) => {
        var startDate = new Date();

        var compiled = ejs.compile(fs.readFileSync(`./templates/${templateFile}`, 'utf8'));

        var attributes = {};

        patterns.forEach(pattern => {
            attributes[pattern.searchValue] = pattern.replaceValue
        })

        var html = compiled(attributes);

        pdf.create(html).toFile('./templates/output/fromhtml-ejs-output.pdf', () => {
            console.log();
        })

        var endDate   = new Date();

        var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

        console.log("With ejs: ", seconds)
    }
}