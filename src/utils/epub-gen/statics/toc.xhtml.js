import { dedent } from 'dentist'

/**
 * String data of OEBPS/toc.xhtml
 * @param {String} title ePub title
 * @param {String} language ePub Language
 * @param {String} nav_contents navigation list
 */
export const OEBPS_TOC_XHTML = (title, language, nav_contents) => dedent(`
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${language}" lang="${language}">
<head>
    <title>${title}</title>
    <meta charset="UTF-8" />
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
<h1 class="h1">Table Of Contents</h1>
<nav id="toc" epub:type="toc">
    <ol>
        <li class="table-of-content">
            <a href="toc.xhtml">- Table Of Contents -</a>
        </li>
        ${nav_contents} 
    </ol>
</nav>

</body>
</html>
`)