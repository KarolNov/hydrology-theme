//create object which will contain all publications
const publicationsObj = {};

//fetch data from txt file
fetch("http://localhost:8080/demo/data/publications/webOfScience.txt")
.then( response => response.text() )
.then( text => {
    //create array in proper key in the publication object
    publicationsObj.webOfScience = [];

    //split text into array by lines
    let publicationsArray = text.split('\n')
    //for each new line get data
    publicationsArray.forEach(pub=>{
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
        let authorsText = splittedCommas.filter((el,i)=>el.endsWith('.')&&splittedCommas.length-1!==i)
        //create array of authors
        let authors = [];
        authorsText.forEach((el,i)=>{
            if(i===0){
                //remove lp and whitespaces from first element
                authors.push(el.replace(obj.lp+'.', '').trim());
            }else{
                //remove whitespaces from rest of elements
                authors.push(el.trim());
            }
        })
        obj.authors = authors;

        let startsWithComma = splittedDots.filter(el=>el.startsWith(','));
        //date will be last element starting with comma. Remove comma and whitespaces
        let date = startsWithComma[startsWithComma.length-1].replace(',','').trim();
        obj.date = date;

        //title match creates array containg date, title, doi number and IF and MNiSW points
        let titleMatch = date+'\\.[\\s\\S]*'
        let regExTitle = new RegExp(titleMatch, "g");
        let titleSplitter = pub.match(regExTitle);
        let restOfData = titleSplitter[0];

        //doi always start with well - doi
        let doiMatch = restOfData.match(/doi(.*?) \[/);
        let doi = doiMatch ? doiMatch[0].replace('[', '').trim() : false;
        obj.doi = doi;

        //points are always between square brackets
        let points = restOfData.match(/\[.*?\]/)[0];
        obj.mnisw = (points.split(';')[0]).replace('[', '').trim();
        obj.if = (points.split(';')[1]).replace(']', '').trim();

        //title will be string between date and doi or points (if doi is null)
        //trim date from title
        let title = restOfData.replace(date+'.', '').trim();
        // title = doi ? title.replace(doi, '').trim().replace(points, '').trim() : title.replace(points, '').trim();
        title = title.replace(points, '').trim();
        title = obj.doi ? title.replace(doi, '') : title;
        let titles = title.split('.');
        title = titles[0].trim();
        let magazine = titles[1].trim();
        
        obj.title = title;
        obj.magazine = magazine;

        publicationsObj.webOfScience.push(obj);
    })

    console.log(publicationsObj)
})