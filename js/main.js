'use strict';

var messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var names = [
  'Иван Охлобыстин',
  'Ольга Бузова',
  'Женя Минаев',
  'Алексей Навальный',
  'Дмитрий Медведев',
  'Саша Толмачев',
  'Костя Синдин'
];

var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var picturesUsersElement = document.querySelector('.pictures');
var pictureUserTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');


var arrayUsers = [];

var renderArrayComments = function () {
  var quantityComments = getRandomInRange(1, 5);
  var arrayComments = [];
  for (var z = 0; z < quantityComments; z++) {
    arrayComments[z] = {
      avatar: 'img/avatar-' + getRandomInRange(1, 6) + '.svg',
      messages: messages[getRandomInRange(0, 5)],
      name: names[getRandomInRange(0, 6)],
    };
  }
  return arrayComments;
};

for (var i = 0; i < 25; i++) {
  arrayUsers[i] = {
    url: 'photos/' + (i + 1) + '.jpg',
    description: '',
    likes: getRandomInRange(15, 200),
    comments: renderArrayComments,
    name: names[getRandomInRange(0, 6)]
  };
}

var renderFoto = function (namber) {
  var userElement = pictureUserTemplate.cloneNode(true);
  userElement.querySelector('.picture__img').src = arrayUsers[namber].url;
  userElement.querySelector('.picture__likes').textContent = arrayUsers[namber].likes;
  userElement.querySelector('.picture__comments').textContent = arrayUsers[namber].comments().length;
  return userElement;
};

var fragment = document.createDocumentFragment();

for (var l = 0; l < 25; l++) {
  fragment.appendChild(renderFoto(l));
}

picturesUsersElement.appendChild(fragment);

var resultArrayComment = arrayUsers[0].comments();
var bigPictureUsers = document.querySelector('.big-picture');
var socialComments = bigPictureUsers.querySelector('.social__comments');
var socialComment = bigPictureUsers.querySelector('.social__comment');

var renderComment = function (avatarCommit) {
  var userSocialCommit = socialComment.cloneNode(true);
  userSocialCommit.querySelector('img').src = resultArrayComment[avatarCommit].avatar;
  userSocialCommit.querySelector('img').alt = resultArrayComment[avatarCommit].name;
  userSocialCommit.querySelector('.social__text').textContent = resultArrayComment[avatarCommit].messages;
  return userSocialCommit;
};

var showPicture = function () {

  bigPictureUsers.querySelector('.likes-count').textContent = arrayUsers[0].likes;
  bigPictureUsers.querySelector('.comments-count').textContent = resultArrayComment.length;
  bigPictureUsers.querySelector('.social__caption').textContent = arrayUsers[0].description;

  var bigPictureUsersImg = bigPictureUsers.querySelector('.big-picture__img');
  bigPictureUsersImg.querySelector('img').src = arrayUsers[0].url;

  var fragment2 = document.createDocumentFragment();
  for (var c = 0; c < resultArrayComment.length; c++) {
    fragment2.appendChild(renderComment(c));
  }
  socialComments.appendChild(fragment2);

  bigPictureUsers.querySelector('.social__comment-count').classList.add('hidden');
  bigPictureUsers.querySelector('.comments-loader').classList.add('hidden');
  bigPictureUsers.classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
};

// showPicture();

var ESC_KEY = 'Escape';

var imgUpload = document.querySelector('.img-upload');
var uploadFile = document.querySelector('#upload-file');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var uploadCancel = document.querySelector('#upload-cancel');
var scaleControlSmaller = imgUpload.querySelector('.scale__control--smaller');
var scaleControlBigger = imgUpload.querySelector('.scale__control--bigger');
var scaleControlValue = imgUpload.querySelector('.scale__control--value');
var imgUploadPreview = imgUpload.querySelector('.img-upload__preview');
var effectsRadios = document.querySelectorAll('.effects__radio');
var filterValue;
var effectLevelPin = document.querySelector('.effect-level__pin');
var effectLevelValue = document.querySelector('.effect-level__value');
var imgUploadPreviewImg = document.querySelector('.img-upload__preview').querySelector('img');

