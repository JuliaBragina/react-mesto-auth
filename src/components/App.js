import React, { useState, useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import api from '../utils/Api.js';
import '../index.css';
import { CurrenUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectCard, setSelectCard] = useState(null);
  const [currenUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.getAllCards()
    .then(res => setCards(res))
    .catch(err => alert(err));

    api.getUser()
    .then(res => setCurrentUser(res))
    .catch(err => alert(err));
  }, []);

  const onCardClick = (cards) => setSelectCard(cards);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCloseButton() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectCard(null);
  }

  function handleUpdateUser(data) {
    setIsLoading(true);
    api.setUserInfo(data)
    .then((newUser) => {
      setCurrentUser(newUser); 
      handleCloseButton();
    })
    .catch(err => alert(err))
    .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api.setUserAvatar(data)
    .then((newAvatar) => {
      setCurrentUser(newAvatar);
      handleCloseButton();
    })
    .catch(err => alert(err))
    .finally(() => setIsLoading(false));
  }

  function handleAddPlace(data) {
    setIsLoading(true);
    api.addCards(data)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      handleCloseButton();
    })
    .catch(err => alert(err))
    .finally(() => setIsLoading(false));
  }

  function handleCardLike(data, currenUser) {
    const isLiked = data.likes.some(i => i._id === currenUser._id);
    api.changeLikeCardStatus(data._id, !isLiked)
    .then((newCard) => {
      setCards((state) => state.map((c) => c._id === data._id ? newCard : c));
    })
    .catch(err => alert(err));
  } 

  function handleCardDelete(idCard) {
    api.deletCard(idCard)
    .then(() => {
      setCards(cards => cards.filter(c => c._id != idCard));
    })
    .catch(err => alert(err));
  }

  return (
    <CurrenUserContext.Provider value={currenUser}>
      <div className="App">
          <div className="page">
            <Header />
            <Main 
              data={cards} 
              onEditAvatar={handleEditAvatarClick} 
              onEditProfile={handleEditProfileClick} 
              onAddPlace={handleAddPlaceClick} 
              onCardClick={onCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete} />
            <Footer />
          </div>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={handleCloseButton}
            onUpdateUser={handleUpdateUser}
            onLoading={isLoading} />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={handleCloseButton}
            onUpdateAvatar={handleUpdateAvatar}
            onLoading={isLoading} />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={handleCloseButton}
            onAddCard={handleAddPlace}
            onLoading={isLoading} />

          <PopupWithForm 
            name={"delete"}
            formTitle={"Вы уверенны?"}
            buttonText={"Да"} />

          <ImagePopup card={selectCard} onClose={handleCloseButton}/>
      </div>
    </CurrenUserContext.Provider>
  );
}

export default App;
