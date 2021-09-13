import { useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from '../../store/auth-context';
import { FIREBASE_AUTH_API_KEY } from '../../js/config';

import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const newPasswordInputRef = useRef();
  const history = useHistory;

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value;
    // add validation
    if (enteredNewPassword.length > 6) {
      fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_AUTH_API_KEY}`,
        {
          method: 'POST',
          body: JSON.stringify({
            idToken: authCtx.token,
            password: enteredNewPassword,
            returnSecureToken: false,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => {
        // assumption: always succeeds! add proper error handling
        history.replace('/');
      });
    } else {
      alert(
        'Password must be at least 6 characters long! Please enter a valid password.'
      );
    }
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
