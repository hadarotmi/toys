const init = () => {
    getAllList()
    getBySearchName()
    getByPrice()
    getByCaterory()
    getById()
}
const getAllList = async () => {
    let url = "http://localhost:3002/toys/all";
    let resp = await axios.get(url);
    doGetApi(resp,"#allToys")
}

const getBySearchName = async () => {
    let url = "http://localhost:3002/toys/search?s=car";
    let resp = await axios.get(url);
    doGetApi(resp,"#shearchName")
}

const getByPrice = async () => {
    let url = "http://localhost:3002/toys/price?min=35&max=60";
    let resp = await axios.get(url);
    doGetApi(resp,"#price")
}

const getByCaterory = async () => {
    let url = "http://localhost:3002/toys/category/strategy";
    let resp = await axios.get(url);
    doGetApi(resp,"#category")
}

const getById = async () => {
    let url = "http://localhost:3002/toys/single/647c38297bb0d9ed415e2922";
    let resp = await axios.get(url);
    doGetApi(resp,"#singleId")
}

const doGetApi=(resp,parent)=>{
    const json = JSON.stringify(resp.data, null, 2);
    const codeElement = document.createElement("code");
    codeElement.innerHTML = json;

    const preElement = document.createElement("pre");
    preElement.className=" rounded-4 shadow"
    preElement.appendChild(codeElement);

    const allToysElement = document.querySelector(parent);
    allToysElement.innerHTML = "";
    allToysElement.appendChild(preElement);

}
init();