// Как правильно "обнулить" данные при закрытии? Ниже написаны два блока кода, чтобы при закрытии и повторном открытии данные не сохранялись.

var onImgUploadClick = function () {
  imgUploadOverlay.classList.add('hidden');
  document.querySelector('body').classList.remove('modal-open');
  uploadFile.value = '';
  imgUploadPreview.style = '100%';
  scaleControlValue.value = '100%';
  imgUploadPreview.classList = 'img-upload__preview effects__preview--none';
  imgUploadPreviewImg.removeAttribute('style');
  uploadCancel.removeEventListener('click', onImgUploadClick);
  imgUpload.removeEventListener('keydown', onKeydownEsc);
};

var onImgUploadKeydown = function () {
  imgUploadOverlay.classList.add('hidden');
  document.querySelector('body').classList.remove('modal-open');
  uploadFile.value = '';
  imgUploadPreview.style = '100%';
  scaleControlValue.value = '100%';
  imgUploadPreview.classList = 'img-upload__preview effects__preview--none';
  imgUploadPreviewImg.removeAttribute('style');
  uploadCancel.removeEventListener('click', onImgUploadClick);
  imgUpload.removeEventListener('keydown', onKeydownEsc);
};

var onUploadFileClick = function () {
  imgUploadOverlay.classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open'); //Что делает класс 'modal-open'? Это чтобы окно не двигалось при прокручивание колесика?
  uploadCancel.addEventListener('click', onImgUploadClick);
  imgUpload.addEventListener('keydown', onKeydownEsc);
};

var onKeydownEsc = function (evt) {
  if (evt.key === ESC_KEY) {
    onImgUploadKeydown();
  }
};

// Изменение масштаба изображения.

var imgUploadPreviewTransform = function () {
  imgUploadPreview.style = 'transform: scale(' + parseInt(scaleControlValue.value, 10) / 100 + ')';
};

var onScaleControlSmallerClick = function () {
  scaleControlValue.value = parseInt(scaleControlValue.value, 10) - 25 + '%';
};

var onScaleControlBiggerClick = function () {
  scaleControlValue.value = parseInt(scaleControlValue.value, 10) + 25 + '%';
};

uploadFile.addEventListener('change', onUploadFileClick);

scaleControlSmaller.addEventListener('click', function () {
  if (parseInt(scaleControlValue.value, 10) > 25) {
    onScaleControlSmallerClick();
  }
  imgUploadPreviewTransform();
});

scaleControlBigger.addEventListener('click', function () {
  if (parseInt(scaleControlValue.value, 10) < 76) {
    onScaleControlBiggerClick();
  }
  imgUploadPreviewTransform();
});

// Применение фильтров для картинки.

var onEffectRadios = function (evt) {
  filterValue = evt.target.value;
  // Можно ли так обновлять классы? Если я просто добавлю один класс, то при каждом нажатие количество классов будет увеличиваться?
  imgUploadPreview.classList = 'img-upload__preview effects__preview--' + filterValue;
  if (filterValue === 'none') {
    imgUploadPreviewImg.removeAttribute('style');
  }
};

for (var l = 0; l < effectsRadios.length; l++) {
  effectsRadios[l].addEventListener('click', onEffectRadios);
}

var onEffectLevelPin = function (evt) {

  effectLevelValue.value = evt.clientX / 4090 * 100;
  var proporciy = effectLevelValue.value;
  var filterName;
  if (filterValue === 'none') {
    imgUploadPreviewImg.removeAttribute('style');
    return;
  }
  if (filterValue === 'chrome') {
    filterName = 'filter: grayscale(' + proporciy / 100 + ')';
  }
  if (filterValue === 'sepia') {
    filterName = 'filter: sepia(' + proporciy / 100 + ')';
  }
  if (filterValue === 'marvin') {
    filterName = 'filter: invert(' + proporciy + '%)';
  }
  if (filterValue === 'phobos') {
    filterName = 'filter: blur(' + proporciy / 100 * 3 + 'px)';
  }
  if (filterValue === 'heat') {
    filterName = 'filter: brightness(' + proporciy / 100 * 3 + ')';
  }

  imgUploadPreviewImg.setAttribute('style', filterName);
};

