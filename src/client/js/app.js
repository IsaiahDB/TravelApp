const travelBtn = document.getElementById('destination-button')
//const formOne = document.getElementById('F1')
const formTwo = document.getElementById('F2')
const formThree = document.getElementById('F3')

// const geoUser = process.env.GEO_USER  
// const wApi = process.env.WEATHER_API_KEY   
// const pApi = process.env.PIXABY_API_KEY 

const wApi = '74c95ff83482407db3c55956cd979f60'
const pApi = '13827219-eabca8d6c1f49e20bd7fd6c27'
const geoUser = 'isaiah'


//http://api.geonames.org/searchJSON?username=maykeloenning&maxRows=10&q="
//http://api.geonames.org/searchJSON?q=london&maxRows=10&username=demo


let VacationData = {}

travelBtn.addEventListener('click', findDestion)


export async function findDestion(e) {
  e.preventDefault()
  let locationValue = document.getElementById('F1').value;
  await firstApi(locationValue);
  await postData(VacationData);
  console.log(VacationData);
}

const firstApi = async function(location) {
  const res = await fetch(`http://api.geonames.org/searchJSON?username=${geoUser}&maxRows=10&q=${location}`)
  const resJ = await res.json();
  const geoLat = Math.round(resJ.geonames[0].lat)
  const geoLng = Math.round(resJ.geonames[0].lng)
  const geoCountry = resJ.geonames[0].countryCode
  const geoName = resJ.geonames[0].name
  VacationData['LatGeo']  = geoLat
  VacationData['LngGeo']  = geoLng
  console.log(VacationData.LatGeo,VacationData.LngGeo)  
  return await secApi(geoLat,geoLng,geoName,geoCountry)
}

const secApi = async function(lat,lon,country,code) {
  const res = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&city=${country}&country=${code}&key=${wApi}&include=minutely`)
  const resJ = await res.json();
  const nameOfCity = resJ.data[0].city_name
  const codeOfCountry = resJ.data[0].country_code
  const weatherDes = resJ.data[0].weather.description
  const iconWeather = resJ.data[0].weather.icon
  const cityLatitude = Math.round(resJ.data[0].lat)
  const cityLongitude = Math.round(resJ.data[0].lon)
  VacationData['cityName'] = nameOfCity
  VacationData['countryCode'] = codeOfCountry
  VacationData['description'] = weatherDes
  VacationData['icon'] = iconWeather
  console.log(VacationData.cityName, VacationData.countryCode,VacationData.description,VacationData.icon)
  return await thirdApi(cityLatitude,cityLongitude,nameOfCity,codeOfCountry)
}

const thirdApi = async function(lat,lon,city,country) {
  const res = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&city=${city}&country=${country}&key=${wApi}`)
  const resJ = await res.json();
  const cityName = res.city_name
  const dayOne = res.data[0].weather.description
  const daySixteen = res.data[8].weather.description
  VacationData['dayOne'] = dayOne
  VacationData['daySixteen'] = daySixteen
  console.log(VacationData.dayOne,VacationData.daySixteen)
  return await fourthApi(cityName)

}

const fourthApi = async function(picLoc) {
  const res = await fetch(`https://pixabay.com/api/?key=${pApi}&q=${picLoc}&image_type=photo`)
  const resJ = await res.json()
  // if(resJ.hits[0].webformatURL === 'undefined'){
  //   VacationData['locationImage'] = "no photo"
  // } else {
  //   VacationData['locationImage'] = resJ.hits[0].webformatURL 
  // }
  VacationData['locationImage'] = resJ.hits[0].previewURL 
  console.log(VacationData.locationImage)
  return VacationData
}


async function postData(data) {
    console.log(data)
      const res = await fetch("http://localhost:8080/vactionData", {
        method: 'POST', 
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
       // Body data type must match "Content-Type" header        
        body: JSON.stringify({data:data}),
    });
    console.log(res)
    try {
      const newTravelData = await res.json();
      console.log(newTravelData);
      return newTravelData;
    }catch(error) {
      console.log("error", error);
    }
  
  }
  

