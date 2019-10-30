async function updateCrew() {
    const response = await fetch(`/crew`);
    let crew = await response.json();
    if (!crew.success) {
        console.error('Failed to fetch!');
    } else {
        crew = crew.data[0];
        document.querySelector('#cc').innerHTML = crew.CC;
        document.querySelector('#driver').innerHTML = crew.Driver;
        document.querySelector('#rider1').innerHTML = crew.Rider1;
        document.querySelector('#rider2').innerHTML = crew.Rider2;
        console.log(crew);
    }
}

updateCrew();

setInterval(async () => {
    updateCrew();
}, 60000);
