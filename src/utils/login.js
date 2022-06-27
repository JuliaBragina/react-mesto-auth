export const BASE_URL = 'https://auth.nomoreparties.co';

function login(email, password) {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  }).then((res) => {
      if(res.ok){
        return res.json();
      }
      return Promise.reject('Произошла ошибка');
    }
  );
};

export default login;

