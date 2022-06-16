class Api { 
  constructor (config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  _checkResponse = (res) => {
    if(res.ok){
      return res.json();
    }
    return Promise.reject('Произошла ошибка');
  }

  getAllCards() {
    return fetch (this._url + 'cards', {
      method: 'GET',
      headers: this._headers
    }).then(this._checkResponse);
  }

  addCards(data) { 
    return fetch (this._url + 'cards', {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
          name: data.name,
          link: data.link
      })
    }).then(this._checkResponse);
  }

  getUser() { 
    return fetch (this._url + 'users/me', {
      method: 'GET',
      headers: this._headers
    }).then(this._checkResponse);
  }

  setUserInfo(data) { 
    return fetch (this._url + 'users/me', {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
          name: data.name,
          about: data.about
      })
    }).then(this._checkResponse);
  }

  setUserAvatar(data) { 
    return fetch (this._url + 'users/me/avatar', {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar
      })
    }).then(this._checkResponse);
  }

  changeLikeCardStatus(cardId, isLiked) {
    return fetch (this._url + `cards/${cardId}/likes`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: this._headers
    }).then(this._checkResponse);
  }

  deletCard(cardId) { 
    return fetch (this._url + `cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers
    }).then(this._checkResponse);
  }
}

const api = new Api({
  url: 'https://mesto.nomoreparties.co/v1/cohort-40/',
  headers: {
    authorization: '5907e0a2-56a3-4cfa-b788-58e2a6027744',
    "Content-Type": "application/json"
  }
});

export default api;