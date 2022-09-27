import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../../sass/components/subcomponents/formModal.scss";
const FormModal = ({ closeModal }) => {
  // Default cho login = true mở sẵn.. khi lick dô thì login = false còn register = true
  // để đóng tab login mở tab reigister rùi ngược lại
  // đẳng cấp z Tủn
  const [login, setLogin] = useState(true);
  // const [register, setRegister] = useState(false);

  return (
    // làm thêm hiện ứng zoom khi mở modal
    <div className="modal">
      <div className="modal-form">
        <button className="btnX" onClick={() => closeModal(false)}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        {/* customize code */}
        {login ? (
          <Login ModalLogin={setLogin} />
        ) : (
          <Register ModalLogin={setLogin} />
        )}

        {/* {login && <Login ModalLogin={setLogin} ModalRegister={setRegister} />}
        {register && (
          <Register ModalLogin={setLogin} ModalRegister={setRegister} />
        )} */}
      </div>
    </div>
  );
};

export default FormModal;
