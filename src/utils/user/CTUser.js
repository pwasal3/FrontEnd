/**
 * The object for setting up user (get token & userId) 
 *  and get user information 
 */

import _ from 'lodash'
import decoder from 'jwt-decode'
import { CTAuth0 } from './CTAuth0'
import { api } from '../cthttp'
import { links } from '../links'
import { env } from 'utils/env'
import { prompt } from '../prompt'

// keys to localStorage
export const TOKEN_INFO_KEY = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
export const USER_INFO_KEY = 'userInfo'
export const AUTH_TOKEN_KEY = 'authToken'
export const TEST_USER_INFO_KEY = 'testUserInfo'
export const LATEST_COMMIT_SHA_KEY = 'latest-sha'
// Possible roles of a user
export const ROLE_ADMIN = 'Admin'
export const ROLE_INST = 'Instructor'

const auth0Client = new CTAuth0()


export class CTUser {
  constructor() {
    this.signin = this.signin.bind(this)
    this.reSignin = this.reSignin.bind(this)
    this.signout = this.signout.bind(this)
    this.validate = this.validate.bind(this)
    this.checkGitUpdates = this.checkGitUpdates.bind(this)
    this.testAccountSignIn = this.testAccountSignIn.bind(this)
    this.loginAsAccountSignIn = this.loginAsAccountSignIn.bind(this)
    this.loginAsAccountSignOut = this.loginAsAccountSignOut.bind(this)
  }

  // ---------------------------------------------------------------------------
  // Sign in/out actions
  // ---------------------------------------------------------------------------

  // Login the user
  signin(options={ allowTestSignIn: false }) {
    if (env.dev && options.allowTestSignIn) {
      this.testAccountSignIn()
    } else {
      auth0Client.signIn()
    }
  }

  // login the user and clear the localStorage
  reSignin() {
    localStorage.clear()
    this.signin()
  }

  // logout the user
  signout () { 
    // remove possible localStorage
    // let userInfo = this.getUserInfo()
    // console.log(userInfo, env._baseURL)
    localStorage.clear()
    if (env.dev) {
      window.location = window.location.origin
    } else {
      auth0Client.signOut()
    }
  }

  /**
   * Setup user after loading user info and `id_token` from Auth0
   */
  async setUpUser() {
    if (!this.isLoggedIn) {
      // load user info and `id_token` from Auth0
      try {
        await auth0Client.handleAuthentication()
      } catch (error) {
        console.error('Failed to parse Auth0 id_token', error)
        return
      }
      
      // get authToken from backend using auth0's `id_token`
      try {
        let id_token = auth0Client.getAuth0Token()
        const { data } = await api.accountSignIn(id_token)
        // Save AuthToken
        this.authToken = data.authToken
        // Save userInfo
        this.saveUserInfo(data)
      } catch (error) {
        console.error('Failed to get user data and auth token from backend', error)
        // this.signin()
        return
      }

      // start redirecting
      let redirectURL = auth0Client.getRedirectURL() // default redirect url
      const tokenInfo = decoder(this.authToken)
      const roles = tokenInfo[TOKEN_INFO_KEY]
      // redirect admins and instructors to their page
      if (redirectURL === links.home() && roles) {
        if (this.isAdmin) {
          redirectURL = links.admin()
        } else if (this.isInstructor) {
          redirectURL = links.instructor()
        }
      }

      window.location = redirectURL
    } else {
      window.location = auth0Client.getRedirectURL()
    }
  }


  // ---------------------------------------------------------------------------
  // User validation handlers
  // ---------------------------------------------------------------------------

  // check if a user is valid
  async validate() {
    if (links.isEqual(links.signin())) return
    if (links.isEqual(links.logout())) return
    await this.checkGitUpdates()
    if (!this.isLoggedIn) return;
    await this.checkExpiration()
    // api.contentLoaded()
    return true
  }

  // check if the auth token is valid
  async checkExpiration() {
    let { exp } = this.getUserInfo()
    if (!Boolean(exp)) return

    exp = new Date(exp)

    // if authToken expired relogin the user
    if (exp < new Date()) {
      this.reSignin()
    }
  }

  // check if the there is a new commit to master
  async checkGitUpdates() {
    try {
      let latestSHA = await api.getLatestGitCommitSHA()
      let localSHA = localStorage.getItem(LATEST_COMMIT_SHA_KEY)
      // console.log(localSHA, latestSHA, localSHA === latestSHA)
      // if it's a first time user, store the latest commit SHA
      if (!localSHA && !this.isLoggedIn) {
        localStorage.setItem(LATEST_COMMIT_SHA_KEY, latestSHA)
        window.location.reload(true)
      }
      // if there is a new commit, forcely reload the page from server
      else if (!localSHA || localSHA !== latestSHA) {
        localStorage.setItem(LATEST_COMMIT_SHA_KEY, latestSHA)
        window.location.reload(true)
      }
    } catch (error) {
      console.error("Failed to checking the latest commit's SHA on master.")
    }
  }


