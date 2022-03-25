const arrCoord = []

const time = setInterval(() => {
  const input = [...document.getElementsByClassName('ymaps-2-1-79-route-panel-input__input')];
  if (input.length
    && input[0].value !== `<empty string>`
    && input[0].value !== '') {
    let x, y;
    x = input[0].value.split(',').map(el => parseFloat(el));
    if (!isNaN(x[0])) arrCoord.push(x);
    if (input.length && input[1].value !== `<empty string>` && input[1].value !== '') {
      y = input[1].value.split(',').map(el => parseFloat(el));
      if (y[0]) arrCoord.push(y);
      clearInterval(time);
      btnNewWay[0]?.addEventListener('click', () => {
        createEntryesWay(arrCoord);
      })
    }
  }
}, 100);

async function createEntryesWay(arrCoord = []) {
  const distance = [...document.getElementsByClassName('ymaps-2-1-79-transport-pin__text')];
  const dataNewWay = {
    wayTitle: wayTitle.value,
    wayCity: wayCity.value,
    wayImage: wayImage.value,
    wayText: wayText.value,
    xy1: arrCoord[0],
    xy2: arrCoord.pop(),
    distance: distance[0]?.textContent || 0
  }

  const response = await fetch('/ways/new', {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataNewWay)
  });

  const { newWay } = await response.json();

  window.location = `/ways/${newWay.id}`;
}

const arrCoordEdit = []
const timeEdit = setInterval(() => {
  const inputEdit = [...document.getElementsByClassName('ymaps-2-1-79-route-panel-input__input')];
  if (inputEdit.length && inputEdit[0].value !== `<empty string>`
    && inputEdit[0].value !== '') {
    let xEdit, yEdit;
    xEdit = inputEdit[0].value.split(',').map(el => parseFloat(el));
    if (!isNaN(xEdit[0])) arrCoordEdit.push(xEdit);
    if (inputEdit.length && inputEdit[1].value !== `<empty string>` && inputEdit[1].value !== '') {
      yEdit = inputEdit[1].value.split(',').map(el => parseFloat(el));
      if (yEdit[0]) arrCoordEdit.push(yEdit)
      clearInterval(timeEdit);
      btnEditWay[0]?.addEventListener('click', () => {
        editEntryesWay(arrCoordEdit);
      })
    }
  }
}, 100);

async function editEntryesWay(arrCoordEdit = []) {
  const distanceEdit = [...document.getElementsByClassName('ymaps-2-1-79-transport-pin__text')];
  const dataWayEdit = {
    id: btnEditWay[0].id,
    wayTitle: wayTitle.value,
    wayCity: wayCity.value,
    wayImage: wayImage.value,
    wayText: wayText.value,
    xy1: arrCoordEdit[0] || obj.start,
    xy2: arrCoordEdit.pop() || obj.end,
    distance: distanceEdit[0]?.textContent || obj.dist || 0,
  }

  const response = await fetch(`/ways/edit/${btnEditWay[0].id}`, {
    method: "PUT",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataWayEdit)
  });

  const { way } = await response.json();

  window.location = `/ways/${btnEditWay[0].id}`;
}
