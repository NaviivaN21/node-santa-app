const express = require('express');
const moment = require('moment');
const axios = require('axios');
const pendingWishes = require('../../sharedData.js');

const santaRouter = express.Router();
const ERROR = {
    childNotRegistered: 'You are not registered! Please do good things next time',
    childAgeMoreThanTen: 'You are not a child anymore!',
    invalidBirthDate: 'Invalid Birthdate',
    internalError: 'Internal Error'
}
const URL_USERPROFILES = 'https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json';
const URL_USERS = 'https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json';

// DEFINE HELPERS
const search = (arr, searchParam, field) => arr.find(e => e[field] === searchParam)
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

// DEFINE ENDPOINTS
santaRouter.get('', async(req, res) => {
    res.render('santa');
});

santaRouter.post('', async(req,res) => {
    try {
        const {username, wish} = req.body;
        if (isUserIdAllSpaces(username)) {
            renderErrorScreen(res, ERROR.childNotRegistered);
            return;
        }
 
        // Get registered users from URL
        const registeredUsers = await getRegisteredUsersFromURL();

        // From the registered users, search the input user. If exist, return userId
        const user = searchUser(registeredUsers.data, username);
        
        // Is child not registered?
        if (user === null || user === undefined) {
            renderErrorScreen(res, ERROR.childNotRegistered);
            return;
        }
       
        const userId = user.uid;

        // Get user profile from URL
        const userProfileInfo = await getUserProfilesFromURL(); // [userUid, address, birthdate]
        // Get user profile
        const userProfile = searchUserProfile(userProfileInfo.data, userId);
        const {address , birthdate} = userProfile;

        // Is Date format not valid?
        if (!isDateFormatValid(birthdate)) {
            renderErrorScreen(res, ERROR.invalidBirthDate);
            return;
        }

        //Is Child's Age greater than 10?
        if (getAge(birthdate) > 10) {
            renderErrorScreen(res, ERROR.childAgeMoreThanTen);
            return;
        }

        // Push the wish to the global variable
        pendingWishes.push({username, address, wish});
        renderConfirmScreen(res);

    } catch(e) {
        console.log(e);
        renderErrorScreen(res, ERROR.internalError);
    }
});

module.exports = santaRouter;