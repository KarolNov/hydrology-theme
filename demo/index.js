
window.onload = () => {
    setTimeout(() => {
        let loader = document.getElementById("loading");
        loader.style.display = "none";
    }, 2000);

    const nav = Array.from(document.getElementsByClassName('nav'));
    nav.forEach(el => {
        el.onclick = (e) => {
            //if id is back then show main page
            console.log(e.target.id);
            let targetId = e.target.id;
            if (targetId === "back") {
                //animate transition between pages
                document.getElementById('mainPage').className = 'shown';
                document.getElementById('sidePage').className = 'hidden';
            } else {
                //hide previously shown side page
                let sidePages = Array.from(document.getElementsByClassName('sidePageContent'));
                sidePages.forEach(page => {
                    page.style.display = "none";
                })
                //show proper side page
                document.getElementById(`${targetId}_content`).style.display = "block";
                document.getElementById(`${targetId}_content`).style.display = "block";
                //animate transition between pages
                document.getElementById('mainPage').className = 'hidden';
                document.getElementById('sidePage').className = 'shown';
            }
        };
    })

    const tabs = Array.from(document.getElementsByClassName("tab"));
    console.log(tabs);
    tabs.forEach(el=>{
        console.log(el);
        el.onclick = (e)=>{
            Array.from(el.getElementsByTagName('span')).forEach(el=>{
                el.attributes['data-glyph'].value = el.attributes['data-glyph'].value === "chevron-bottom" ? "chevron-top" : "chevron-bottom";
            })
            let target = e.target.attributes.target.nodeValue;
            target = document.getElementById(target);
            target.style.height = target.style.height==="0" ? "fit-content" : "0";
            target.style.display = target.style.display==="table" ? "none" : "table";
            if(target.style.display === "table"){
                let table = document.getElementById("publicationsTable");
                    //check if scroll is needed
                    if (el.parentElement.offsetWidth < target.offsetWidth) {
                        console.log("scroll needed")
                        //after the site is fully visible show information modal and start fading it
                        let inform = document.getElementById("publicationsModal");
                        inform.style.display = "block";
                        setTimeout(() => {
                            inform.style.opacity = 1;
                        }, 800);
                        //then show it for 2 sec
                        setTimeout(() => {
                            inform.style.opacity = 0;
                        }, 2800);
                        //and hide it completly after transition is done
                        setTimeout(() => {
                            inform.style.display = "none";
                        }, 3600);
                    }
            }
        }
    })
}