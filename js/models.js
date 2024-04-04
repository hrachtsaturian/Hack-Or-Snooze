"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";


class Story {

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  getHostName() {
    return new URL(this.url).origin;
  }
}

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  static async getStories() {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    const stories = response.data.stories.map((story) => new Story(story));

    return new StoryList(stories);
  }

  static async addStory(author, title, url, token) {
    await axios({
      url: `${BASE_URL}/stories`,
      method: "POST",
      data: {
        token,
        story: {
          author,
          title,
          url,
        },
      },
    });
  }

  static async addFavorite(user, storyId) {
    const { username, loginToken } = user

    const res = await axios({
      url: `${BASE_URL}/users/${username}/favorites/${storyId}`,
      method: "POST",
      data: {
        token: loginToken
      }
    });

    currentUser = new User(res.data.user, loginToken);
  }

  static async removeFavorite(user, storyId) {
    const { username, loginToken } = user

    const res = await axios({
      url: `${BASE_URL}/users/${username}/favorites/${storyId}`,
      method: "DELETE",
      data: {
        token: loginToken
      }
    });

    currentUser = new User(res.data.user, loginToken);
  }

  static async removeMyStory(user, storyId) {
    await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "DELETE",
      data: {
        token: user.loginToken
      }
    });
  }
}

/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {

  constructor(
    { username, name, createdAt, favorites = [], ownStories = [] },
    token
  ) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map((s) => new Story(s));
    this.ownStories = ownStories.map((s) => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }


  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
}
