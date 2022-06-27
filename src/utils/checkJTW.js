export const BASE_URL = 'https://auth.nomoreparties.co';

export function checkJTW(jwt) {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization" : `Bearer ${jwt}`
    }
  }).then((res) => {
      if(res.ok){
        return res.json();
      }
      return Promise.reject('Произошла ошибка');
    }
  );
};
