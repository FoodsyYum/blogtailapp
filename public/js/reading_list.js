'use strict';

/**
 * custom module
 */
import dialog from './dialog.js';

// Select the reading list buttom element and reading list number
const $readingListBtn = document.querySelector('[data-reading-list-btn]');
const $readingListNumber = document.querySelector('[data-reading-list-number]');

const addToReadingList = async () => {
    try {

        // Send a put reuest to the readingList endpoint
        const response = await fetch(`${window.location}/readingList`, {
            method: 'PUT'
        });

        // Handle case where response is successful
        if (response.ok) {
            // Active reading list button and increase the reading number
            $readingListBtn.classList.add('active');
            $readingListNumber.textContent = Number($readingListNumber.textContent) + 1;
        }

        // Handle case where response is 401 (Unauthorized)
        if (response.status === 401) {
            const $dialog = dialog({
                title: 'Login to continue',
                content: `We're a place where coders share, stay up-tp-date and grow their careers. So, make a account to unlock all the feature like creating blogs, reacting or adding them to reading list and more...`
            });

            document.body.appendChild($dialog);
        }

    } catch (error) {
        // log any errors
        console.log('Error adding reading list: ', error.message);
    }
}

/**
 * Removes the current blog from the user's reading list asynchronously
 * 
 * @throws {Error} - If an error occurs during the removal process.
 */

const removeFromReadingList = async () => {
    try {

        // Send a DELETE request to the reaction endpoint
        const response = await fetch(`${window.location}/readingList`, {
            method: 'DELETE'
        });

        // Handle case where response is successful
        if (response.ok) {
            // Inactive reading list button and decrease the reaction number
            $readingListBtn.classList.remove('active');
            $readingListNumber.textContent = Number($readingListNumber.textContent) - 1;
        }

    } catch (error) {

        // Log error
        console.error('Error removing from reading list: ', error.message);

    }
}

//  Add event listener for click event
$readingListBtn.addEventListener('click', async function () {
    $readingListBtn.setAttribute('disabled', '');

    if (!$readingListBtn.classList.contains('active')) {
        await addToReadingList();
    } else {
        await removeFromReadingList();
    }

    $readingListBtn.removeAttribute('disabled');
});