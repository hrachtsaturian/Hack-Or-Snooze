"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

function navSubmit(evt) {
  console.debug("navSubmit", evt);
  showNewPostForm();
  putStoriesOnPage();
}

function navFavorites(evt) {
  console.debug("navFavorites", evt);
  hidePageComponents();
  showFavoriteStories();
}

function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  showMyStories();
}

function navMyProfile(evt) {
  console.debug('navMyProfile', evt);
  hidePageComponents();
  showProfileInfo();
}

$body.on("click", "#nav-all", navAllStories);
$body.on("click", "#nav-submit", navSubmit);
$body.on("click", "#nav-favorites", navFavorites);
$body.on("click", "#nav-mystories", navMyStories);
$body.on("click", "#nav-user-profile", navMyProfile);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $(".nav-tab").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
