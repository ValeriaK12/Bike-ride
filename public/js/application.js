const selector = document.getElementsByName('differentSort')[0];
const routesList = document.getElementsByClassName('routes')[0];
const infoBtn = [...document.getElementsByClassName('btnInfo')];
const btnSubmitComment = document.getElementsByName('submit_btn')[0];
const selectorRating = document.getElementsByName('selectorRating')[0];
const commentMessage = document.getElementsByName('message')[0];
const infoWayOne = [...document.getElementsByClassName('mainConteiner')];
const btnEditProfile = [...document.getElementsByClassName('btnEditProfile')];
const btnEnterEditProfile = [...document.getElementsByClassName('btnEnterEditProfile')];
const poleVvoda = document.getElementsByClassName('poleVvoda');
const comentList = document.getElementById('comentList');
const coordInfo = document.getElementsByClassName('coordInfo');

const arr5 = coordInfo[0]?.id
const obj = {
  start: arr5?.split('/')[0].replace('_', ', ') || 'Москва, метро Сокол',
  end: arr5?.split('/')[1].replace('_', ', ') || 'Москва, метро Павелецкая',
  dist: arr5?.split('/')[2] || 'расстояние не определено'
};

const wayImage = document.getElementById('wayImage');
const wayTitle = document.getElementById('wayTitle');
const wayCity = document.getElementById('wayCity');
const wayText = document.getElementById('wayText');
const btnNewWay = [...document.getElementsByClassName('btnNewWay')];
const btnEditWay = [...document.getElementsByClassName('btnEditWay')];

selector?.addEventListener('click', async () => {
  const response = await fetch(`/ways/sort/${selector.value}`, {
    method: "GET", credentials: 'include'
  });

  const { ways } = await response.json();
  routesList.innerHTML = '';
  ways.forEach(way => routesList.innerHTML += renderWayList(way));
  infoBtn = [...document.getElementsByClassName('btnInfo')];
  infoBtn?.forEach((el, index) => {
    el.addEventListener('click', () => {
      window.location = `/ways/${el.id}`;
    });
  });
});

infoBtn?.forEach((el, index) => {
  el.addEventListener('click', () => {
    window.location = `/ways/${el.id}`;
  });
});

function deletComment() {
  const delComment = [...document.getElementsByClassName('delComment')];
  const commentList = [...document.getElementsByClassName('commentList')];
  delComment.forEach((del, ind) => {
    del.addEventListener('click', async (event) => {
      event.preventDefault();
      const response = await fetch(del.href, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { delet } = await response.json();
      if (delet) commentList[ind].parentNode.removeChild(commentList[ind]);
      deletComment();
    });
  });
}
deletComment()

btnSubmitComment?.addEventListener('click', async () => {
  const ratingAll = document.getElementById('ratingAll');
  const response = await fetch('/ways/comment', {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      rating: selectorRating.value,
      text: commentMessage.value,
      way_id: infoWayOne[0].id
    })
  });
  const { newComment, newRating } = await response.json();
  ratingAll.textContent = newRating;
  comentList.innerHTML = renderNewComment(newComment) + comentList.innerHTML;
  commentMessage.value = '';
  selectorRating.value = 5;
  deletComment();
})


btnEditProfile[0]?.addEventListener('click', () => {
  window.location = `/user/edit/${btnEditProfile[0].id}`
})


btnEnterEditProfile[0]?.addEventListener('click', async () => {
  const formControl = [...document.getElementsByClassName('form-control')]
  const aboutMeInput = document.getElementById('about_me');

  const response = await fetch(`/user/edit/${btnEnterEditProfile[0].id}`, {
    method: "PUT",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      city: formControl[2].value,
      bike: formControl[0].value,
      about_me: aboutMeInput.value,
      user_id: btnEnterEditProfile[0].id,
      age: formControl[1].value,
      role: undefined || "user"
    })
  });
  const { } = await response.json();
  window.location = `/user/${btnEnterEditProfile[0].id}`
})

function addAdmin() {
  const adm = document.getElementById('adm')
  let btnToAddAdmin = [...document.getElementsByClassName('btnToAddAdmin')];
  let btnToDelAdmin = [...document.getElementsByClassName('btnToDelAdmin')];

  btnToAddAdmin[0]?.addEventListener('click', async () => {
    const id = btnToAddAdmin[0].id;

    const response = await fetch(`/user/admin/${btnToAddAdmin[0].id}`, {
      method: "PUT",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: id,
        role: "admin"
      })
    });

    const { user } = await response.json();

    if (user) {
      adm.innerHTML = `<button id="${id}" class="btn btnToDelAdmin">Удалить права администратора</button>`
      btnToDelAdmin = [...document.getElementsByClassName('btnToDelAdmin')];
      addAdmin();
      console.log(`Пользователю ${id} Добавлены права администратора`)
    }
  })

  btnToDelAdmin[0]?.addEventListener('click', async () => {
    const id = btnToDelAdmin[0].id;

    const response = await fetch(`/user/admin/${btnToDelAdmin[0].id}`, {
      method: "PUT",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: id,
        role: "user"
      })
    });

    const { user } = await response.json();

    if (user) {
      adm.innerHTML = `<button id="${id}" class="btn btnToAddAdmin">Установить права администратора</button>`
      btnToAddAdmin = [...document.getElementsByClassName('btnToAddAdmin')];
      addAdmin();
      console.log(`У пользователя ${id} удалены права администратора`)
    }
  })
}

addAdmin()
