
window.onload = ()=>{

    const collapse = Array.from(document.getElementsByClassName('collapse'));

    collapse.forEach(el=>{
        el.onclick = (e)=>{
            //show proper side page
            let targetId = e.target.id;
            document.getElementById(`${targetId}_content`).style.display = "block";
            //animate transition between pages
            document.getElementById('mainPage').className = 'hidden';
            document.getElementById('sidePage').className = 'show';
        };
    })
}