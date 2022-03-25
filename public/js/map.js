ymaps.ready(init);
function init() {
  const { geolocation } = ymaps;
  const myMap = new ymaps.Map('map', {
    center: [55, 34],
    zoom: 10,
    controls: ['routePanelControl'],
  }, {
    searchControlProvider: 'yandex#search',
  });

  geolocation.get({
    provider: 'yandex',
    mapStateAutoApply: true,
  }).then((result) => {
    result.geoObjects.options.set('preset', 'islands#redCircleIcon');
    result.geoObjects.get(0).properties.set({
      balloonContentBody: 'Мое местоположение',
    });
    myMap.geoObjects.add(result.geoObjects);
  });

  if (poleVvoda[0].id === 'info' || poleVvoda[0].id === 'edit') {
    console.log('---------------')
  } else {
    geolocation.get({
      provider: 'browser',
      mapStateAutoApply: true,
    }).then((result) => {
      result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
      myMap.geoObjects.add(result.geoObjects);
    });
  }

  const multiRoute = new ymaps.multiRouter.MultiRoute({
    referencePoints: [obj.start || 'Москва, метро Сокол', obj.end || 'Москва, метро Павелецкая'],
  });

  myMap.geoObjects.add(multiRoute);
  const control = myMap.controls.get('routePanelControl');
  control.routePanel.state.set({
    type: 'bicycle',
  });

  control.routePanel.options.set({
    types: {
      pedestrian: true,
      bicycle: true,
      taxi: true,
    },
  });
}