effectLevelPin.addEventListener('mouseup', function (evt) {
  onEffectLevelPin(evt);
});

// Валидация хэштегов.

var MAX_HASHTAGS_AMOUNT = 5;
var MAX_HASHTAG_LENGTH = 20;
var HASHTAG_PATTERN = /^([#]{1})([0-9a-zа-яё]{1,19})$/g;

var textHashtags = document.querySelector('.text__hashtags');

var splitHashtags = function (inputString) {
  var hashtags = inputString.split(' ');
  return hashtags;
};

var removeAdditionalSpaces = function (allHashtags) {
  var notEmptyHashtags = [];
  for (var j = 0; j < allHashtags.length; j++) {
    if (allHashtags[j] !== '') {
      notEmptyHashtags.push(allHashtags[j]);
    }
  }
  return notEmptyHashtags;
};

var pushErrorMessage = function (message, errorMessages) {
  if (errorMessages.indexOf(message) === -1) {
    errorMessages.push(message);
  }

  return errorMessages;
};

var createValidityMessages = function (notEmptyHashtags) {
  var validityMessages = [];

  if (notEmptyHashtags.length > MAX_HASHTAGS_AMOUNT) {
    pushErrorMessage('Хеш-тегов не должно быть больше ' + MAX_HASHTAGS_AMOUNT + ' .', validityMessages);
  }

  for (var j = 0; j < notEmptyHashtags.length; j++) {
    var hashtag = notEmptyHashtags[j];
    if (!hashtag.startsWith('#')) {
      pushErrorMessage('Хэш-тег должен начинаться с символа # (решётка).', validityMessages);
    } else if (notEmptyHashtags.indexOf(hashtag) !== notEmptyHashtags.lastIndexOf(hashtag)) {
      pushErrorMessage('Один и тот же хэш-тег не может быть использован дважды.', validityMessages);
    } else if (hashtag.length === 1) {
      pushErrorMessage('Хеш-тег не может состоять из одного символа.', validityMessages);
    } else if (hashtag.length > MAX_HASHTAG_LENGTH) {
      pushErrorMessage('Хеш-тег не может состоять из более чем ' + MAX_HASHTAG_LENGTH + ' символов.', validityMessages);
    } else if (!hashtag.match(HASHTAG_PATTERN)) {
      pushErrorMessage('Хеш-тег должен состоять только из букв и цифр.', validityMessages);
    }
  }
  return validityMessages;
};

var onHashtagsKeyup = function () {
  var inputValue = textHashtags.value.toLowerCase();
  var dirtyHashtags = splitHashtags(inputValue);
  var cleanHashtags = removeAdditionalSpaces(dirtyHashtags);
  var errors = createValidityMessages(cleanHashtags);

  if (errors.length !== 0) {
    textHashtags.setCustomValidity(errors.join(' \n'));
  } else {
    textHashtags.setCustomValidity('');
  }
};

textHashtags.addEventListener('blur', onHashtagsKeyup);

// Потеря фокуса на textHashtags.

var onImgUploadKeydownClick = function () {
  imgUpload.removeEventListener('keydown', onKeydownEsc);
};

var onImgUploadKeydownKeydown = function () {
  imgUpload.removeEventListener('keydown', onKeydownEsc);
};

var onFocusoutClick = function () {
  imgUpload.addEventListener('keydown', onKeydownEsc);
};

textHashtags.addEventListener('click', onImgUploadKeydownClick);

textHashtags.addEventListener('keydown', onImgUploadKeydownKeydown);

textHashtags.addEventListener('focusout', onFocusoutClick);

// Просмотр любой фотографии в полноразмерном режиме.

var bigPicture = document.querySelector('.big-picture');
var bigPictureImg = bigPicture.querySelector('.big-picture__img').querySelector('img');
var socialCaption = bigPicture.querySelector('.social__caption');
var likesCount = bigPicture.querySelector('.likes-count');
var socialCommentCount = bigPicture.querySelector('.social__comment-count');
var bigPictureCancel = bigPicture.querySelector('#picture-cancel');
var socialCommentsBigPicture = bigPicture.querySelector('.social__comments');
var ENTER_KEY = 'Enter';

// Ниже, я запутался с "магическими кнопками". Сколько, по количеству, должно быть функций что бы при нажатие открывалась фотография?
// На клавиши и на мышку нужны отдельные функции? И могут ли они в итоге соединяться к одной, где и будет весь код: открытия-закрытия?
// Или нужно что бы функции на мышку и кнопки вообще не пересекались?
// Вроде все работает но как то запутанно и много дублирующего кода.
// И не получилось сделать чтоб от ENTER_KEY = 'Enter' открывалась фотография.
var bigPictureRemoveHidden = function () {
  bigPicture.classList.remove('hidden');
};

var onButtonBigPictureCancelClick = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onButtonBigPictureCancelKeydown);
  bigPictureCancel.removeEventListener('click', onButtonBigPictureCancelClick);
  document.addEventListener('click', onFullScreenViewing);
};

