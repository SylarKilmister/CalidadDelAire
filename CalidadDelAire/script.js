const errorLabel = document.querySelector("label[for='error-msg']")
const latInp = document.querySelector("#latitude")
const lonInp = document.querySelector("#longitude")
const airQuality = document.querySelector(".air-quality")
const airQualityStat = document.querySelector(".air-quality-status")
const srchBtn = document.querySelector(".search-btn")
const componentsEle = document.querySelectorAll(".component-val")

const appId = "55e48c131c785613469177f6475add91" 
const link = "https://api.openweathermap.org/data/2.5/air_pollution"	// API end point

const getUserLocation = () => {
	// Obtener ubicacion del usuario
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onPositionGathered, onPositionGatherError)
	} else {
		onPositionGatherError({ message: "No puedo acceder a su ubicación. Ingrese sus coordenadas" })
	}
}

const onPositionGathered = (pos) => {
	let lat = pos.coords.latitude.toFixed(4), lon = pos.coords.longitude.toFixed(4)

	// Establecer valores de entrada para que la usuario sepa
	latInp.value = lat
	lonInp.value = lon

	// Obtener datos aéreos de la API meteorológica
	getAirQuality(lat, lon)
}

const getAirQuality = async (lat, lon) => {
	// Obtener datos de api
	const rawData = await fetch(`${link}?lat=${lat}&lon=${lon}&appid=${appId}`).catch(err => {
		onPositionGatherError({ message: "Algo salió mal. Comprueba tu conexión a internet." })
		console.log(err)
	})
	const airData = await rawData.json()
	setValuesOfAir(airData)
	setComponentsOfAir(airData)
}

const setValuesOfAir = airData => {
	const aqi = airData.list[0].main.aqi
	let airStat = "", color = ""

	// Establecer índice de calidad del aire
	airQuality.innerText = aqi

	// Establecer el estado de la calidad del aire

	switch (aqi) {
		case 1:
			airStat = "Buena"
			color = "rgb(19, 201, 28)"
			break
			case 2:
				airStat = "Pasable"
				color = "rgb(15, 134, 25)"
				break
			case 3:
				airStat = "Moderada"
				color = "rgb(201, 204, 13)"
				break
			case 4:
				airStat = "Pobre"
				color = "rgb(204, 83, 13)"
				break
		case 5:
			airStat = "Muy Pobre"
			color = "rgb(204, 13, 13)"
			break
		default:
			airStat = "Desconocida"
	}

	airQualityStat.innerText = airStat
	airQualityStat.style.color = color
}

const setComponentsOfAir = airData => {
	let components = {...airData.list[0].components}
	componentsEle.forEach(ele => {
		const attr = ele.getAttribute('data-comp')
		ele.innerText = components[attr] += " μg/m³"
	})
}

const onPositionGatherError = e => {
	errorLabel.innerText = e.message
}

srchBtn.addEventListener("click", () => {
	getAirQuality(parseFloat(latInp.value).toFixed(4), parseFloat(lonInp.value).toFixed(4))
})

getUserLocation()