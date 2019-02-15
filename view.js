

var subscribe = function (session, stream) {
  var insertOptions = {
    width: '100%',
    height: '100%',
    showControls: false
  };
  var name = stream.name;
  var insertMode = name === 'Host' ? 'before' : 'after';
  var properties = Object.assign({ name: name, insertMode: insertMode }, insertOptions);
  return session.subscribe(stream, 'hostDivider', properties, function (error) {
    if (error) {
      console.log(error);
    }
  });
};

var setEventListeners = function (session) {

  var streams = [];
  var subscribers = [];
  var broadcastActive = false;

  /** Subscribe to new streams as they are published */
  session.on('streamCreated', function (event) {
    streams.push(event.stream);
    subscribers.push(subscribe(session, event.stream));
    if (streams.length > 3) {
      document.getElementById('videoContainer').classList.add('wrap');
    }
  });

  session.on('streamDestroyed', function (event) {
    var index = streams.indexOf(event.stream);
    streams.splice(index, 1);
    if (streams.length < 4) {
      document.getElementById('videoContainer').classList.remove('wrap');
    }
  });
};

var getViewerToken = function (room) {
  var url = Config.serviceBasicUrl + 'api/guest/room/' + room;
  return new Promise((resolvd, reject) => {
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then(resolvd)
      .catch((err) => {
        if (err.status === 401 || err.status === 500) {
          reject(err);
        }
        err.json().then(reject);
      });
  });
}

var updateBanner = function (status) {
  var banner = document.getElementById('banner');
  var bannerText = document.getElementById('bannerText');

  if (status === 'active') {
    banner.classList.add('hidden');
  } else if (status === 'ended') {
    bannerText.classList.add('red');
    bannerText.innerHTML = 'The Broadcast is Over';
    banner.classList.remove('hidden');
  }
};