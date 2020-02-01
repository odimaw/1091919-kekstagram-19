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

for (var i = 0; i < 25; i++) {
  arrayUsers[i] = {
    url: 'photos/' + (i + 1) + '.jpg',
    description: '',
    likes: getRandomInRange(15, 200),
    comments: function () {
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
    },
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

for (var j = 0; j < 25; j++) {
  fragment.appendChild(renderFoto(j));
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

showPicture();

