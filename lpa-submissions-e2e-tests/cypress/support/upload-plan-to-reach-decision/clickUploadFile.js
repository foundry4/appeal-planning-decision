/// <reference types = "Cypress"/>
import ClickUploadFileButton from '../PageObjects/UploadThePlanToReachDecisionPageObjects';
const uploadFile = new ClickUploadFileButton();
module.exports = () => {
  uploadFile.clickUploadFileButton();
};
