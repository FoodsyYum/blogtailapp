'use strict';

/**
 * import modules
 */
import Snackbar from './snackbar.js';
import imagePreview from './utils/imagePreview.js';
import imageAsDataURL from './utils/imageAsDataURL.js';
import config from './config.js';

// Selectors for image field, image preview, and clear preview button
const $imageField = document.querySelector('[data-image-field]');
const $imagePreview = document.querySelector('[data-image-preview]');
const $imagePreviewClear = document.querySelector('[data-image-preview-clear]');

// Event listener for image field change to trigger image preview
$imageField.addEventListener('change', () => {
    imagePreview($imageField, $imagePreview);
});

/**
 * Clears the image preview by removing the 'show' class from the preview container.
 */
const clearImagePreview = function () {
    $imagePreview.classList.remove('show');
    $imagePreview.innerHTML = '';
    $imageField.value = '';
}

$imagePreviewClear.addEventListener('click', clearImagePreview);

/**
 * Basic info update functionality
 */

const $basicInfoForm = document.querySelector('[data-basic-info-form]');
const $basicInfoSubmit = document.querySelector('[data-basic-info-submit]');
const oldFormData = new FormData($basicInfoForm);
const $progressBar = document.querySelector('[data-progress-bar]');

/**
 * Update basic information of the user profile
 * @param {Event} event - The event object representing the form submission.
 */
const updateBasicInfo = async (event) => {

    // Preventing default form submission behavior
    event.preventDefault();

    // Disable publish button to prevent multiple submissions
    $basicInfoSubmit.setAttribute('disabled', '');

    // Create FormData object to capture basic info form data.
    const formData = new FormData($basicInfoForm);

    // Handle case where selected iamge size is large than 1MB.
    if (formData.get('profilePhoto').size > config.profielPhoto.maxByteSize) {
        // Enable submit button and show error message
        $basicInfoSubmit.removeAttribute('disabled');
        Snackbar({
            type: 'error',
            message: 'Your profile photo should be less than 1MB.'
        });
        return;
    }

    // Handle case where user not selected any image for profilePhoto
    if (!formData.get('profilePhoto').size) {
        formData.delete('profilePhoto');
    }

    // Handle case where profilePhoto field exists
    if (formData.get('profilePhoto')) {
        // Overwrite profilePhoto value (which is type of 'File') to base64
        formData.set('profilePhoto', await imageAsDataURL($imageField.files[0]));
    }

    // Handle case where user did not change username
    if (formData.get('username') === oldFormData.get('username')) {
        formData.delete('username');
    }

    // Handle case where user did not change email
    if (formData.get('email') === oldFormData.get('email')) {
        formData.delete('email');
    }

    // Create request body from formData
    const body = Object.fromEntries(formData.entries());

    // Show progress bar
    $progressBar.classList.add('loading');

    // Send form data to the server for update profile basic info.
    const response = await fetch(`${window.location.href}/basic_info`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    // Handle case where response is success
    if (response.ok) {
        // Enable submit button, show updated message and reload window
        $basicInfoSubmit.removeAttribute('disabled');
        $progressBar.classList.remove('loading-end');
        Snackbar({ message: 'Your profile has been updated.' });
        window.location.reload();
    }

    // Handle case where response status is 400 (Bad request)
    if (response.status === 400) {
        // Enable submit button and show error message
        $basicInfoSubmit.removeAttribute('disabled');
        $progressBar.classList.remove('loading-end');
        const { message } = await response.json();
        Snackbar({
            type: 'error',
            message
        });
    }

}

$basicInfoForm.addEventListener('submit', updateBasicInfo);