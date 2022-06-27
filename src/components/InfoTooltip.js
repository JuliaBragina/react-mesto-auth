import React from "react";
import unionSucces from '../images/Union.svg';
import unionFalled from '../images/Union2.svg'

function InfoTooltip({ name, isOpen, onClose, isRegister }) {
  return (
    <div className={`popup-${name} popup ${isOpen && "popup_is_opened"}`}>
      <div className={`popup-${name}__container popup__container`}>
        <button type="button" className={`popup-${name}__close popup__close`} onClick={onClose}></button>
        <div className="popup__information">
          {isRegister 
            ?
              <>
                <img className="popup__image" src={unionSucces}></img>
                <p className="popup__description">Вы успешно зарегистрировались!</p>
              </>
            :
              <>
                <img className="popup__image" src={unionFalled}></img>
                <p className="popup__description">Что-то пошло не так! Попробуйте ещё раз.</p>
              </>
          }
        </div>
      </div>
    </div>       
  );
};

export default InfoTooltip;