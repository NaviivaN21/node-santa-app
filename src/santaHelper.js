const moment = require('moment');
const axios = require('axios');
const {
    URL_USERPROFILES,
    URL_USERS
} = require('./constants.js');

// DEFINE HELPERS
const search = (arr, searchParam, field) => arr.find(e => e[field] === searchParam);
const searchUser = (arr, userid) => search(arr, userid, 'username');
const searchUserProfile = (arr, userid) => search(arr, userid, 'userUid');

const isStringAllSpaces = str => !str.trim().length;
const isUserIdAllSpaces = str => isStringAllSpaces(str);

const renderScreen = (res, screen, error) => res.render(screen, {error});
const renderErrorScreen = (res, error) => renderScreen(res, 'error', error);
const renderConfirmScreen = (res) => renderScreen(res, 'confirm');

const getRegisteredUsersFromURL = async () => await axios.get(URL_USERS);
const getUserProfilesFromURL = async () => await axios.get(URL_USERPROFILES);

const isDateFormatValid = date => moment(date, 'YYYY/MM/DD',true).isValid();
const getAge = birthday => new Date(new Date() - new Date(birthday)).getFullYear() - 1970;

module.exports = {
    search,
    searchUser,
    searchUserProfile,
    isStringAllSpaces,
    isUserIdAllSpaces,
    renderScreen,
    renderErrorScreen,
    renderConfirmScreen,
    getRegisteredUsersFromURL,
    getUserProfilesFromURL,
    isDateFormatValid,
    getAge,
}