"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

function generateStoryMarkup(story, showTrashIcon) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // if story is included in currentUser.favorites -> fas
  // if story is not included in currentUser.favorites -> far

  let starStatusClass = "far";

  const myFavorites = currentUser?.favorites || [];

  const favoriteStoryIds = myFavorites.map((e) => {
    return e.storyId;
  });
  if (favoriteStoryIds.includes(story.storyId)) {
    starStatusClass = "fas";
  }

  return $(`
      <li id="${story.storyId}">
        <i class="fas fa-trash-alt ${showTrashIcon ? '' : 'hidden'}"></i>
        <i class="${starStatusClass} fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <br>
        <small class="story-author">by ${story.author}</small>
        <br>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $storiesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $storiesList.append($story);
  }

  $storiesList.show();
}

function showFavoriteStories() {
  $storiesList.empty();

  const favoriteStoryIds = currentUser.favorites?.map((e) => e.storyId);

  const favoriteStories = storyList.stories.filter((story) =>
    favoriteStoryIds.includes(story.storyId)
  )

  for (let story of favoriteStories) {
    const $story = generateStoryMarkup(story);
    $storiesList.append($story);
  }

  if (favoriteStories.length === 0) {
    $storiesList.append('No favorites added!');
  }

  $storiesList.show();
}


function showMyStories() {
  $storiesList.empty();

  const myStories = storyList.stories.filter((story) => {
    return story.username === currentUser.username;
  });

  const showTrashIcon = true;

  for (let story of myStories) {
    const $story = generateStoryMarkup(story, showTrashIcon);
    $storiesList.append($story);
  }

  if (myStories.length === 0) {
    $storiesList.append('No stories added by user yet!');
  }

  $storiesList.show();
}

async function submitNewPost(evt) {
  console.debug("submitNewPost", evt);
  evt.preventDefault();

  const author = $("#new-post-author").val();
  const title = $("#new-post-title").val();
  const url = $("#new-post-url").val();
  const { loginToken } = currentUser;

  await StoryList.addStory(author, title, url, loginToken)

  $newPostForm.trigger("reset");
  $newPostForm.hide();

  await getAndShowStoriesOnStart();
}

$newPostForm.on("submit", submitNewPost);

async function handleClickStar(event) {
  const storyId = event.target.parentElement.attributes[0].value;

  const myFavorites = currentUser.favorites || []

  const favoriteStoryIds = myFavorites.map((e) => {
    return e.storyId;
  });

  if (favoriteStoryIds.includes(storyId)) {
    await StoryList.removeFavorite(currentUser, storyId);
    event.target.classList.remove("fas");
    event.target.classList.add("far");
  } else {
    await StoryList.addFavorite(currentUser, storyId);
    event.target.classList.remove("far");
    event.target.classList.add("fas");
  }
}

$storiesList.on("click", ".fa-star", handleClickStar)

async function deleteMyStory(event) {
  const storyId = event.target.parentElement.attributes[0].value;
  await StoryList.removeMyStory(currentUser, storyId);

  await getAndShowStoriesOnStart();
  showMyStories();
}


$storiesList.on("click", ".fa-trash-alt", deleteMyStory);

