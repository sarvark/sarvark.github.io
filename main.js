const userImgInput = document.querySelector('.user_image');

let width = 320; // Этим создадим ширину фотографии
let height = 0; // Это будет вычисляться на основе входящего потока

let streaming = false;

let video = null;
let canvas = null;
let photo = null;
let stream = null;
let startbutton = null;
let facingMode = 'user';

async function startCamera() {
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  photo = document.getElementById('photo');
  startbutton = document.getElementById('startbutton');

  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: facingMode,
    },
  });

  video.srcObject = stream;
  video.play();

  video.addEventListener(
    'canplay',
    function (ev) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    },
    false,
  );

  startbutton.addEventListener(
    'click',
    function (ev) {
      takepicture();
      ev.preventDefault();
    },
    false,
  );

  clearphoto();
}

function clearphoto() {
  var context = canvas.getContext('2d');
  context.fillStyle = '#AAA';
  context.fillRect(0, 0, canvas.width, canvas.height);

  var data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
}

function takepicture() {
  var context = canvas.getContext('2d');
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);

    const list = new DataTransfer();
    const file = new File(['image'], data);
    list.items.add(file);
    userImgInput.files = list.files;
  } else {
    clearphoto();
  }
}

function stopCamera() {
  stream.getTracks().forEach((track) => track.stop());

  stream = null;
}

function flipCamera() {
  stopCamera();

  if (facingMode == 'environment') {
    facingMode = 'user';
  } else {
    facingMode = 'environment';
  }

  startCamera();
}

window.addEventListener('load', startCamera, false);
