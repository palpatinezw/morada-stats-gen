async function newNation() {
    const data = JSON.stringify({
        name: "Empire of Sikret", 
        shortName: "Sikret",
        stats:JSON.stringify({S:1, E:1}),
    })

    console.log("DATA", data)
    fetch('/nationsapi/new_nation', {
        method: "POST",
        mode:"cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: data,
    }).then((res) => {
        return res.json
    }).then((data) => {
        console.log(data)
    })
}

async function getNations() {
    fetch('/nationsapi/nations', {
        method: "GET",
        mode:"cors",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => {
        return res.json
    }).then((data) => {
        console.log(data)
    })
}