document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("flats-container");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const filterButtons = document.querySelectorAll('.btn-filter');
    const input_priceStart = document.getElementById('price-start');
    const input_priceEnd = document.getElementById('price-end');
    let flatsData = [];
    let filteredFlats = [];
    let currentIndex = 0;
    const flatsPerLoad = 4;
    let selectedRooms = null;
    let priceStart = 0;
    let priceEnd = 999999999;

    function createFlatCard(flat) {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-3 d-flex justify-content-center mb-4";
        const card = document.createElement("div");
        card.className = "flat-card px-4";
        const meterPrice = Math.round(flat.Price / flat.Area).toLocaleString('ru-RU');
        const totalPrice = flat.Price.toLocaleString('ru-RU');
        const rooms = flat.Rooms === 0 ? "Студия" : `${flat.Rooms} комнаты`;
        card.innerHTML = `
        <h1 class="mt-4">${rooms}, ${flat.Area} м<sup>2</sup></h1>
        <h1>${totalPrice}₽</h1>
        <p>или ${meterPrice} за м<sup>2</sup></p>
        <img class="flat-image flat-icon mt-3 mb-3" src="../assets/plans/${flat.Rooms}-${flat.Image}.png" alt="План квартиры" />
        <p class="mt-5">Корпус ${flat.Section}, этаж ${flat.Floor} из ${flat.FloorMax}</p>
        <p>Квартира №${flat.Number}</p>
        <div class="row d-flex justify-content-center">
        <button class="btn-rooms mb-3 center btn-details" data-id="${flat.Number}">Подробнее</button>
        </div>
        `;
        col.appendChild(card);
        return col;
    }

    input_priceStart.addEventListener("input", () => {
        priceStart = parseInt(input_priceStart.value,10);
        if(input_priceStart.value==""){
            priceStart=0;
        }
        applyFilter();
    });
    input_priceEnd.addEventListener("input", () => {
        priceEnd = parseInt(input_priceEnd.value,10);
        if(input_priceEnd.value==""){
            priceEnd=99999999;
        }
        applyFilter();
    });
    function applyFilter() {
        currentIndex = 0;
        if (selectedRooms === null) {
            filteredFlats = flatsData.filter(flat => flat.Price>priceStart && flat.Price<priceEnd);
        } else if (selectedRooms === 3) {
            filteredFlats = flatsData.filter(flat => flat.Rooms >= 3 && flat.Price>priceStart && flat.Price<priceEnd);
        } else {
            filteredFlats = flatsData.filter(flat => flat.Rooms === selectedRooms && flat.Price>priceStart && flat.Price<priceEnd);
        }
        container.innerHTML = "";
        loadFlats();
    }

    function applyPricingFilter() {
        filteredFlats = flatsData.filter(flat => flat.Rooms >= 3);
        container.innerHTML = "";
        loadFlats();
    }
    function loadFlats() {
        const nextFlats = filteredFlats.slice(currentIndex, currentIndex + flatsPerLoad);
        nextFlats.forEach(flat => {
        const card = createFlatCard(flat);
        container.appendChild(card);
    });

    currentIndex += flatsPerLoad;
    const detailButtons = container.querySelectorAll('.btn-details');
    detailButtons.forEach(button => {
    button.onclick = () => {
        const id = button.getAttribute('data-id');
        window.location.href = `../pug/flat.html?number=${id}`;
    };
    });
    if (currentIndex >= filteredFlats.length) {
        loadMoreBtn.style.display = "none";
    } else {
        loadMoreBtn.style.display = "inline-block";
    }
    }

    filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const rooms = parseInt(btn.getAttribute('flat-rooms'), 10);
        if(selectedRooms==rooms){
            selectedRooms = null;
            filterButtons.forEach(b => b.classList.remove('active'));
        }else{
            const rooms = parseInt(btn.getAttribute('flat-rooms'), 10);
            selectedRooms = rooms;
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
        applyFilter();
        });
    });

    fetch("data.json")
    .then(res => res.json())
    .then(data => {
        flatsData = data;
        applyFilter();
    });
    loadMoreBtn.addEventListener("click", loadFlats);
});
