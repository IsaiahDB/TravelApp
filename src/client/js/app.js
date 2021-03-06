const travelBtn = document.getElementById('destination-button')


const wApi = '74c95ff83482407db3c55956cd979f60';
const pApi = '13827219-eabca8d6c1f49e20bd7fd6c27';
const geoUser = 'isaiah';


let VacationData = {}

travelBtn.addEventListener('click', findDestion)

//Take vacation data and call six other functions.
export async function findDestion(e) {
  e.preventDefault()
  let locationValue = document.getElementById('F1').value;
  let LeaveDate = document.getElementById('F2').value
  let ReturnDate = document.getElementById('F3').value

  Client.checkDate(LeaveDate,ReturnDate);

  await firstApi(locationValue);
  await thirdApi(VacationData.city);
  await postData(VacationData);
  await Client.updateUi();
  console.log(VacationData);
}

//Function fetches geoname.org api and inputs data into VacationData object
const firstApi = async function(location) {
  const res = await fetch(`http://api.geonames.org/searchJSON?username=${geoUser}&maxRows=10&q=${location}`)
  const resJ = await res.json();
  const geoLat = Math.round(resJ.geonames[0].lat)
  const geoLng = Math.round(resJ.geonames[0].lng)
  const geoCountry = resJ.geonames[0].countryCode
  const geoName = resJ.geonames[0].name
  VacationData['city'] = geoName
  VacationData['country'] = geoCountry
  VacationData['lattitude']  = geoLat
  VacationData['longitutde']  = geoLng
  //console.log(VacationData.LatGeo,VacationData.LngGeo)  
  return await secApi(geoLat,geoLng,geoName,geoCountry)
}


//Function fetches weatherbit forecast api and inputs data into VacationData object
const secApi = async function(lat,lon,city,country) {
  const res = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&city=${city}&country=${country}&key=${wApi}`)
  const resJ = await res.json();
  let dateArray = resJ.data
  let dataLength = Number(dateArray.length - 1)
  console.log(dataLength, typeof(dataLength))
  const nameOfCity = resJ.data[0].city_name
  const weatherDes = resJ.data[0].weather.description
  const iconWeather = resJ.data[0].weather.icon
  const weatherDes2 = resJ.data[dataLength].weather.description
  const iconWeather2 = resJ.data[dataLength].weather.icon
  VacationData['description'] = weatherDes
  VacationData['icon'] = iconWeather
  VacationData['descriptionTwo'] = weatherDes2
  VacationData['iconTwo'] = iconWeather2
  //console.log(VacationData.des,VacationData.icon, VacationData.descriptionTwo)
  return VacationData
}

//Function fetches pixabay api and inputs data into VacationData object
const thirdApi = async function(picloc) {
  const res = await fetch(`https://pixabay.com/api/?key=13827219-eabca8d6c1f49e20bd7fd6c27&q=${picloc}&image_type=photo`)
  
  const resJ = await res.json()
  if(resJ.hits[0].previewURL === 'undefined'){
    VacationData['imageloc'] = 'no photo'
  } else {
    VacationData['imageloc'] = resJ.hits[0].previewURL 
  } 
  console.log(VacationData.imageloc)
  return VacationData
}
//Function fetches projectdata endpoint from server
async function postData(data) {
    console.log(data)
      const res = await fetch("http://localhost:8080/vactionData", {
        method: 'POST', 
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
       
        body: JSON.stringify(data),
    });
    console.log(res)
    try {
      const newTravelData = await res.json();
      return newTravelData;
    }catch(error) {
      console.log("error", error);
    }
  
  }
  

