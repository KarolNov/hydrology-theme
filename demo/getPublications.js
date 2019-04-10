//create object which will contain all publications
const publicationsObj = {};

//fetch data from txt file
fetch("./data/publications/webOfScience.txt")
    .then(response => response.text())
    .then(text => {
        publicationsObj.webOfScience = parseText(text);
        let tbody = document.getElementById("webOfScience").getElementsByTagName('tbody')[0];
        let innerHTML = "";
        publicationsObj.webOfScience.forEach(el => {
            innerHTML = innerHTML.concat(createRow(el, 1))
        })
        tbody.innerHTML = innerHTML;
    })
fetch("./data/publications/outOfWebOfScience.txt")
    .then(response => response.text())
    .then(text => {
        publicationsObj.outOfWebOfScience = parseText(text);
        let tbody = document.getElementById("outOfWebOfScience").getElementsByTagName('tbody')[0];
        let innerHTML = "";
        publicationsObj.outOfWebOfScience.forEach(el => {
            innerHTML = innerHTML.concat(createRow(el, 1))
        })
        tbody.innerHTML = innerHTML;
    })
fetch("./data/publications/chapters.txt")
    .then(response => response.text())
    .then(text => {
        publicationsObj.chapters = parseText(text);
        let tbody = document.getElementById("chapters").getElementsByTagName('tbody')[0];
        let innerHTML = "";
        publicationsObj.chapters.forEach(el => {
            innerHTML = innerHTML.concat(createRow(el))
        })
        tbody.innerHTML = innerHTML;
    })
fetch("./data/publications/maps.txt")
    .then(response => response.text())
    .then(text => {
        publicationsObj.maps = parseText(text);
        let tbody = document.getElementById("maps").getElementsByTagName('tbody')[0];
        let innerHTML = "";
        publicationsObj.maps.forEach(el => {
            innerHTML = innerHTML.concat(createRow(el))
        })
        tbody.innerHTML = innerHTML;
    })
fetch("./data/publications/popular.txt")
    .then(response => response.text())
    .then(text => {
        publicationsObj.popular = parseText(text);
        let tbody = document.getElementById("popular").getElementsByTagName('tbody')[0];
        let innerHTML = "";
        publicationsObj.popular.forEach(el => {
            innerHTML = innerHTML.concat(createRow(el))
        })
        tbody.innerHTML = innerHTML;
    })
fetch("./data/publications/monograph.txt")
    .then(response => response.text())
    .then(text => {
        publicationsObj.monograph = parseText(text);
        let tbody = document.getElementById("monograph").getElementsByTagName('tbody')[0];
        let innerHTML = "";
        publicationsObj.monograph.forEach(el => {
            innerHTML = innerHTML.concat(createRow(el))
        })
        tbody.innerHTML = innerHTML;
    })
fetch("./data/publications/chapters_2.txt")
    .then(response => response.text())
    .then(text => {
        publicationsObj.chapters2 = parseText(text);
        let tbody = document.getElementById("chapters_2").getElementsByTagName('tbody')[0];
        let innerHTML = "";
        publicationsObj.chapters2.forEach(el => {
            innerHTML = innerHTML.concat(createRow(el))
        })
        tbody.innerHTML = innerHTML;
    })
fetch("./data/publications/other.txt")
    .then(response => response.text())
    .then(text => {
        publicationsObj.other = parseText(text);
        let tbody = document.getElementById("other").getElementsByTagName('tbody')[0];
        let innerHTML = "";
        publicationsObj.other.forEach(el => {
            innerHTML = innerHTML.concat(createRow(el))
        })
        tbody.innerHTML = innerHTML;
    })

