const { CommonGenerator } = require("./utils/html-to-pdf/CommonGenerator");
const { EJSGenerator } = require("./utils/html-to-pdf/EJSGenerator");
const { HummusPDFReplacer } = require("./utils/pdf-to-pdf/HummusPDFReplacer");
const { MuhammaraPDFReplacer } = require("./utils/pdf-to-pdf/MuhammaraPDFReplacer")

const muhammaraPDFReplacer = new MuhammaraPDFReplacer()
const hummusPDFReplacer = new HummusPDFReplacer()

/*
const patterns = [{ searchValue: /NOMECLIENTE/g, replaceValue: "Bruno" }, { searchValue: /NUMERO/g, replaceValue: "dsadsa" }]

muhammaraPDFReplacer.replaceValues('template.pdf', patterns);
hummusPDFReplacer.replaceValues('template.pdf', patterns);
*/

/* Using ejs lib to parse HTML */
var patterns = [{ searchValue: 'nomeCliente', replaceValue: 'Bruno' }, { searchValue: 'text', replaceValue: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry' }];

const eJSGenerator = new EJSGenerator();
eJSGenerator.generatePdf('htmlejs-template.html', patterns)


/* Using replace and regex */
patterns = [
    { searchValue: /%nomeCliente%/g, replaceValue: 'Bruno' }, 
    { searchValue: /%text%/g, replaceValue: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry' },
    { searchValue: /%telefone%/g, replaceValue: '(14)99563-2313' }, 
];

const commonGenerator = new CommonGenerator();
commonGenerator.generatePdf('html-template.html', patterns)