export const updateUserGlobally = (user) => {

  // update localStorage
  localStorage.setItem("user", JSON.stringify(user));

  // notify entire app
  window.dispatchEvent(new Event("userUpdated"));

};