parseText = text => {
    //create array in proper key in the publication object
    let array = [];

    //split text into array by lines
    let publicationsArray = text.split('\n')
    //for each new line get data
    publicationsArray.forEach(pub => {
        let obj = {};
        //trim whitespaces
        pub = pub.trim();
        //split text by dots
        let splittedDots = pub.split('.');
        //lp is just first element of array
        obj.lp = splittedDots[0];
        //split text by commas
        let splittedCommas = pub.split(',');
        //get array of authors from splitted text (they end with dot and it isn't last element)
        let authorsText = splittedCommas.filter((el, i) => (el.endsWith('.') || el.endsWith(')')) && splittedCommas.length - 1 !== i)
        //create array of authors
        let authors = [];

        authorsText.forEach((el, i) => {
            if (i === 0) {
                //remove lp and whitespaces from first element
                authors.push(el.replace(obj.lp + '.', '').trim());
            } else {
                //remove whitespaces from rest of elements
                authors.push(el.trim());
            }
        })

        //match pattern for redactor as and push him as author at the end
        let redactor = pub.match(/\[w:\].*?\(red\.\),/) ? pub.match(/\[w:\].*?\(red\.\),/)[0].slice(4, -1).trim() : null;
        if (redactor) authors.push(redactor)

        obj.authors = authors;
        let startsWithComma = splittedDots.filter(el => el.startsWith(','));
        //date will be last element starting with comma. Remove comma and whitespaces
        let date = startsWithComma[startsWithComma.length - 1]
            ?
            startsWithComma[startsWithComma.length - 1].replace(',', '').trim()
            :
            obj.lp === "88"
                ?
                "2005"
                :
                "-"
            ;
        obj.date = date;

        //title match creates array containg date, title, doi number and IF and MNiSW points
        let titleMatch = date + '\\.[\\s\\S]*'
        let regExTitle = new RegExp(titleMatch, "g");
        let titleSplitter = pub.match(regExTitle);
        let restOfData = titleSplitter ? titleSplitter[0] : null;

        if (restOfData) {
            //doi always start with well - doi
            let doiMatch = restOfData.match(/doi(.*?) \[/);
            let doi = doiMatch ? doiMatch[0].replace('[', '').trim() : false;
            obj.doi = doi;
            //points are always between square brackets
            let points = restOfData.match(/\[.*?\]/) ? restOfData.match(/\[.*?\]/)[0] : null;
            if (points) {
                if (points.includes(';')) {
                    obj.mnisw = (points.split(';')[0]).replace('[', '').trim();
                    obj.if = (points.split(';')[1]).replace(']', '').trim();
                } else {
                    if (points !== "[w:]") {
                        obj.mnisw =
                            points.includes("MNiSW")
                                ?
                                `${points.slice(1, 6)}<sub>${points.split('MNiSW')[1].split(" ")[0]}</sub>: ${points.split('MNiSW')[1].split(" ")[1]} pkt.`
                                :
                                `${points.slice(1, 4)}<sub>${points.split('KBN')[1].split(" ", 1)[0].trimRight(":")}</sub>: ${points.split('KBN')[1].split(" ")[1]} pkt.`
                    } else {
                        obj.if = false;
                        obj.mnisw = false;
                    }
                }
            } else {
                obj.if = false;
                obj.mnisw = false;
            }
            let title, magazine;
            //if pattern doesn't contain redactor then find title this way
            if (!redactor) {
                //title will be string between date and doi or points (if doi is null)
                //trim date from title
                title = restOfData.replace(date + '.', '').trim();
                // title = doi ? title.replace(doi, '').trim().replace(points, '').trim() : title.replace(points, '').trim();
                title = title.replace(points, '').trim();
                title = obj.doi ? title.replace(doi, '') : title;
                let titles = title.split('.');
                title = titles[0].trim();
                magazine = titles[1].trim();
            } else {
                console.log(`%c ${restOfData}`, 'color: red');
                console.log(restOfData.split(`${redactor}`)[0].slice(5, -7))
                title = restOfData.split(`${redactor}`)[0].slice(5, -7).trim();
                magazine = restOfData.split(`${redactor}`)[1].slice(1).trim();
            }
            obj.title = title;
            obj.magazine = magazine;
            //title may contain magazine title still in some cases
            if(!magazine){
                console.log(title);
                obj.title = title.split(',')[0];
                obj.magazine = title.split(',')[1];
            }
        } else {
            obj.title = pub.match(/2005\..*?\./)
            obj.magazine = pub.split('.')[pub.split('.').length - 1];
        }
        console.log(obj);
        array.push(obj);
    })
    return array;
}

createRow = (el, flag) => {
    return (
        flag
            ?
            `
            <tr>
                <td>${el.date}</td>
                <td>${el.title}</td>
                <td>${el.authors.join(", </br>")}</td>
                <td>${el.magazine}</td>
                <td>${el.doi ? el.doi : "-"}</td>
                <td>${el.mnisw ? el.mnisw : "-"}</td>
                <td>${el.if ? `${el.if.slice(0, 2)}<sub>${el.if.slice(2).split(':')[0]}</sub>:${el.if.split(':')[1]}` : "-"}</td>
            </tr>
        `
            :
            `
            <tr>
                <td onClick="sortBy('date', 'webOfScience', publicationsObj)">${el.date}</td>
                <td>${el.title}</td>
                <td>${el.authors.join(", </br>")}</td>
                <td>${el.magazine}</td>
            </tr>
        `
    )
}


sortBy = (sortingKey, tableKey, data) => {
    let array = data[tableKey];
    let table = document.getElementById(tableKey);
    let chev = table.querySelector(`[data-sort=${sortingKey}]`);
    chev.attributes['data-glyph'].value = chev.attributes['data-glyph'].value === "chevron-bottom" ? "chevron-top" : "chevron-bottom";
    //check if it's sorted already
    if (chev.attributes['data-glyph'].value === "chevron-bottom") {
        array = array.sort((a, b) => (
            a[sortingKey] < b[sortingKey]
                ?
                1
                :
                a[sortingKey] === b[sortingKey]
                    ?
                    0
                    :
                    -1
        )
        );
    } else {
        array = array.sort((a, b) => (
            a[sortingKey] > b[sortingKey]
                ?
                1
                :
                a[sortingKey] === b[sortingKey]
                    ?
                    0
                    :
                    -1
        ));
    }
    let tbody = document.getElementById(tableKey).getElementsByTagName('tbody')[0];
    let innerHTML = '';
    data[tableKey].forEach(el => {
        innerHTML =
            tableKey === "webOfScience" || tableKey === "outOfWebOfScience"
                ?
                innerHTML.concat(`
            <tr>
                <td onClick="sortBy('date', 'webOfScience', publicationsObj)">${el.date}</td>
                <td>${el.title}</td>
                <td>${el.authors.join(", </br>")}</td>
                <td>${el.magazine}</td>
                <td>${el.doi ? el.doi : "-"}</td>
                <td>${el.mnisw ? el.mnisw : "-"}</td>
                <td>${el.if ? `${el.if.slice(0, 2)}<sub>${el.if.slice(2).split(':')[0]}</sub>:${el.if.split(':')[1]}` : "-"}</td>
            </tr>
        `)
                :
                innerHTML.concat(`
            <tr>
                <td onClick="sortBy('date', 'webOfScience', publicationsObj)">${el.date}</td>
                <td>${el.title}</td>
                <td>${el.authors.join(", </br>")}</td>
                <td>${el.magazine}</td>
            </tr>
        `)
    })
    tbody.innerHTML = innerHTML;
}