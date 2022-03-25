function renderWayList(way) {
  return `
  <div class="rout" id="${way.id}">
    <img src="${way.url_img}" alt="sfgdsfghfd" class="img" width="200px"
      height="200px">
    <h3>${way.title}</h3>
    <button class="btn btnInfo" id="${way.id}">Посмотреть</button>
    <p>Рейтинг: ${way.rating}</p>
    <p>Расстояние: ${way.distance}</p>
  </div>
  `
}

function renderNewComment(newComment) {
  return `
  <li class="commentList">
    <div id="comment"></div>
      <h3><b><a style="color: rgb(20, 18, 48);" href="/user/${newComment.user_id}">${newComment.username}</a></b></h3> 
      <span>Оценка: ${newComment.rating}</span>
      <p class="pshka">${newComment.text}</p>
      <a class="delComment" style="color: rgb(20, 18, 48);" href="/ways/comment/delete/${newComment.id}">Удалить комментарий </a> 
  </li>`
}