var onButtonBigPictureCancelKeydown = function (evt) {
  if (evt.key === ESC_KEY) {
    bigPicture.classList.add('hidden');
  }
  bigPictureCancel.removeEventListener('click', onButtonBigPictureCancelClick);
  document.removeEventListener('keydown', onButtonBigPictureCancelKeydown);
  document.addEventListener('click', onFullScreenViewing);
};

var onFullScreenViewing = function (evt) {
  if (evt.target.classList.contains('picture__img')) {
    var selectedImage = evt.target.src;
    for (var k = 0; k < 25; k++) {
      // Как правильно сделать проверку в этом месте?
      // Я хотел найти объект на который нажал пользователь. И придумал искать по названиию ссылки.
      if (selectedImage == 'file:///C:/Users/dimar/Desktop/kekstagram/1091919-kekstagram-19/' + arrayUsers[k].url) {
        socialCaption.textContent = arrayUsers[k].description;
        likesCount.textContent = arrayUsers[k].likes;
        socialCommentCount.textContent = arrayUsers[k].comments().length;  // Как вставить текст, потом тег с текстом, а потом опять текст?
      }
    }

    var fragment2 = document.createDocumentFragment();
    for (var c = 0; c < resultArrayComment.length; c++) {
      fragment2.appendChild(renderComment(c));
    }
    socialCommentsBigPicture.appendChild(fragment2);

    bigPictureImg.src = selectedImage;
    bigPictureRemoveHidden();
    bigPictureCancel.addEventListener('click', onButtonBigPictureCancelClick);
    document.addEventListener('keydown', onButtonBigPictureCancelKeydown);
    document.removeEventListener('click', onFullScreenViewing);
  }
};

document.addEventListener('click', onFullScreenViewing);

// Потеря фокуса на social__footer-text.
// Правильно ли количество фукнций и их названия? Получается что и по клавиатуре и по кнопке запускается одна и таже функция.

var socialFooterText = bigPicture.querySelector('.social__footer-text');

var onInputSocialFooterTextClick = function () {
  document.removeEventListener('keydown', onButtonBigPictureCancelKeydown);
};

var onInputSocialFooterTextKeydown = function () {
  document.removeEventListener('keydown', onButtonBigPictureCancelKeydown);
};

var onInputSocialFooterTextFocusoutClick = function () {
  document.addEventListener('keydown', onButtonBigPictureCancelKeydown);
};

socialFooterText.addEventListener('click', onInputSocialFooterTextClick);

socialFooterText.addEventListener('keydown', onInputSocialFooterTextKeydown);

socialFooterText.addEventListener('focusout', onInputSocialFooterTextFocusoutClick);