  // ---------------------------------------------------------------------------
  // User info handlers
  // ---------------------------------------------------------------------------

  /**
   * Function used to save user info to localStorage
   * @param {Object} userInfo 
   */
  saveUserInfo (userInfo) {
    // info from JWT token
    const tokenInfo = decoder(userInfo.authToken)
    let { iss } = tokenInfo
    let exp = new Date(tokenInfo.exp * 1000) // expiration date
    // info from auth0
    const { given_name, family_name, name, picture } = auth0Client.getProfile()
    // info from CT backend
    let { emailId, universityId, userId } = userInfo
    // store userInfo in localStorage
    localStorage.setItem(USER_INFO_KEY, JSON.stringify({
      emailId, universityId, userId, exp, picture, iss,
      roles: tokenInfo[TOKEN_INFO_KEY],
      firstName: given_name || emailId,
      lastName: family_name,
      fullName: name || emailId,
    }))
  }

  /**
   * @param {Object} options options for getting user info
   * @param {Boolean} options.allowLoginAsOverride true if allow the user info be overrided by the test user
   * @returns {{
   * firstName:string,
   * lastName:string,
   * fullName:string,
   * picture:string,
   * roles:[string],
   * exp:number,
   * userId:string,
   * emailId:string,
   * universityId:string,
   * authToken:string,
   * metadata:Object 
   * }} userInfo
   */
  getUserInfo (options={ allowLoginAsOverride: true }) {
    
    // if allow the user info be overrided by the test user
    if (options.allowLoginAsOverride && this.isLoginAsAccount) {
      return this.getLoginAsUserInfo()
    }

    let userInfoStr = localStorage.getItem(USER_INFO_KEY)
    // console.log(JSON.parse(userInfoStr))
    return userInfoStr ? JSON.parse(userInfoStr) : {}
  }

  // returns the id of the user, or test id if it exists
  /**
   * @returns {string} userId
   */
  get userId() {

    if (links.isEqual(links.admin())) { // if it's in admin page
      return this.getUserInfo().userId
    }

    return this.getLoginAsUserInfo().userId || this.getUserInfo().userId
  }

  // set the authorization token
  set authToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }

  // return the authorization token
  get authToken() {
    if (links.isEqual(links.admin())) { // if it's in admin page
      return localStorage.getItem(AUTH_TOKEN_KEY)
    }

    return this.getLoginAsUserInfo().authToken || localStorage.getItem(AUTH_TOKEN_KEY)
  }

  // return true if the user is logged in
  get isLoggedIn() {
    return Boolean(this.userId)
  }

  // return true if the user is an admin
  get isAdmin() {
    let roles = this.getUserInfo({ allowLoginAsOverride: false }).roles || []
    return _.includes(roles, ROLE_ADMIN)
  }

  // return true if the user is an instructor
  get isInstructor() {
    let roles = this.getUserInfo({ allowLoginAsOverride: false }).roles || []
    return _.includes(roles, ROLE_INST)
  }


  // ---------------------------------------------------------------------------
  // Admin - Login as another account - handlers
  // ---------------------------------------------------------------------------

  // return true if an admin is logged in as another account
  get isLoginAsAccount() {
    return Boolean(this.getLoginAsUserInfo().emailId)
  }

  // return the testing user info if an admin is logged in as another account
  getLoginAsUserInfo() {
    // return {}
    let dataStr = localStorage.getItem(TEST_USER_INFO_KEY)
    return dataStr ? JSON.parse(dataStr) : {}
  }

  // for admin to sign in as another account
  async loginAsAccountSignIn(emailId) {
    try {
      const { data } = await api.loginAsAccountSignIn(emailId)
      console.log(data)
      localStorage.setItem(TEST_USER_INFO_KEY, JSON.stringify(data))
      window.location.reload()
      // console.log(data)
    } catch (error) {
      prompt.addOne({
        text: `Failed to sign in as ${emailId}`, 
        status: 'error'
      })
    }
  }

  // logout the testing account for admin
  loginAsAccountSignOut () {
    localStorage.removeItem(TEST_USER_INFO_KEY)
    window.location.reload()
  }


  // ---------------------------------------------------------------------------
  // Dev - test sign in
  // ---------------------------------------------------------------------------
  async testAccountSignIn() {
    let { data } = await api.testAccountSignIn()
    // console.log(data)
    // console.log(decoder(data.authToken))
    let { authToken } = data
    // Save AuthToken
    this.authToken = authToken
    // Save user info
    this.saveUserInfo(data)
    window.location.reload()
  }
}