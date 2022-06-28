import React, { useState, useEffect } from 'react';
import { Redirect, Switch, Route, useHistory } from "react-router-dom";
import { CurrenUserContext } from '../contexts/CurrentUserContext';
import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import api from '../utils/Api.js';
import * as auth from '../utils/Auth.js'
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Login from './Login.js';
import Register from './Register.js';
import InfoTooltip from './InfoTooltip';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectCard, setSelectCard] = useState(null);
  const [currenUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isRegPopupOpen, setIsRegPopupOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if(loggedIn){
      console.log(loggedIn);
      api.getAllCards()
      .then(res => setCards(res))
      .catch(err => alert(err));

      api.getUser()
      .then(res => setCurrentUser(res))
      .catch(err => alert(err));
    }
  }, [loggedIn]);

  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(() => {
    if(loggedIn){
      history.push('/mesto-react-auth');
    } else {
      localStorage.removeItem('token');
      history.push('/sign-in');
    }
  }, [loggedIn]);

  const onCardClick = (cards) => setSelectCard(cards);

  const onLoggedIn = () => {
    setLoggedIn(false);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  function handleCloseButton() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsRegPopupOpen(false);
    setSelectCard(null);
  }

  function handleCloseWindow() {
    localStorage.removeItem('token');
    history.push('/sign-in');
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

  function handleRegisterUser(data){
    auth.register(data.email, data.password)
    .then((res) => {
      history.push('/sign-in');
      setIsRegPopupOpen(true);
      setIsRegister(true);
    })
    .catch(() => {
      setIsRegister(false);
      setIsRegPopupOpen(true);
    });
  }

  function handleLoggedUser(data) {
    setUserEmail(data.email);
    auth.login(data.email, data.password)
    .then((res) => {
      if(res.token){
        localStorage.setItem('token', res.token);
        history.push("/mesto-react-auth");
        setLoggedIn(true);
      }
    })
    .catch(() => {
      setIsRegister(false);
      setIsRegPopupOpen(true);
    });
  }

  function tokenCheck() {
    const jwt = localStorage.getItem('token');
    if(jwt){
      auth.checkJTW(jwt)
      .then((res) => {
        setUserData(res);
        setUserEmail(res.data.email);
        history.push('/mesto-react-auth');
        setLoggedIn(true);
    })
      .catch(() => {
        setIsRegister(false);
        setIsRegPopupOpen(true);
      });
  };}

  return (
    <CurrenUserContext.Provider value={currenUser}>
      <div className="App">
        <div className="page">
          <Switch>
            <Route path="/sign-in">
              <Header pathNav={"/sign-up"} emailText={false} buttonTitle={"Зарегистрироваться"} />
              <Login onLoggedUser={handleLoggedUser} />
            </Route>
            <Route path="/sign-up">
              <Header pathNav={"/sign-in"} emailText={false} buttonTitle={"Войти"} />
              <Register onRegisterUser={handleRegisterUser} />
            </Route>
            <ProtectedRoute exact
              loggedIn={loggedIn}
              path="/mesto-react-auth"
              onLoggedout={onLoggedIn}
              componentHeader={Header}
              isMenuOpen={isMenuOpen}
              onOpenMenu={handleOpenMenu}
              buttonTitle={"Выход"}
              emailText={userEmail}
              onSignOut={handleCloseWindow}
              pathNav={"/sign-in"}
              componentMain={Main}
              data={cards}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={onCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              componentFooter={Footer} >
            </ProtectedRoute>
            <Route exact path="/">
              {loggedIn ? <Redirect to="/mesto-react-auth" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>
        </div>

        <InfoTooltip 
          name={"info"}
          isOpen={isRegPopupOpen}
          onClose={handleCloseButton}
          isRegister={isRegister} />

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
