document.addEventListener("DOMContentLoaded", () => {
  const element_flatNumber = document.getElementById("flat_number");
  const element_flatSection = document.getElementById("flat_section");
  const element_flatFloor = document.getElementById("flat_floor");
  const element_flatRooms = document.getElementById("flat_rooms");
  const element_flatArea = document.getElementById("flat_area");
  const element_flatAreaLiving = document.getElementById("flat_areaLiving");
  const element_flatAreaKitchen = document.getElementById("flat_areaKitchen");
  const element_flatPrice = document.getElementById("flat_price");
  const element_flatMeterPrice = document.getElementById("flat_meterPrice");
  const element_image = document.getElementById("flat_plan");
  const params = new URLSearchParams(location.search);
  const number = params.get("number");
  fetch('data.json')
    .then(response => {
      if (!response.ok) throw new Error('Ошибка загрузки файла');
      return response.json();
    })
    .then(flats => {
      const flat = flats.find(f => f.Number == number);
      if (flat) {
        element_flatNumber.innerHTML = `Квартира №${flat.Number}`;
        if(flat.Rooms==0){
            element_flatRooms.innerHTML = `Студия`;
        }else{
            element_flatRooms.innerHTML = `${flat.Rooms}`;
        }
        element_flatSection.innerHTML = `${flat.Section}`;
        element_flatFloor.innerHTML = `${flat.Floor} из ${flat.FloorMax}`;
        element_flatArea.innerHTML = `${flat.Area} м<sup>2</sup>`;
        element_flatAreaLiving.innerHTML = `${flat.AreaLiving} м<sup>2</sup>`;
        element_flatAreaKitchen.innerHTML = `${flat.AreaKitchen} м<sup>2</sup>`;
        element_image.src=`../assets/plans/${flat.Rooms}-${flat.Image}.png`;
        let priceFormatted = flat.Price.toLocaleString('ru-RU');
        element_flatPrice.innerHTML = `${priceFormatted} ₽`;
        let meterPrice = Math.round(flat.Price / flat.Area).toLocaleString('ru-RU');
        element_flatMeterPrice.innerHTML = `${meterPrice} ₽/м<sup>2</sup>`;
      } else {
        element_flatNumber.textContent = "Квартира не найдена";
      }
    })
    .catch(error => {
      console.error(error);
      element_flatNumber.textContent = "Ошибка при загрузке данных";
    });
});